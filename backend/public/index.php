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

function json($x){ echo json_encode($x, JSON_UNESCAPED_UNICODE); exit; }
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
if ($path === '/requests' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  http_response_code(501);
  json(['error' => 'not_implemented']);
}

// 404
http_response_code(404);
json(['error' => 'not_found', 'path' => $path]);
