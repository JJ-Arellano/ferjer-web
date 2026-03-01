<?php
// api/equipos/delete.php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador"]);

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in    = read_json_body();
$folio = (int)($in["folio"] ?? 0);

if ($folio <= 0) json_err("Folio inválido", 400);

try {
    // Verificar que existe y obtener id_equipo
    $st = $pdo->prepare("SELECT id_equipo FROM equipos WHERE folio = ? LIMIT 1");
    $st->execute([$folio]);
    $equipo = $st->fetch();
    if (!$equipo) json_err("Equipo no encontrado", 404);

    $id_equipo = $equipo["id_equipo"];

    // Eliminar historial primero (foreign key)
    $pdo->prepare("DELETE FROM historial_orden WHERE id_equipo = ?")->execute([$id_equipo]);

    // Eliminar equipo
    $pdo->prepare("DELETE FROM equipos WHERE folio = ?")->execute([$folio]);

    json_ok(["msg" => "Equipo eliminado correctamente"]);

} catch (Exception $e) {
    json_err("Error al eliminar el equipo", 500);
}