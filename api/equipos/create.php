<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_roles(["Administrador", "Tecnico", "Empleado"]);

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$clienteNombre = trim($in["cliente"] ?? "");
$clienteEmail  = strtolower(trim($in["clienteEmail"] ?? ""));
$tipo          = trim($in["tipo"] ?? "");
$modelo        = trim($in["modelo"] ?? "");
$falla         = trim($in["falla"] ?? "");

if ($clienteNombre === "" || $clienteEmail === "" || $tipo === "" || $modelo === "" || $falla === "") {
  json_err("Faltan campos");
}

try {
  $pdo->beginTransaction();

  // 1) cliente por email
  $st = $pdo->prepare("SELECT id_cliente FROM clientes WHERE email=? LIMIT 1");
  $st->execute([$clienteEmail]);
  $c = $st->fetch();

  if ($c) {
    $id_cliente = (int)$c["id_cliente"];
    // opcional: actualizar nombre si cambió
    $up = $pdo->prepare("UPDATE clientes SET nombre=? WHERE id_cliente=?");
    $up->execute([$clienteNombre, $id_cliente]);
  } else {
    $ins = $pdo->prepare("INSERT INTO clientes (nombre, email) VALUES (?,?)");
    $ins->execute([$clienteNombre, $clienteEmail]);
    $id_cliente = (int)$pdo->lastInsertId();
  }

  // 2) estado Recibido
  $stE = $pdo->query("SELECT id_estado FROM estados WHERE nombre='Recibido' LIMIT 1");
  $rowE = $stE->fetch();
  $id_estado = $rowE ? (int)$rowE["id_estado"] : 1;

  // 3) insertar equipo (folio NULL por ahora)
  $insEq = $pdo->prepare("
    INSERT INTO equipos (folio, id_cliente, tipo_equipo, modelo, falla, id_estado)
    VALUES (NULL, ?, ?, ?, ?, ?)
  ");
  $insEq->execute([$id_cliente, $tipo, $modelo, $falla, $id_estado]);
  $id_equipo = (int)$pdo->lastInsertId();

  // 4) folio = id_equipo (simple, único)
  $upF = $pdo->prepare("UPDATE equipos SET folio=? WHERE id_equipo=?");
  $upF->execute([$id_equipo, $id_equipo]);

  // 5) historial inicial 
  $pdo->prepare("
    INSERT INTO historial_orden (id_equipo, id_estado, comentario)
    VALUES (?,?,?)
  ")->execute([$id_equipo, $id_estado, "Equipo registrado"]);

  $pdo->commit();
  json_ok(["folio" => $id_equipo, "id_equipo" => $id_equipo]);
} catch (Exception $e) {
  $pdo->rollBack();
  json_err("Error al guardar equipo", 500);
}