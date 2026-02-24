<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

try {
  $st = $pdo->query("
    SELECT id_producto, nombre, precio, stock, imagen
    FROM productos
    ORDER BY id_producto DESC
    LIMIT 300
  ");

  $rows = $st->fetchAll();

  // URL relativa para pintar imagen
  foreach ($rows as &$r) {
    $r["imagen_url"] = $r["imagen"] ? ("uploads/productos/" . $r["imagen"]) : null;
  }

  json_ok(["data" => $rows]);
} catch (Exception $e) {
  json_err("Error al listar productos", 500);
}