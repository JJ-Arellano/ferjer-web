<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

$email = strtolower(trim($_GET["email"] ?? ""));
if ($email === "") json_err("Falta email");

try {
  $st = $pdo->prepare("
    SELECT
      e.folio,
      CONCAT(e.tipo_equipo, ' - ', e.modelo) AS equipo,
      s.nombre AS estatus,
      e.fecha_ingreso
    FROM equipos e
    JOIN clientes c ON c.id_cliente = e.id_cliente
    JOIN estados s ON s.id_estado = e.id_estado
    WHERE c.email = ?
    ORDER BY e.id_equipo DESC
    LIMIT 200
  ");
  $st->execute([$email]);
  json_ok(["data" => $st->fetchAll()]);
} catch (Exception $e) {
  json_err("Error al consultar", 500);
}