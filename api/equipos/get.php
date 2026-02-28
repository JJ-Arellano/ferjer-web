<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$folio = (int)($_GET["folio"] ?? 0);
if ($folio <= 0) json_err("Folio inválido");

try {
  $st = $pdo->prepare("
    SELECT
      e.folio,
      c.nombre AS cliente,
      c.email AS correo,
      e.tipo_equipo,
      e.modelo,
      e.falla,
      s.nombre AS estatus,
      e.fecha_ingreso
    FROM equipos e
    JOIN clientes c ON c.id_cliente = e.id_cliente
    JOIN estados s ON s.id_estado = e.id_estado
    WHERE e.folio = ?
    LIMIT 1
  ");
  $st->execute([$folio]);
  $row = $st->fetch();
  if (!$row) json_err("Equipo no encontrado", 404);

  json_ok(["data" => $row]);
} catch (Exception $e) {
  json_err("Error al consultar equipo", 500);
}
