<?php
// api/carrito/confirmar.php
// Confirma el pedido (cambia estatus de Pendiente a Pagado)
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$user = require_login();
$id_usuario = (int)$user["id_usuario"];

$in = read_json_body();
$id_pedido = (int)($in["id_pedido"] ?? 0);
$notas     = trim($in["notas"] ?? "");

if ($id_pedido <= 0) json_err("Pedido inválido", 400);

try {
    // Verificar que el pedido pertenece al usuario y está Pendiente
    $st = $pdo->prepare("SELECT id_pedido, total FROM pedidos WHERE id_pedido = ? AND id_usuario = ? AND estatus = 'Pendiente' LIMIT 1");
    $st->execute([$id_pedido, $id_usuario]);
    $pedido = $st->fetch(PDO::FETCH_ASSOC);

    if (!$pedido) json_err("Pedido no encontrado", 404);

    // Verificar que tiene items
    $cnt = $pdo->prepare("SELECT COUNT(*) FROM pedido_items WHERE id_pedido = ?");
    $cnt->execute([$id_pedido]);
    if ($cnt->fetchColumn() == 0) json_err("El carrito está vacío", 400);

    // Verificar stock de todos los productos
    $items = $pdo->prepare("
        SELECT pi.cantidad, p.stock, p.nombre
        FROM pedido_items pi
        JOIN productos p ON p.id_producto = pi.id_producto
        WHERE pi.id_pedido = ?
    ");
    $items->execute([$id_pedido]);
    foreach ($items->fetchAll(PDO::FETCH_ASSOC) as $item) {
        if ($item["stock"] < $item["cantidad"]) {
            json_err("Stock insuficiente para: " . $item["nombre"], 400);
        }
    }

    $pdo->beginTransaction();

    // Cambiar estatus a Pagado
    $upd = $pdo->prepare("UPDATE pedidos SET estatus = 'Pagado', notas = ? WHERE id_pedido = ?");
    $upd->execute([$notas, $id_pedido]);

    // Descontar stock
    $descontar = $pdo->prepare("
        UPDATE productos p
        JOIN pedido_items pi ON pi.id_producto = p.id_producto
        SET p.stock = p.stock - pi.cantidad
        WHERE pi.id_pedido = ?
    ");
    $descontar->execute([$id_pedido]);

    $pdo->commit();

    json_ok([
        "msg"       => "Pedido confirmado",
        "id_pedido" => $id_pedido,
        "total"     => (float)$pedido["total"]
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_err("Error al confirmar pedido: " . $e->getMessage(), 500);
}
