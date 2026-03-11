<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$id_equipo = (int)($_GET["id_equipo"] ?? 0);
if ($id_equipo <= 0) json_err("id_equipo inválido");

try {
  // Actualizar estado si ya venció
  $pdo->prepare("
    UPDATE garantias SET estado = 'Vencida'
    WHERE id_equipo = ? AND fecha_vencimiento < CURDATE() AND estado = 'Activa'
  ")->execute([$id_equipo]);

  $st = $pdo->prepare("
    SELECT
      g.id_garantia,
      g.fecha_entrega,
      g.fecha_vencimiento,
      g.estado,
      DATEDIFF(g.fecha_vencimiento, CURDATE()) AS dias_restantes,
      e.folio,
      e.tipo_equipo,
      e.modelo,
      c.nombre AS cliente
    FROM garantias g
    JOIN equipos e ON e.id_equipo = g.id_equipo
    JOIN clientes c ON c.id_cliente = e.id_cliente
    WHERE g.id_equipo = ?
    LIMIT 1
  ");
  $st->execute([$id_equipo]);
  $row = $st->fetch();
  if (!$row) {
    json_ok(null);
  }

  json_ok($row);
} catch (Exception $e) {
  json_err("Error al consultar garantía: " . $e->getMessage(), 500);
}