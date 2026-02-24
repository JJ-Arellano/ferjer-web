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
  $eq = $st->fetch(PDO::FETCH_ASSOC);
  if (!$eq) { $pdo->rollBack(); json_err("Folio no encontrado", 404); }

  $id_equipo = (int)$eq["id_equipo"];

  $stE = $pdo->prepare("SELECT id_estado FROM estados WHERE nombre=? LIMIT 1");
  $stE->execute([$estatus]);
  $es = $stE->fetch(PDO::FETCH_ASSOC);
  if (!$es) { $pdo->rollBack(); json_err("Estatus inválido", 400); }

  $id_estado = (int)$es["id_estado"];

  $upd = $pdo->prepare("UPDATE equipos SET id_estado=? WHERE id_equipo=?");
  $upd->execute([$id_estado, $id_equipo]);

  // ✅ si no cambió nada, no lo “damos por guardado”
  if ($upd->rowCount() !== 1) {
    $pdo->rollBack();
    json_err("No se actualizó el equipo (rowCount=0). Revisa folio/id_equipo.", 500);
  }

  $ins = $pdo->prepare("
    INSERT INTO historial_orden (id_equipo, id_estado, comentario)
    VALUES (?,?,?)
  ");
  $ins->execute([$id_equipo, $id_estado, $comentario]);

  $pdo->commit();

  // ✅ devuelve lo guardado
  json_ok([
    "msg" => "Actualizado",
    "folio" => $folio,
    "estatus" => $estatus,
    "id_estado" => $id_estado
  ]);
} catch (Exception $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  json_err("Error al actualizar", 500);
}