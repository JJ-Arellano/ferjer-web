<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$email = strtolower(trim($in["email"] ?? ""));
$pass  = $in["password"] ?? "";

if ($email === "" || $pass === "") json_err("Faltan datos", 400);

try {
  // Buscar usuario
  $st = $pdo->prepare("SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE LOWER(email)=? LIMIT 1");
  $st->execute([$email]);
  $u = $st->fetch();
  if (!$u) json_err("Credenciales incorrectas", 401);

  if (!password_verify($pass, $u["password_hash"])) {
    json_err("Credenciales incorrectas", 401);
  }

  // 1) SESIÓN para la web (no rompemos tu sitio)
  if (session_status() === PHP_SESSION_NONE) session_start();
  $_SESSION["user"] = [
    "id_usuario" => (int)$u["id_usuario"],
    "nombre" => $u["nombre"],
    "email" => $u["email"],
    "rol" => $u["rol"],
  ];

  // 2) TOKEN para móvil (y también puede servir para web)
  $token = bin2hex(random_bytes(32));
  $hash  = hash("sha256", $token);

  // Insertar token
  $ins = $pdo->prepare("INSERT INTO api_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))");
  $ins->execute([(int)$u["id_usuario"], $hash]);

  json_ok([
    "user" => $_SESSION["user"],
    "token" => $token
  ]);

} catch (Throwable $e) {
  // Para ver el error real (temporal). Si te molesta, luego lo quitamos.
  json_err("Error al iniciar sesión", 500, ["debug" => $e->getMessage()]);
}