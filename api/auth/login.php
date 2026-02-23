<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$email = strtolower(trim($in["email"] ?? ""));
$pass  = $in["password"] ?? "";

if ($email === "" || $pass === "") json_err("Faltan datos");

try {
  $st = $pdo->prepare("SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE email=? LIMIT 1");
  $st->execute([$email]);
  $u = $st->fetch();
  if (!$u) json_err("Credenciales incorrectas", 401);

  if (!password_verify($pass, $u["password_hash"])) {
    json_err("Credenciales incorrectas", 401);
  }

  // Sesión (para web)
  session_start();
  $_SESSION["user"] = [
    "id_usuario" => (int)$u["id_usuario"],
    "nombre"     => $u["nombre"],
    "email"      => $u["email"],
    "rol"        => $u["rol"],
  ];

  json_ok(["user" => $_SESSION["user"]]);
} catch (Exception $e) {
  json_err("Error al iniciar sesión", 500);
}