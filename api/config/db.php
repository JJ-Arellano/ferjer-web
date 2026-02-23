<?php
require_once __DIR__ . "/../helpers/response.php";

$host = "localhost";
$db   = "ferjer_sistema";   // <-- pon aquí el nombre real de tu BD
$user = "root";
$pass = "";                // XAMPP normalmente vacío

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Exception $e) {
  json_err("Error de conexión con la base de datos", 500);
}