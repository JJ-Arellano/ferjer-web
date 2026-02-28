<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

// Este endpoint sirve para:
//  A) Cliente con cuenta (token/sesión): obtiene SUS equipos
//  B) Cliente sin cuenta: puede pasar ?email=... (seguimiento básico)
if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

$email = strtolower(trim($_GET["email"] ?? ""));

// Si viene token/sesión, preferimos ese email
try {
  $u = null;
  // require_login() fallaría si no hay sesión/token; por eso intentamos suave:
  $token = get_bearer_token();
  if ($token || (session_status() !== PHP_SESSION_NONE && !empty($_SESSION["user"]))) {
    $u = require_login();
  } else {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (!empty($_SESSION["user"])) $u = $_SESSION["user"];
  }

  if ($u && !empty($u["email"])) {
    $email = strtolower(trim($u["email"]));
  }
} catch (Exception $e) {
  // ignore
}

if ($email === "") json_err("Falta email", 400);

try {
  $st = $pdo->prepare("
    SELECT
      e.folio,
      CONCAT(e.tipo_equipo, ' - ', e.modelo) AS equipo,
      s.nombre AS estatus,
      e.fecha_ingreso
    FROM equipos e
    JOIN clientes c ON c.id_cliente = e.id_cliente
    JOIN estados s ON s.id_estado = e.id_estado
    WHERE c.email = ?
    ORDER BY e.id_equipo DESC
    LIMIT 300
  ");
  $st->execute([$email]);
  json_ok(["data" => $st->fetchAll()]);
} catch (Exception $e) {
  json_err("Error al listar equipos del cliente", 500);
}
