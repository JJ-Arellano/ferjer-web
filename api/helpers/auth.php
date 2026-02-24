<?php
require_once __DIR__ . "/response.php";

function require_login(): array {
  session_start();
  if (!isset($_SESSION["user"])) json_err("No autenticado", 401);
  return $_SESSION["user"];
}

function require_role(string $role): array {
  $u = require_login();
  if (($u["rol"] ?? "") !== $role) json_err("No autorizado", 403);
  return $u;
}