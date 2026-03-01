<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in    = read_json_body();
$email = strtolower(trim($in["email"] ?? ""));
$pass  = $in["password"] ?? "";

if ($email === "" || $pass === "") json_err("Faltan datos", 400);

// ===== RATE LIMITING =====
// Máximo 5 intentos fallidos por IP en 15 minutos.
// Requiere la tabla login_attempts (ver comentario al final del archivo).
$ip         = $_SERVER["REMOTE_ADDR"] ?? "0.0.0.0";
$ventana    = 15 * 60; // 15 minutos en segundos
$max_intentos = 5;

try {
  // Limpiar intentos viejos
  $pdo->prepare("DELETE FROM login_attempts WHERE ip = ? AND created_at < DATE_SUB(NOW(), INTERVAL ? SECOND)")
      ->execute([$ip, $ventana]);

  // Contar intentos recientes
  $stInt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip = ?");
  $stInt->execute([$ip]);
  $intentos = (int)$stInt->fetchColumn();

  if ($intentos >= $max_intentos) {
    json_err("Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.", 429);
  }
} catch (Throwable $e) {
  // Si la tabla no existe aún, no bloqueamos el login, solo lo ignoramos
  // Una vez que crees la tabla esto desaparecerá
}

// ===== LOGIN =====
try {
  $st = $pdo->prepare("SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE LOWER(email)=? LIMIT 1");
  $st->execute([$email]);
  $u = $st->fetch();

  if (!$u || !password_verify($pass, $u["password_hash"])) {
    // Registrar intento fallido
    try {
      $pdo->prepare("INSERT INTO login_attempts (ip) VALUES (?)")->execute([$ip]);
    } catch (Throwable $e) { /* tabla aún no existe, ignorar */ }

    json_err("Credenciales incorrectas", 401);
  }

  // Login exitoso: limpiar intentos de esta IP
  try {
    $pdo->prepare("DELETE FROM login_attempts WHERE ip = ?")->execute([$ip]);
  } catch (Throwable $e) { /* ignorar */ }

  // 1) Sesión para la web
  if (session_status() === PHP_SESSION_NONE) session_start();
  $_SESSION["user"] = [
    "id_usuario" => (int)$u["id_usuario"],
    "nombre"     => $u["nombre"],
    "email"      => $u["email"],
    "rol"        => $u["rol"],
  ];

  // 2) Token para móvil / API
  $token = bin2hex(random_bytes(32));
  $hash  = hash("sha256", $token);

  $pdo->prepare("INSERT INTO api_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))")
      ->execute([(int)$u["id_usuario"], $hash]);

  // Limpiar tokens expirados de este usuario (evita que la tabla crezca)
  $pdo->prepare("DELETE FROM api_tokens WHERE user_id = ? AND (expires_at < NOW() OR revoked_at IS NOT NULL)")
      ->execute([(int)$u["id_usuario"]]);

  json_ok([
    "user"  => $_SESSION["user"],
    "token" => $token
  ]);

} catch (Throwable $e) {
  json_err("Error al iniciar sesión", 500);
}

/*
 * ============================================================
 * TABLA REQUERIDA — ejecuta esto una vez en tu base de datos:
 * ============================================================
 *
 * CREATE TABLE login_attempts (
 *   id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   ip         VARCHAR(45) NOT NULL,
 *   created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   INDEX idx_ip (ip),
 *   INDEX idx_created (created_at)
 * );
 *
 * ============================================================
 */