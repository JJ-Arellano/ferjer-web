<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

// Revocar token si viene
$token = get_bearer_token();
if ($token) {
  $hash = hash("sha256", $token);
  try {
    $pdo->prepare("UPDATE api_tokens SET revoked_at = NOW() WHERE token_hash = ?")->execute([$hash]);
  } catch (Exception $e) {
    // ignorar si no existe tabla
  }
}

// Cerrar sesión web
if (session_status() === PHP_SESSION_NONE) session_start();
$_SESSION = [];
if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(session_name(), "", time() - 42000,
    $params["path"], $params["domain"],
    $params["secure"], $params["httponly"]
  );
}
session_destroy();

json_ok();
