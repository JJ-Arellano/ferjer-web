<?php
// api/carrito/agregar.php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

$user = require_login();
only_roles(["Cliente","Administrador"]);
if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$user = require_login();
$id_usuario = (int)$user["id_usuario"];

$in = read_json_body();
$id_producto = (int)($in["id_producto"] ?? 0);
$cantidad    = max(1, (int)($in["cantidad"] ?? 1));

if ($id_producto <= 0) json_err("Producto inválido", 400);

try {
    // Verificar que el producto existe y tiene stock
    $st = $pdo->prepare("SELECT id_producto, nombre, precio, stock FROM productos WHERE id_producto = ? LIMIT 1");
    $st->execute([$id_producto]);
    $producto = $st->fetch(PDO::FETCH_ASSOC);

    if (!$producto) json_err("Producto no encontrado", 404);
    if ($producto["stock"] < $cantidad) json_err("Stock insuficiente", 400);

    // Buscar pedido en estado 'Pendiente' del usuario (carrito activo)
    $sp = $pdo->prepare("SELECT id_pedido FROM pedidos WHERE id_usuario = ? AND estatus = 'Pendiente' LIMIT 1");
    $sp->execute([$id_usuario]);
    $pedido = $sp->fetch(PDO::FETCH_ASSOC);

    if (!$pedido) {
        // Crear nuevo pedido (carrito)
        $ins = $pdo->prepare("INSERT INTO pedidos (id_usuario, estatus, total) VALUES (?, 'Pendiente', 0)");
        $ins->execute([$id_usuario]);
        $id_pedido = (int)$pdo->lastInsertId();
    } else {
        $id_pedido = (int)$pedido["id_pedido"];
    }

    // Verificar si el producto ya está en el carrito
    $si = $pdo->prepare("SELECT id_item, cantidad FROM pedido_items WHERE id_pedido = ? AND id_producto = ? LIMIT 1");
    $si->execute([$id_pedido, $id_producto]);
    $item = $si->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        // Actualizar cantidad
        $nuevaCantidad = $item["cantidad"] + $cantidad;
        if ($producto["stock"] < $nuevaCantidad) json_err("Stock insuficiente para esa cantidad", 400);

        $upd = $pdo->prepare("UPDATE pedido_items SET cantidad = ? WHERE id_item = ?");
        $upd->execute([$nuevaCantidad, $item["id_item"]]);
    } else {
        // Insertar nuevo item
        $ins2 = $pdo->prepare("INSERT INTO pedido_items (id_pedido, id_producto, cantidad, precio_unit) VALUES (?,?,?,?)");
        $ins2->execute([$id_pedido, $id_producto, $cantidad, $producto["precio"]]);
    }

    // Recalcular total del pedido
    $tot = $pdo->prepare("SELECT SUM(cantidad * precio_unit) as total FROM pedido_items WHERE id_pedido = ?");
    $tot->execute([$id_pedido]);
    $total = $tot->fetchColumn() ?? 0;

    $pdo->prepare("UPDATE pedidos SET total = ? WHERE id_pedido = ?")->execute([$total, $id_pedido]);

    json_ok(["msg" => "Producto agregado al carrito", "id_pedido" => $id_pedido, "total" => $total]);

} catch (Exception $e) {
    json_err("Error al agregar al carrito: " . $e->getMessage(), 500);
}