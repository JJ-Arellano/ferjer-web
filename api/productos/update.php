<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in     = read_json_body();
$id     = $in["id"] ?? null;
$nombre = trim($in["nombre"] ?? "");
$precio = $in["precio"] ?? null;
$stock  = $in["stock"] ?? null;
$imagen = trim($in["imagen"] ?? "");

if (!$id || $nombre === "" || !is_numeric($precio) || !is_numeric($stock)) {
  json_err("Datos inválidos");
}

try {
  $st = $pdo->prepare("UPDATE productos SET nombre=?, precio=?, stock=?, imagen=? WHERE id_producto=?");
  $st->execute([$nombre, (float)$precio, (int)$stock, $imagen, (int)$id]);

  if ($st->rowCount() === 0) json_err("Producto no encontrado", 404);

  json_ok(["mensaje" => "Producto actualizado"]);
} catch (Exception $e) {
  json_err("Error al actualizar producto", 500);
}