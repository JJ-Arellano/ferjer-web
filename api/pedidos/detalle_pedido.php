<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

$user = require_login();
only_roles(["Cliente", "Administrador"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$id_usuario = (int)$user["id_usuario"];
$id_pedido  = (int)($_GET["id"] ?? 0);

if ($id_pedido <= 0) json_err("ID de pedido requerido", 400);

try {
    $sp = $pdo->prepare("
        SELECT p.id_pedido, p.total, p.estatus, p.fecha_pedido, p.notas,
               u.nombre AS cliente, u.email
        FROM pedidos p
        JOIN usuarios u ON u.id_usuario = p.id_usuario
        WHERE p.id_pedido = ? AND p.id_usuario = ?
        LIMIT 1
    ");
    $sp->execute([$id_pedido, $id_usuario]);
    $pedido = $sp->fetch(PDO::FETCH_ASSOC);

    if (!$pedido) json_err("Pedido no encontrado", 404);

    $si = $pdo->prepare("
        SELECT pi.cantidad, pi.precio_unit,
               (pi.cantidad * pi.precio_unit) AS subtotal,
               pr.nombre
        FROM pedido_items pi
        JOIN productos pr ON pr.id_producto = pi.id_producto
        WHERE pi.id_pedido = ?
        ORDER BY pi.id_item ASC
    ");
    $si->execute([$id_pedido]);
    $items = $si->fetchAll(PDO::FETCH_ASSOC);

    json_ok([
        "pedido" => $pedido,
        "items"  => $items
    ]);

} catch (Exception $e) {
    json_err("Error al obtener detalle: " . $e->getMessage(), 500);
}