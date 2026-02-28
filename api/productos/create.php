<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

// Solo Admin puede crear productos
only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$nombre = trim($in["nombre"] ?? "");
$precio = $in["precio"] ?? null;
$stock  = $in["stock"] ?? null;
$imagen = trim($in["imagen"] ?? "");
$fecha_alta = date("Y-m-d H:i:s");

if ($nombre === "" || !is_numeric($precio) || !is_numeric($stock)) {
  json_err("Datos inválidos");
}

try {
  $st = $pdo->prepare("INSERT INTO productos (nombre, precio, stock, imagen, fecha_alta) VALUES (?, ?, ?, ?, ?)");
  $st->execute([$nombre, (float)$precio, (int)$stock, $imagen, $fecha_alta]);
  json_ok(["id" => (int)$pdo->lastInsertId()], 201);
} catch (Exception $e) {
  json_err("Error al crear producto", 500);
}
