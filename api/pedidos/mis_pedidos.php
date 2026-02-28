<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

$user = require_login();
only_roles(["Cliente", "Administrador"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$id_usuario = (int)$user["id_usuario"];

try {
    $st = $pdo->prepare("
        SELECT
            p.id_pedido,
            p.total,
            p.estatus,
            p.fecha_pedido,
            p.notas,
            GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS productos,
            SUM(pi.cantidad) AS total_items
        FROM pedidos p
        LEFT JOIN pedido_items pi ON pi.id_pedido = p.id_pedido
        LEFT JOIN productos pr ON pr.id_producto = pi.id_producto
        WHERE p.id_usuario = ?
          AND p.estatus != 'Pendiente'
        GROUP BY p.id_pedido
        ORDER BY p.fecha_pedido DESC
    ");
    $st->execute([$id_usuario]);
    $pedidos = $st->fetchAll(PDO::FETCH_ASSOC);

    json_ok(["data" => $pedidos]);
} catch (Exception $e) {
    json_err("Error al obtener pedidos: " . $e->getMessage(), 500);
}