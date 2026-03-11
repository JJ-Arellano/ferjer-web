<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador","Tecnico","Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$data = json_decode(file_get_contents("php://input"), true);
$id   = intval($data["id_notificacion"] ?? 0);

try {
  if ($id === 0) {
    $pdo->prepare("DELETE FROM notificaciones")->execute();
  } else {
    $pdo->prepare("DELETE FROM notificaciones WHERE id_notificacion = ?")->execute([$id]);
  }
  json_ok(["ok" => true]);
} catch (Exception $e) {
  json_err("Error al eliminar notificación", 500);
}