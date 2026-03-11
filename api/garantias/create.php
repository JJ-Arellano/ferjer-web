<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador","Tecnico","Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$data     = json_decode(file_get_contents("php://input"), true);
$id_equipo = intval($data["id_equipo"] ?? 0);

if (!$id_equipo) json_err("id_equipo requerido", 400);

try {
  // Verificar que el equipo existe y está Entregado
  $st = $pdo->prepare("
    SELECT e.id_equipo FROM equipos e
    JOIN estados es ON e.id_estado = es.id_estado
    WHERE e.id_equipo = ? AND es.nombre = 'Entregado'
  ");
  $st->execute([$id_equipo]);
  if (!$st->fetch()) json_err("El equipo no existe o no está entregado", 422);

  // Insertar garantía (si ya existe, ignorar)
  $pdo->prepare("
    INSERT IGNORE INTO garantias (id_equipo, fecha_entrega, fecha_vencimiento)
    VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY))
  ")->execute([$id_equipo]);

  json_ok(["mensaje" => "Garantía generada correctamente"]);
} catch (Exception $e) {
  json_err("Error al generar garantía: " . $e->getMessage(), 500);
}