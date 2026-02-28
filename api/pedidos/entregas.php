<?php
// api/pedidos/entregas.php
// Lista pedidos Pagados/Listos pendientes de entrega física
// También permite marcar como Entregado
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

$user = require_login();
$rol  = strtolower($user["rol"] ?? "");

// Solo Admin y Empleado
if (!in_array($rol, ["administrador", "empleado"])) json_err("Acceso denegado", 403);

// ===== GET: listar entregas pendientes =====
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        $st = $pdo->prepare("
            SELECT 
                pd.id_pedido,
                pd.estatus,
                pd.total,
                pd.fecha_pedido,
                pd.notas,
                u.nombre AS cliente,
                u.email  AS email,
                GROUP_CONCAT(p.nombre, ' x', pi.cantidad ORDER BY p.nombre SEPARATOR ', ') AS productos
            FROM pedidos pd
            JOIN usuarios u ON u.id_usuario = pd.id_usuario
            JOIN pedido_items pi ON pi.id_pedido = pd.id_pedido
            JOIN productos p ON p.id_producto = pi.id_producto
            WHERE pd.estatus IN ('Pagado', 'Listo')
            GROUP BY pd.id_pedido
            ORDER BY pd.fecha_pedido ASC
        ");
        $st->execute();
        $entregas = $st->fetchAll(PDO::FETCH_ASSOC);

        json_ok(["data" => array_map(fn($e) => [
            "id_pedido"    => (int)$e["id_pedido"],
            "estatus"      => $e["estatus"],
            "total"        => (float)$e["total"],
            "fecha_pedido" => $e["fecha_pedido"],
            "notas"        => $e["notas"] ?? "",
            "cliente"      => $e["cliente"],
            "email"        => $e["email"],
            "productos"    => $e["productos"]
        ], $entregas)]);

    } catch (Exception $e) {
        json_err("Error al obtener entregas: " . $e->getMessage(), 500);
    }
}

// ===== POST: marcar como Entregado =====
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $in = read_json_body();
    $id_pedido = (int)($in["id_pedido"] ?? 0);

    if ($id_pedido <= 0) json_err("Pedido inválido", 400);

    try {
        $st = $pdo->prepare("SELECT id_pedido FROM pedidos WHERE id_pedido = ? AND estatus IN ('Pagado','Listo') LIMIT 1");
        $st->execute([$id_pedido]);
        if (!$st->fetch()) json_err("Pedido no encontrado o ya entregado", 404);

        $upd = $pdo->prepare("UPDATE pedidos SET estatus = 'Entregado', fecha_entrega = NOW() WHERE id_pedido = ?");
        $upd->execute([$id_pedido]);

        json_ok(["msg" => "Pedido marcado como entregado", "id_pedido" => $id_pedido]);

    } catch (Exception $e) {
        json_err("Error al marcar entrega: " . $e->getMessage(), 500);
    }
}

json_err("Método no permitido", 405);