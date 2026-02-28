<?php
// api/carrito/actualizar.php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

$user = require_login();
only_roles(["Cliente","Administrador"]);
if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$user = require_login();
$id_usuario = (int)$user["id_usuario"];

$in = read_json_body();
$id_item  = (int)($in["id_item"] ?? 0);
$cantidad = (int)($in["cantidad"] ?? 0);

if ($id_item <= 0) json_err("Item inválido", 400);

try {
    // Verificar que el item pertenece al carrito del usuario
    $st = $pdo->prepare("
        SELECT pi.id_item, pi.id_pedido, p.stock
        FROM pedido_items pi
        JOIN pedidos pd ON pd.id_pedido = pi.id_pedido
        JOIN productos p ON p.id_producto = pi.id_producto
        WHERE pi.id_item = ? AND pd.id_usuario = ? AND pd.estatus = 'Pendiente'
        LIMIT 1
    ");
    $st->execute([$id_item, $id_usuario]);
    $item = $st->fetch(PDO::FETCH_ASSOC);

    if (!$item) json_err("Item no encontrado", 404);

    $id_pedido = (int)$item["id_pedido"];

    if ($cantidad <= 0) {
        // Eliminar item
        $pdo->prepare("DELETE FROM pedido_items WHERE id_item = ?")->execute([$id_item]);
    } else {
        if ($item["stock"] < $cantidad) json_err("Stock insuficiente", 400);
        $pdo->prepare("UPDATE pedido_items SET cantidad = ? WHERE id_item = ?")->execute([$cantidad, $id_item]);
    }

    // Recalcular total
    $tot = $pdo->prepare("SELECT SUM(cantidad * precio_unit) FROM pedido_items WHERE id_pedido = ?");
    $tot->execute([$id_pedido]);
    $total = $tot->fetchColumn() ?? 0;

    $pdo->prepare("UPDATE pedidos SET total = ? WHERE id_pedido = ?")->execute([$total, $id_pedido]);

    json_ok(["msg" => "Carrito actualizado", "total" => (float)$total]);

} catch (Exception $e) {
    json_err("Error al actualizar carrito: " . $e->getMessage(), 500);
}