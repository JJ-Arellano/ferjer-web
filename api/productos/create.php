<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

require_role("Administrador");

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

// Recibimos multipart/form-data
$nombre = trim($_POST["nombre"] ?? "");
$precio = (float)($_POST["precio"] ?? 0);
$stock  = (int)($_POST["stock"] ?? 0);

if ($nombre === "" || $precio < 0 || $stock < 0) json_err("Datos inválidos", 400);

// Imagen opcional
$filename = null;
if (!empty($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK) {
  $tmp  = $_FILES["imagen"]["tmp_name"];
  $name = $_FILES["imagen"]["name"];

  $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  $allowed = ["jpg","jpeg","png","webp"];
  if (!in_array($ext, $allowed, true)) json_err("Formato de imagen no permitido", 400);

  $filename = "p_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
  $destDir = __DIR__ . "/../../uploads/productos";
  if (!is_dir($destDir)) mkdir($destDir, 0777, true);

  $dest = $destDir . "/" . $filename;
  if (!move_uploaded_file($tmp, $dest)) json_err("No se pudo guardar la imagen", 500);
}

try {
  $st = $pdo->prepare("INSERT INTO productos (nombre, precio, stock, imagen) VALUES (?,?,?,?)");
  $st->execute([$nombre, $precio, $stock, $filename]);

  json_ok(["msg" => "Producto agregado", "id_producto" => (int)$pdo->lastInsertId()]);
} catch (Exception $e) {
  json_err("Error al crear producto", 500);
}