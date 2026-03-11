<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

try {
  $st = $pdo->query("SELECT * FROM notificaciones ORDER BY fecha DESC LIMIT 50");
  $data = $st->fetchAll();
  $noLeidas = array_filter($data, fn($n) => $n["leida"] == 0);
  json_ok(["data" => array_values($data), "no_leidas" => count($noLeidas)]);
} catch (Exception $e) {
  json_err("Error al obtener notificaciones", 500);
}