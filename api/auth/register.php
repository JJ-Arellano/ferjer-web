<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$nombre = trim($in["nombre"] ?? "");
$email  = strtolower(trim($in["email"] ?? ""));
$pass   = $in["password"] ?? "";
$rol    = trim($in["rol"] ?? "Cliente"); // Cliente / Administrador

if ($nombre === "" || $email === "" || $pass === "" || !in_array($rol, ["Cliente","Administrador"], true)) {
  json_err("Datos inválidos");
}

if (strlen($pass) < 6) json_err("La contraseña debe tener mínimo 6 caracteres");

try {
  // validar si existe
  $st = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE email=? LIMIT 1");
  $st->execute([$email]);
  if ($st->fetch()) json_err("El correo ya está registrado", 409);

  $hash = password_hash($pass, PASSWORD_DEFAULT);

  $ins = $pdo->prepare("INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)");
  $ins->execute([$nombre, $email, $hash, $rol]);

  json_ok(["msg" => "Usuario registrado"]);
} catch (Exception $e) {
  json_err("Error al registrar", 500);
}