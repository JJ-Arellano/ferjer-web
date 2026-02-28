<?php
require_once __DIR__ . "/response.php";

function get_session_user(): array {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return $_SESSION["user"] ?? [];
}

function require_login(): array {
    $user = get_session_user();
    if (empty($user)) json_err("No autenticado", 401);
    return $user;
}

// Mantiene compatibilidad con tu código anterior
function require_role(string $role): array {
    $u = require_login();
    if (($u["rol"] ?? "") !== $role) json_err("No autorizado", 403);
    return $u;
}

// Nuevo: verifica que sea Admin
function only_admin(): array {
    $u = require_login();
    $rol = strtolower($u["rol"] ?? "");
    if ($rol !== "administrador") json_err("Acceso denegado", 403);
    return $u;
}

// Nuevo: verifica que sea uno de varios roles permitidos
function only_roles(array $roles): array {
    $u = require_login();
    $rol = strtolower($u["rol"] ?? "");
    $rolesNorm = array_map('strtolower', $roles);
    if (!in_array($rol, $rolesNorm, true)) json_err("Acceso denegado", 403);
    return $u;
}