<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "GET") json_err("Método no permitido", 405);

try {
  $st = $pdo->query("
    SELECT folio, modelo, tipo_equipo, fecha_ingreso,
           DATEDIFF(NOW(), fecha_ingreso) AS dias
    FROM equipos
    WHERE id_estado NOT IN (SELECT id_estado FROM estados WHERE nombre IN ('Entregado'))
    AND DATEDIFF(NOW(), fecha_ingreso) >= 7
  ");
  $equipos = $st->fetchAll();

  foreach ($equipos as $eq) {
    // Verificar si ya existe notificación reciente para este folio
    $check = $pdo->prepare("
      SELECT id_notificacion FROM notificaciones
      WHERE tipo = 'antiguedad'
      AND mensaje LIKE ?
      AND fecha >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      LIMIT 1
    ");
    $check->execute(["%folio {$eq['folio']}%"]);

    if (!$check->fetch()) {
      $pdo->prepare("INSERT INTO notificaciones (tipo, mensaje) VALUES (?, ?)")
        ->execute([
          "antiguedad",
          "⚠️ El equipo folio {$eq['folio']} ({$eq['tipo_equipo']} {$eq['modelo']}) lleva {$eq['dias']} días en el local"
        ]);
    }
  }

  json_ok(["equipos_antiguos" => count($equipos)]);
} catch (Exception $e) {
  json_err("Error al verificar equipos antiguos", 500);
}