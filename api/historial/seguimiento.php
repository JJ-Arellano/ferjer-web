<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

$folio = (int)($_GET["folio"] ?? 0);
if ($folio <= 0) json_err("Folio inválido");

try {
  $st = $pdo->prepare("SELECT id_equipo FROM equipos WHERE folio=? LIMIT 1");
  $st->execute([$folio]);
  $eq = $st->fetch();
  if (!$eq) json_err("Folio no encontrado", 404);

  $id_equipo = (int)$eq["id_equipo"];

  $h = $pdo->prepare("
    SELECT
      s.nombre AS estatus,
      ho.comentario,
      ho.fecha_movimiento
    FROM historial_orden ho
    JOIN estados s ON s.id_estado = ho.id_estado
    WHERE ho.id_equipo = ?
    ORDER BY ho.id_historial DESC
    LIMIT 200
  ");
  $h->execute([$id_equipo]);

  json_ok(["data" => $h->fetchAll()]);
} catch (Exception $e) {
  json_err("Error al consultar historial", 500);
}