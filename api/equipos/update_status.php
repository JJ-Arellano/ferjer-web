<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();

// Solo Administrador y Tecnico pueden cambiar estatus
// Solo Administrador, Tecnico y Empleado pueden cambiar estatus
$usuario = only_roles(["Administrador", "Tecnico", "Empleado"]);

// Empleado solo puede cambiar a "Entregado"
if (strtolower(trim($usuario["rol"])) === "empleado" && trim($in["estatus"] ?? "") !== "Entregado") {
    json_err("Acceso denegado", 403);
}

$folio = isset($in["folio"]) ? (int)$in["folio"] : 0;
$estatus = trim($in["estatus"] ?? "");
$comentario = trim($in["comentario"] ?? "Cambio de estatus");

if ($folio <= 0 || $estatus === "") json_err("Datos inválidos");

try {
  $pdo->beginTransaction();

  // Buscar estado por nombre
  $st = $pdo->prepare("SELECT id_estado FROM estados WHERE nombre = ? LIMIT 1");
  $st->execute([$estatus]);
  $row = $st->fetch();
  if (!$row) json_err("Estatus inválido", 400);

  $id_estado = (int)$row["id_estado"];

  // Verificar que el folio existe y obtener id_equipo
  $check = $pdo->prepare("SELECT id_equipo FROM equipos WHERE folio = ?");
  $check->execute([$folio]);
  $equipo = $check->fetch();
  if (!$equipo) {
      $pdo->rollBack();
      json_err("Folio no encontrado", 404);
  }

  $id_equipo = $equipo["id_equipo"];

  // Actualizar equipo
  $up = $pdo->prepare("UPDATE equipos SET id_estado = ? WHERE folio = ? LIMIT 1");
  $up->execute([$id_estado, $folio]);

  // Guardar historial
  $pdo->prepare("
    INSERT INTO historial_orden (id_equipo, id_estado, comentario, fecha_movimiento)
    VALUES (?, ?, ?, NOW())
  ")->execute([$id_equipo, $id_estado, $comentario]);

  $pdo->commit();
  json_ok();
} catch (Exception $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  json_err("Error al actualizar estatus", 500);
}