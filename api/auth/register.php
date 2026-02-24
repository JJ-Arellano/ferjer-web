<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();

$nombre = trim($in["nombre"] ?? "");
$email = strtolower(trim($in["email"] ?? ""));
$password = (string)($in["password"] ?? "");
$rol = trim($in["rol"] ?? "Cliente");

if ($nombre === "" || $email === "" || $password === "") json_err("Faltan datos", 400);
if (strpos($email, "@") === false) json_err("Email inválido", 400);
if (strlen($password) < 6) json_err("La contraseña debe tener al menos 6 caracteres", 400);

// SOLO roles permitidos por tu ENUM
$allowed = ["Cliente", "Administrador"];
if (!in_array($rol, $allowed, true)) $rol = "Cliente";

try {
  // email único
  $st = $pdo->prepare("SELECT 1 FROM usuarios WHERE email=? LIMIT 1");
  $st->execute([$email]);
  if ($st->fetchColumn()) json_err("Ese email ya existe", 409);

  $hash = password_hash($password, PASSWORD_DEFAULT);

  $ins = $pdo->prepare("INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)");
  $ins->execute([$nombre, $email, $hash, $rol]);

  json_ok(["msg" => "Usuario creado"]);

} catch (Exception $e) {
  json_err("Error al crear usuario", 500);
}