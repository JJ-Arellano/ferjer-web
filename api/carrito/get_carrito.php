<?php
// api/carrito/get.php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$user = require_login();
$id_usuario = (int)$user["id_usuario"];

try {
    // Buscar carrito activo
    $sp = $pdo->prepare("SELECT id_pedido, total FROM pedidos WHERE id_usuario = ? AND estatus = 'Pendiente' LIMIT 1");
    $sp->execute([$id_usuario]);
    $pedido = $sp->fetch(PDO::FETCH_ASSOC);

    if (!$pedido) {
        json_ok(["carrito" => [], "total" => 0, "id_pedido" => null]);
    }

    // Obtener items del carrito
    $si = $pdo->prepare("
        SELECT pi.id_item, pi.cantidad, pi.precio_unit,
               p.id_producto, p.nombre, p.imagen, p.stock
        FROM pedido_items pi
        JOIN productos p ON p.id_producto = pi.id_producto
        WHERE pi.id_pedido = ?
        ORDER BY pi.id_item ASC
    ");
    $si->execute([$pedido["id_pedido"]]);
    $items = $si->fetchAll(PDO::FETCH_ASSOC);

    json_ok([
        "id_pedido" => (int)$pedido["id_pedido"],
        "total"     => (float)$pedido["total"],
        "carrito"   => array_map(fn($i) => [
            "id_item"    => (int)$i["id_item"],
            "id_producto"=> (int)$i["id_producto"],
            "nombre"     => $i["nombre"],
            "imagen"     => $i["imagen"],
            "cantidad"   => (int)$i["cantidad"],
            "precio_unit"=> (float)$i["precio_unit"],
            "subtotal"   => (float)$i["cantidad"] * (float)$i["precio_unit"],
            "stock"      => (int)$i["stock"]
        ], $items)
    ]);

} catch (Exception $e) {
    json_err("Error al obtener carrito: " . $e->getMessage(), 500);
}