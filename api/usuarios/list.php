<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

try {
  $st = $pdo->query("SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC");
  $usuarios = $st->fetchAll(PDO::FETCH_ASSOC);
  json_ok(["data" => $usuarios]);
} catch (Exception $e) {
  json_err("Error al obtener usuarios", 500);
}