<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

try {
  $st = $pdo->query("SELECT id_producto, nombre, precio, stock, imagen, fecha_alta FROM productos ORDER BY id_producto DESC");
  json_ok(["data" => $st->fetchAll()]);
} catch (Exception $e) {
  json_err("Error al listar productos", 500);
}
