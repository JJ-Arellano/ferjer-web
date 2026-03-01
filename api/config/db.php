<?php
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/env.php";

load_env();

$host = getenv("DB_HOST") ?: "localhost";
$db   = getenv("DB_NAME") ?: "";
$user = getenv("DB_USER") ?: "root";
$pass = getenv("DB_PASS") ?: "";

if ($db === "") json_err("Configuración de base de datos incompleta", 500);

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Exception $e) {
  json_err("Error de conexión con la base de datos", 500);
}