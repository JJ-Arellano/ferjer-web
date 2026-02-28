<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in     = read_json_body();
$id     = $in["id"] ?? null;
$nombre = trim($in["nombre"] ?? "");
$email  = trim($in["email"] ?? "");
$rol    = trim($in["rol"] ?? "");
$pass   = trim($in["password"] ?? "");

if (!$id || $nombre === "" || $email === "" || $rol === "") {
  json_err("Datos inválidos");
}

try {
  if ($pass !== "") {
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $st = $pdo->prepare("UPDATE usuarios SET nombre=?, email=?, rol=?, password=? WHERE id_usuario=?");
    $st->execute([$nombre, $email, $rol, $hash, (int)$id]);
  } else {
    $st = $pdo->prepare("UPDATE usuarios SET nombre=?, email=?, rol=? WHERE id_usuario=?");
    $st->execute([$nombre, $email, $rol, (int)$id]);
  }

  if ($st->rowCount() === 0) json_err("Usuario no encontrado", 404);

  json_ok(["mensaje" => "Usuario actualizado"]);
} catch (Exception $e) {
  json_err("Error al actualizar usuario", 500);
}