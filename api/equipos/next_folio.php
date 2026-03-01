<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

$st = $pdo->query("SELECT AUTO_INCREMENT AS next_id
                   FROM information_schema.tables
                   WHERE table_schema = DATABASE()
                     AND table_name = 'equipos'
                   LIMIT 1");
$row = $st->fetch();

$next = $row && $row["next_id"] ? (int)$row["next_id"] : null;
if (!$next) json_err("No se pudo obtener el siguiente folio", 500);

json_ok(["next_folio" => $next]);