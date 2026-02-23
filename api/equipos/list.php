<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

$search = trim($_GET["search"] ?? "");
$status = trim($_GET["status"] ?? "");

$sql = "
SELECT
  e.folio,
  c.nombre AS cliente,
  c.email AS correo,
  e.tipo_equipo,
  e.modelo,
  s.nombre AS estatus,
  e.fecha_ingreso
FROM equipos e
JOIN clientes c ON c.id_cliente = e.id_cliente
JOIN estados s ON s.id_estado = e.id_estado
WHERE 1=1
";
$params = [];

if ($status !== "") {
  $sql .= " AND s.nombre = ? ";
  $params[] = $status;
}

if ($search !== "") {
  $like = "%$search%";
  $sql .= " AND (
    e.folio LIKE ?
    OR c.nombre LIKE ?
    OR c.email LIKE ?
    OR e.tipo_equipo LIKE ?
    OR e.modelo LIKE ?
  ) ";
  array_push($params, $like, $like, $like, $like, $like);
}

$sql .= " ORDER BY e.id_equipo DESC LIMIT 300";

try {
  $st = $pdo->prepare($sql);
  $st->execute($params);
  json_ok(["data" => $st->fetchAll()]);
} catch (Exception $e) {
  json_err("Error al listar", 500);
}