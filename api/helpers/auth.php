<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/response.php";

/**
 * Obtiene el header Authorization en XAMPP/Apache/NGINX de la forma más compatible posible.
 */
function get_auth_header(): string {
  // 1) Apache (XAMPP) — suele venir aquí
  if (function_exists("apache_request_headers")) {
    $h = apache_request_headers();
    if (!empty($h["Authorization"])) return $h["Authorization"];
    if (!empty($h["authorization"])) return $h["authorization"];
  }

  // 2) getallheaders (fallback)
  if (function_exists("getallheaders")) {
    $h = getallheaders();
    if (!empty($h["Authorization"])) return $h["Authorization"];
    if (!empty($h["authorization"])) return $h["authorization"];
  }

  // 3) $_SERVER (a veces viene aquí)
  return $_SERVER["HTTP_AUTHORIZATION"] ?? "";
}

function get_bearer_token(): ?string {
  $hdr = trim(get_auth_header());
  if ($hdr === "") return null;
  if (preg_match('/Bearer\s+(.+)/i', $hdr, $m)) return trim($m[1]);
  return null;
}

/**
 * Devuelve el usuario autenticado por:
 *  1) Bearer token (móvil / Postman)
 *  2) $_SESSION (web)
 */
function require_login(): array {
  global $pdo;

  // --- 1) TOKEN (móvil / postman) ---
  $token = get_bearer_token();
  if ($token) {
    $hash = hash("sha256", $token);

    $st = $pdo->prepare("
      SELECT u.id_usuario, u.nombre, u.email, u.rol
      FROM api_tokens t
      JOIN usuarios u ON u.id_usuario = t.user_id
      WHERE t.token_hash = ?
        AND t.revoked_at IS NULL
        AND (t.expires_at IS NULL OR t.expires_at > NOW())
      LIMIT 1
    ");
    $st->execute([$hash]);
    $u = $st->fetch(PDO::FETCH_ASSOC);

    if ($u) {
      return [
        "id_usuario" => (int)$u["id_usuario"],
        "nombre" => $u["nombre"],
        "email" => $u["email"],
        "rol" => $u["rol"],
      ];
    }
  }

  // --- 2) SESIÓN (web) ---
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!empty($_SESSION["user"])) return $_SESSION["user"];

  json_err("No autenticado", 401);
}

/**
 * Requiere que el usuario tenga uno de los roles permitidos.
 * Roles válidos en tu BD: Cliente, Administrador, Tecnico, Empleado
 * (case-insensitive)
 */
function only_roles(array $roles): array {
  $u = require_login();
  $rolUser = strtolower(trim($u["rol"] ?? ""));
  $rolesNorm = array_map(fn($r) => strtolower(trim((string)$r)), $roles);

  if (!in_array($rolUser, $rolesNorm, true)) {
    json_err("Acceso denegado", 403);
  }
  return $u;
}

function only_admin(): array {
  return only_roles(["Administrador"]);
}
