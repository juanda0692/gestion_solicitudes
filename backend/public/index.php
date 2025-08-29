<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$cfg = require __DIR__ . '/../config.php';

function log_error(Throwable $e){
    $dir = __DIR__ . '/../storage/logs';
    if (!is_dir($dir)) mkdir($dir,0777,true);
    $msg = '['.date('c').'] '.$e->getMessage().' in '.$e->getFile().':'.$e->getLine()."\n".$e->getTraceAsString()."\n";
    file_put_contents($dir.'/app.log',$msg,FILE_APPEND);
}

set_exception_handler(function($e){
    log_error($e);
    http_response_code(500);
    echo json_encode(['error'=>'server_error','message'=>$e->getMessage()]);
    exit;
});

$pdo = new PDO(
    'mysql:host='.$cfg['db_host'].';port='.$cfg['db_port'].';dbname='.$cfg['db_name'].';charset=utf8mb4',
    $cfg['db_user'],
    $cfg['db_pass'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

$MAX_PAYLOAD = 1024 * 1024; // 1MB
if (in_array($_SERVER['REQUEST_METHOD'], ['POST','PUT','PATCH'])) {
    $len = $_SERVER['CONTENT_LENGTH'] ?? 0;
    if ($len > $MAX_PAYLOAD) {
        http_response_code(413);
        echo json_encode(['error'=>'payload_too_large','message'=>'Payload exceeds 1MB']);
        exit;
    }
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#','',$path);
$method = $_SERVER['REQUEST_METHOD'];

$aliases = [
  '/regiones'    => '/regions',
  '/canales'     => '/channels',
  '/materiales'  => '/materials',
  '/campanas'    => '/campaigns',
  '/campañas'    => '/campaigns',
  '/solicitudes' => '/requests',
];
if (isset($aliases[$path])) $path = $aliases[$path];

function json_out($x, $status = 200) {
  http_response_code($status);
  echo json_encode($x, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
  exit;
}
function json($x){ json_out($x); }
function rows($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetchAll(); }
function row($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetch(); }
function valid_id($x,$max){ return is_string($x) && strlen($x) <= $max; }

// ---------- ENDPOINTS ----------

// Healthcheck
if ($path === '/health' && $method === 'GET') {
  $db = true;
  try {
    $pdo->query('SELECT 1');
  } catch (Exception $e) {
    $db = false;
  }
  json(['ok' => true, 'db' => $db]);
}

// Regiones
if ($path === '/regions' && $method==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM regiones ORDER BY nombre"));
}

// Subterritories (lista completa) — acepta EN/ES
if ($method === 'GET' && ($path === '/subterritories' || $path === '/subterritorios')) {
  $regionId = $_GET['region_id'] ?? null;
  if ($regionId) {
    $data = rows($pdo,
      'SELECT id, region_id, nombre AS name FROM subterritorios WHERE region_id = ? ORDER BY nombre', [$regionId]);
  } else {
    $data = rows($pdo,
      'SELECT id, region_id, nombre AS name FROM subterritorios ORDER BY nombre');
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

// Listado de PDVs con filtro opcional por subterritorio
if ($path === '/pdvs' && $method === 'GET') {
  $subId = $_GET['subterritorio_id'] ?? null;
  if ($subId) {
    json(rows($pdo,
      "SELECT id, subterritorio_id, nombre AS name FROM pdvs WHERE subterritorio_id=? ORDER BY nombre",
      [$subId]
    ));
  } else {
    json(rows($pdo,
      "SELECT id, subterritorio_id, nombre AS name FROM pdvs ORDER BY nombre"
    ));
  }
}

// Canales
if ($path === '/channels' && $method==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM canales ORDER BY nombre"));
}

// Materiales por canal (usa materiales_por_canal)
if (preg_match('#^/channels/([^/]+)/materials$#',$path,$m) && $method==='GET') {
  $sql = "SELECT m.id, m.nombre AS name, COALESCE(mpc.stock, m.stock) AS stock
          FROM materiales m
          JOIN materiales_por_canal mpc ON mpc.material_id=m.id
          WHERE mpc.canal_id=?
          ORDER BY m.nombre";
  json(rows($pdo,$sql,[$m[1]]));
}

// Catálogo materiales (opcional)
if ($path === '/materials' && $method==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name, descripcion AS description, stock FROM materiales ORDER BY nombre"));
}

// Campañas (y si se quiere, ampliar con relaciones)
if ($path === '/campaigns' && $method==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name, prioridad AS priority FROM campañas ORDER BY nombre"));
}

// Crear solicitud (encabezado + items)
if ($method === 'POST' && $path === '/requests') {
  $payloadRaw = file_get_contents('php://input');
  $payload = json_decode($payloadRaw, true);

  if (!is_array($payload)) {
    json_out(['error'=>'bad_request','message'=>'JSON inválido'], 400);
  }
  if (!isset($payload['pdv_id']) || empty($payload['items']) || !is_array($payload['items'])) {
    json_out(['error'=>'bad_request','message'=>'Faltan campos: pdv_id o items'], 400);
  }

  $regionId       = $payload['region_id']        ?? null;
  $subterritId    = $payload['subterritorio_id'] ?? null;
  $pdvId          = $payload['pdv_id'];
  $campañaId      = $payload['campaña_id']       ?? null;
  $prioridad      = $payload['prioridad']        ?? null;
  $zonas          = $payload['zonas']            ?? [];
  $observaciones  = $payload['observaciones']    ?? null;
  $creadoPor      = $payload['creado_por']       ?? null;

  if (!valid_id($pdvId,128)) json_out(['error'=>'validation_error','message'=>'pdv_id inválido'],400);
  if ($regionId && !valid_id($regionId,32)) json_out(['error'=>'validation_error','message'=>'region_id inválido'],400);
  if ($subterritId && !valid_id($subterritId,32)) json_out(['error'=>'validation_error','message'=>'subterritorio_id inválido'],400);
  if ($campañaId && !valid_id($campañaId,32)) json_out(['error'=>'validation_error','message'=>'campaña_id inválido'],400);

  $STRICT_VALIDATE = false;
  if ($STRICT_VALIDATE) {
    $check = function($table,$id) use($pdo){
      if ($id===null) return true;
      $r = row($pdo, "SELECT 1 FROM `$table` WHERE id = ? LIMIT 1", [$id]);
      return (bool)$r;
    };
    if ($regionId && !$check('regiones',$regionId))        json_out(['error'=>'validation_error','message'=>'region_id inexistente'],400);
    if ($subterritId && !$check('subterritorios',$subterritId)) json_out(['error'=>'validation_error','message'=>'subterritorio_id inexistente'],400);
    if (!$check('pdvs',$pdvId))                             json_out(['error'=>'validation_error','message'=>'pdv_id inexistente'],400);
    if ($campañaId && !$check('campañas',$campañaId))       json_out(['error'=>'validation_error','message'=>'campaña_id inexistente'],400);
    foreach ($payload['items'] as $it) {
      if (!isset($it['material_id'])) json_out(['error'=>'validation_error','message'=>'Cada item requiere material_id'],400);
      if (!$check('materiales',$it['material_id'])) json_out(['error'=>'validation_error','message'=>'material_id inexistente: '.$it['material_id']],400);
    }
  }

  $DECREMENT_STOCK = false;

  $pdo->beginTransaction();
  try {
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
      if ($DECREMENT_STOCK && $cantidad > 0) {
        $upd = $pdo->prepare('UPDATE materiales SET stock = GREATEST(0, stock - ?) WHERE id = ?');
        $upd->execute([$cantidad, $it['material_id']]);
      }
    }

    $pdo->commit();
    json_out(['id' => $solicitudId], 201);

  } catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
  }
}

// GET /requests
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
    LIMIT $limit OFFSET $offset
  ";

  $data = rows($pdo, $sql, $args);
  $total = row($pdo, "SELECT COUNT(*) AS c FROM solicitudes s $where", $args)['c'] ?? 0;

  json_out([
    'data'  => $data,
    'page'  => ['limit'=>$limit, 'offset'=>$offset, 'total'=>(int)$total]
  ]);
}

// Obtener solicitud (cabecera + items)
if ($method === 'GET' && preg_match('#^/requests/(\d+)$#', $path, $m)) {
  $reqId = (int)$m[1];
  $cab = row($pdo, 'SELECT id, region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por, creado_en FROM solicitudes WHERE id = ?', [$reqId]);
  if (!$cab) json_out(['error'=>'not_found','path'=>$path], 404);

  $items = rows($pdo, 'SELECT id, material_id, cantidad, medida_etiqueta, medida_custom, observaciones, creado_en FROM solicitud_items WHERE solicitud_id = ? ORDER BY id', [$reqId]);

  if (isset($cab['zonas']) && is_string($cab['zonas'])) {
    $z = json_decode($cab['zonas'], true);
    if (json_last_error() === JSON_ERROR_NONE) $cab['zonas'] = $z;
  }

  json_out(['id'=>(int)$cab['id'], 'header'=>$cab, 'items'=>$items], 200);
}

http_response_code(404);
json(['error' => 'not_found', 'path' => $path]);
