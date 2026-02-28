<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$id = $in["id"] ?? null;

if (!$id) json_err("ID requerido");

try {
  $st = $pdo->prepare("DELETE FROM productos WHERE id_producto=?");
  $st->execute([(int)$id]);

  if ($st->rowCount() === 0) json_err("Producto no encontrado", 404);

  json_ok(["mensaje" => "Producto eliminado"]);
} catch (Exception $e) {
  json_err("Error al eliminar producto", 500);
}