<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$folio = (int)($in["folio"] ?? 0);
$estatus = trim($in["estatus"] ?? "");
$comentario = trim($in["comentario"] ?? "Cambio de estatus");

if ($folio <= 0 || $estatus === "") json_err("Datos inválidos");

try {
  $pdo->beginTransaction();

  $st = $pdo->prepare("SELECT id_equipo FROM equipos WHERE folio=? LIMIT 1");
  $st->execute([$folio]);
  $eq = $st->fetch();
  if (!$eq) json_err("Folio no encontrado", 404);

  $id_equipo = (int)$eq["id_equipo"];

  $stE = $pdo->prepare("SELECT id_estado FROM estados WHERE nombre=? LIMIT 1");
  $stE->execute([$estatus]);
  $es = $stE->fetch();
  if (!$es) json_err("Estatus inválido", 400);

  $id_estado = (int)$es["id_estado"];

  $pdo->prepare("UPDATE equipos SET id_estado=? WHERE id_equipo=?")->execute([$id_estado, $id_equipo]);

  $pdo->prepare("
    INSERT INTO historial_orden (id_equipo, id_estado, comentario)
    VALUES (?,?,?)
  ")->execute([$id_equipo, $id_estado, $comentario]);

  $pdo->commit();
  json_ok(["msg" => "Actualizado"]);
} catch (Exception $e) {
  $pdo->rollBack();
  json_err("Error al actualizar", 500);
}