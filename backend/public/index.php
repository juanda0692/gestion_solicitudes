<?php
// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

header('Content-Type: application/json');

// AJUSTAR CREDENCIALES AQUÍ
$pdo = new PDO(
  'mysql:host=127.0.0.1;dbname=base_dest;charset=utf8mb4',
  'root', 'TU_PASSWORD',
  [ PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC ]
);

// Normaliza path y base /api
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#','',$path);

function json($x){ echo json_encode($x, JSON_UNESCAPED_UNICODE); exit; }
function rows($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetchAll(); }
function row($pdo,$sql,$p=[]){ $s=$pdo->prepare($sql); $s->execute($p); return $s->fetch(); }

// ---------- ENDPOINTS ----------

// Regiones
if ($path === '/regions' && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM regiones ORDER BY nombre"));
}

// Subterritorios por región
if (preg_match('#^/regions/([^/]+)/subterritories$#',$path,$m) && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM subterritorios WHERE region_id=? ORDER BY nombre",[$m[1]]));
}

// PDVs por subterritorio
if (preg_match('#^/subterritories/([^/]+)/pdvs$#',$path,$m) && $_SERVER['REQUEST_METHOD']==='GET') {
  json(rows($pdo,"SELECT id, nombre AS name FROM pdvs WHERE subterritorio_id=? ORDER BY nombre",[$m[1]]));
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
if ($path === '/requests' && $_SERVER['REQUEST_METHOD']==='POST') {
  $b = json_decode(file_get_contents('php://input'), true) ?: [];
  // Validación mínima
  if (empty($b['regionId']) || empty($b['subterritoryId']) || empty($b['pdvId']) || empty($b['items'])) {
    http_response_code(400); json(['error'=>'Missing required fields']);
  }

  $pdo->beginTransaction();
  $st = $pdo->prepare("INSERT INTO solicitudes
      (region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por)
      VALUES (?,?,?,?,?,?,?,?)");
  $st->execute([
    $b['regionId'], $b['subterritoryId'], $b['pdvId'], $b['campaignId'] ?? null,
    $b['priority'] ?? null, json_encode($b['zones'] ?? []), $b['observations'] ?? null,
    $b['createdBy'] ?? null
  ]);
  $sid = $pdo->lastInsertId();

  $sti = $pdo->prepare("INSERT INTO solicitud_items
      (solicitud_id, material_id, cantidad, medida_etiqueta, medida_custom, observaciones)
      VALUES (?,?,?,?,?,?)");
  foreach ($b['items'] as $it) {
    $sti->execute([
      $sid, $it['materialId'], $it['quantity'],
      $it['measureTag'] ?? null, $it['measureCustom'] ?? null, $it['observations'] ?? null
    ]);
  }
  $pdo->commit();

  json(['id' => (int)$sid]);
}

// 404
http_response_code(404);
json(['error'=>'Not found']);
