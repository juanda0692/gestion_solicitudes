<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

set_exception_handler(function($e){
  http_response_code(500);
  echo json_encode(['error' => 'server_error', 'message' => $e->getMessage()]);
  exit;
});

// Conexión a MySQL (puerto exclusivo 3307)
$pdo = new PDO(
  'mysql:host=127.0.0.1;port=3307;dbname=base_dest;charset=utf8mb4',
  'root',
  'Bermudez2020*',
  [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]

);

// Normaliza path y base /api
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#','',$path);
$method = $_SERVER['REQUEST_METHOD'];

function json_out($x, $status = 200) {
  http_response_code($status);
  echo json_encode($x, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
  exit;
}
function json($x){ json_out($x); }
function rows($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetchAll(); }
function row($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetch(); }

// ---------- ENDPOINTS ----------

// Healthcheck
if ($path === '/health' && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $db = true;
  try {
    $pdo->query('SELECT 1');
  } catch (Exception $e) {
    $db = false;
  }
  json(['ok' => true, 'db' => $db]);
}

// Regiones
if ($path === '/regions' && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM regiones ORDER BY nombre"));
}

// Subterritories (lista completa) — acepta EN/ES
if ($method === 'GET' && ($path === '/subterritories' || $path === '/subterritorios')) {
  // Filtro opcional por región: /subterritories?region_id=region-andina
  $regionId = $_GET['region_id'] ?? null;

  if ($regionId) {
    $data = rows($pdo,
      'SELECT id, region_id, nombre AS name
       FROM subterritorios
       WHERE region_id = ?
       ORDER BY nombre', [$regionId]);
  } else {
    $data = rows($pdo,
      'SELECT id, region_id, nombre AS name
       FROM subterritorios
       ORDER BY nombre');
  }

  json($data);
}

// Subterritorios por región — acepta EN/ES
if ($method === 'GET' && preg_match('#^/regions/([^/]+)/(subterritories|subterritorios)$#', $path, $m)) {
  $region = $m[1];
  json(rows($pdo,
    "SELECT id, nombre AS name FROM subterritorios WHERE region_id=? ORDER BY nombre",
    [$region]
  ));
}

// PDVs por subterritorio — acepta EN/ES
if ($method === 'GET' && preg_match('#^/(subterritories|subterritorios)/([^/]+)/pdvs$#', $path, $m)) {
  $subId = $m[2];
  json(rows($pdo,
    "SELECT id, nombre AS name FROM pdvs WHERE subterritorio_id=? ORDER BY nombre",
    [$subId]
  ));
}

// Canales
if ($path === '/channels' && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM canales ORDER BY nombre"));
}

// Materiales por canal (usa materiales_por_canal)
if (preg_match('#^/channels/([^/]+)/materials$#',$path,$m) && $_SERVER['REQUEST_METHOD']==='GET') {
  $sql = "SELECT m.id, m.nombre AS name, COALESCE(mpc.stock, m.stock) AS stock
          FROM materiales m
          JOIN materiales_por_canal mpc ON mpc.material_id=m.id
          WHERE mpc.canal_id=?
          ORDER BY m.nombre";
  json(rows($pdo,$sql,[$m[1]]));
}

// Catálogo materiales (opcional)
if ($path === '/materials' && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name, descripcion AS description, stock FROM materiales ORDER BY nombre"));
}

// Campañas (y si se quiere, ampliar con relaciones)
if ($path === '/campaigns' && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name, prioridad AS priority FROM campañas ORDER BY nombre"));
}

// Crear solicitud (encabezado + items)
if ($method === 'POST' && $path === '/requests') {
  $payload = json_decode(file_get_contents('php://input'), true);

  // Validación mínima
  if (!is_array($payload)) {
    json_out(['error'=>'bad_request','message'=>'JSON inválido'], 400);
  }
  if (!isset($payload['pdv_id']) || empty($payload['items']) || !is_array($payload['items'])) {
    json_out(['error'=>'bad_request','message'=>'Faltan campos: pdv_id o items'], 400);
  }

  // Campos
  $regionId       = $payload['region_id']        ?? null;  // VARCHAR
  $subterritId    = $payload['subterritorio_id'] ?? null;  // VARCHAR
  $pdvId          = $payload['pdv_id'];                   // VARCHAR(128)
  $campañaId      = $payload['campaña_id']       ?? null;  // VARCHAR
  $prioridad      = $payload['prioridad']        ?? null;
  $zonas          = $payload['zonas']            ?? [];    // array -> JSON
  $observaciones  = $payload['observaciones']    ?? null;
  $creadoPor      = $payload['creado_por']       ?? null;

  // (Opcional) Validación estricta de FKs — dejar desactivada de momento
  $STRICT_VALIDATE = false;
  if ($STRICT_VALIDATE) {
    $check = function($table,$id) use($pdo){
      if ($id===null) return true;
      $r = row($pdo, "SELECT 1 FROM `$table` WHERE id = ? LIMIT 1", [$id]);
      return (bool)$r;
    };
    if ($regionId && !$check('regiones',$regionId))        json_out(['error'=>'bad_request','message'=>'region_id inexistente'], 400);
    if ($subterritId && !$check('subterritorios',$subterritId)) json_out(['error'=>'bad_request','message'=>'subterritorio_id inexistente'], 400);
    if (!$check('pdvs',$pdvId))                             json_out(['error'=>'bad_request','message'=>'pdv_id inexistente'], 400);
    if ($campañaId && !$check('campañas',$campañaId))       json_out(['error'=>'bad_request','message'=>'campaña_id inexistente'], 400);
    foreach ($payload['items'] as $it) {
      if (!isset($it['material_id'])) json_out(['error'=>'bad_request','message'=>'Cada item requiere material_id'], 400);
      if (!$check('materiales',$it['material_id'])) json_out(['error'=>'bad_request','message'=>'material_id inexistente: '.$it['material_id']], 400);
    }
  }

  // (Opcional) Descuento de stock detrás de flag
  $DECREMENT_STOCK = false; // poner true cuando se quiera restar stock global en `materiales`

  $pdo->beginTransaction();
  try {
    // Cabecera
    $sql1 = 'INSERT INTO solicitudes
      (region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    $st1 = $pdo->prepare($sql1);
    $st1->execute([
      $regionId,
      $subterritId,
      $pdvId,
      $campañaId,
      $prioridad,
      json_encode($zonas, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),
      $observaciones,
      $creadoPor
    ]);
    $solicitudId = (int)$pdo->lastInsertId();

    // Items
    $sql2 = 'INSERT INTO solicitud_items
      (solicitud_id, material_id, cantidad, medida_etiqueta, medida_custom, observaciones)
      VALUES (?, ?, ?, ?, ?, ?)';
    $st2 = $pdo->prepare($sql2);

    foreach ($payload['items'] as $it) {
      if (!isset($it['material_id'])) throw new Exception('Cada item requiere material_id');

      $cantidad       = (int)($it['cantidad'] ?? 0);
      $medidaEtiqueta = $it['medida_etiqueta'] ?? null;
      $medidaCustom   = $it['medida_custom']   ?? null;
      $obsItem        = $it['observaciones']   ?? null;

      $st2->execute([
        $solicitudId,
        $it['material_id'],
        $cantidad,
        $medidaEtiqueta,
        $medidaCustom,
        $obsItem
      ]);

      // (Opcional) Descontar stock global en `materiales`
      if ($DECREMENT_STOCK && $cantidad > 0) {
        $upd = $pdo->prepare('UPDATE materiales SET stock = GREATEST(0, stock - ?) WHERE id = ?');
        $upd->execute([$cantidad, $it['material_id']]);
      }
    }

    $pdo->commit();
    json_out(['id' => $solicitudId], 201);

  } catch (Throwable $e) {
    $pdo->rollBack();
    throw $e; // handler global devolverá 500 JSON
  }
}

// GET /requests?limit=20&offset=0&region_id=...&subterritorio_id=...&pdv_id=...&campaña_id=...
if ($method === 'GET' && $path === '/requests') {
  $limit  = max(1, min(100, (int)($_GET['limit']  ?? 20)));
  $offset = max(0, (int)($_GET['offset'] ?? 0));

  $conds = [];
  $args  = [];

  foreach (['region_id','subterritorio_id','pdv_id','campaña_id'] as $f) {
    if (!empty($_GET[$f])) {
      $conds[] = "s.$f = ?";
      $args[]  = $_GET[$f];
    }
  }

  $where = $conds ? ('WHERE '.implode(' AND ', $conds)) : '';
  $sql = "
    SELECT
      s.id, s.region_id, s.subterritorio_id, s.pdv_id, s.campaña_id,
      s.prioridad, s.creado_por, s.creado_en,
      (SELECT COUNT(*) FROM solicitud_items si WHERE si.solicitud_id = s.id) AS items_count
    FROM solicitudes s
    $where
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?
  ";

  $args2 = $args;
  $args2[] = $limit;
  $args2[] = $offset;

  $data = rows($pdo, $sql, $args2);

  // total (para paginación)
  $total = row($pdo, "SELECT COUNT(*) AS c FROM solicitudes s $where", $args)['c'] ?? 0;

  json_out([
    'data'  => $data,
    'page'  => ['limit'=>$limit, 'offset'=>$offset, 'total'=>(int)$total]
  ]);
}

// Obtener solicitud (cabecera + items)
if ($method === 'GET' && preg_match('#^/requests/(\d+)$#', $path, $m)) {
  $reqId = (int)$m[1];

  $cab = row($pdo, 'SELECT id, region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por, creado_en
                    FROM solicitudes WHERE id = ?', [$reqId]);
  if (!$cab) json_out(['error'=>'not_found','path'=>$path], 404);

  $items = rows($pdo, 'SELECT id, material_id, cantidad, medida_etiqueta, medida_custom, observaciones, creado_en
                       FROM solicitud_items WHERE solicitud_id = ? ORDER BY id', [$reqId]);

  if (isset($cab['zonas']) && is_string($cab['zonas'])) {
    $z = json_decode($cab['zonas'], true);
    if (json_last_error() === JSON_ERROR_NONE) $cab['zonas'] = $z;
  }

  json_out(['id'=>(int)$cab['id'], 'header'=>$cab, 'items'=>$items], 200);
}

// 404
http_response_code(404);
json(['error' => 'not_found', 'path' => $path]);
