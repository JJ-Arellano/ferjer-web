<?php
// api/pedidos/entregas.php
// Lista pedidos Pagados/Listos pendientes de entrega física
// También permite marcar como Entregado
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Empleado"]);

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET") {
  try {
    $st = $pdo->query("
      SELECT
        p.id_pedido,
        u.nombre        AS cliente,
        u.email         AS email,
        p.total,
        p.estatus,
        p.fecha_pedido  AS fecha_pedido,
        GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS productos
      FROM pedidos p
      JOIN usuarios u ON u.id_usuario = p.id_usuario
      LEFT JOIN pedido_items pi ON pi.id_pedido = p.id_pedido
      LEFT JOIN productos pr ON pr.id_producto = pi.id_producto
      WHERE p.estatus IN ('Pagado','Listo')
      GROUP BY p.id_pedido, u.nombre, u.email, p.total, p.estatus, p.fecha_pedido
      ORDER BY p.id_pedido DESC
      LIMIT 300
    ");
    json_ok(["data" => $st->fetchAll()]);
  } catch (Exception $e) {
    json_err("Error al listar entregas", 500);
  }
}

// Marcar como entregado
if ($method === "POST") {
  $in = read_json_body();
  $id_pedido = (int)($in["id_pedido"] ?? 0);
  if ($id_pedido <= 0) json_err("Pedido inválido", 400);

  try {
    $st = $pdo->prepare("UPDATE pedidos SET estatus='Entregado' WHERE id_pedido=?");
    $st->execute([$id_pedido]);
    json_ok();
  } catch (Exception $e) {
    json_err("Error al actualizar entrega", 500);
  }
}

json_err("Método no permitido", 405);
