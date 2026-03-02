<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();

$nombre   = trim($in["nombre"] ?? "");
$email    = strtolower(trim($in["email"] ?? ""));
$telefono = trim($in["telefono"] ?? "") ?: null;
$password = (string)($in["password"] ?? "");
$rol      = "Cliente";

if ($nombre === "")  json_err("El nombre es requerido", 400);
if ($email === "")   json_err("El email es requerido", 400);
if (strpos($email, "@") === false) json_err("Email inválido", 400);
if (strlen($password) < 6) json_err("La contraseña debe tener al menos 6 caracteres", 400);

try {
    // Verificar email duplicado
    $st = $pdo->prepare("SELECT 1 FROM usuarios WHERE email=? LIMIT 1");
    $st->execute([$email]);
    if ($st->fetchColumn()) json_err("Ese email ya está registrado", 409);

    $hash = password_hash($password, PASSWORD_DEFAULT);

    // 1) Insertar en usuarios (para el login)
    $ins = $pdo->prepare("INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?,?,?,?)");
    $ins->execute([$nombre, $email, $hash, $rol]);

    $id_usuario = $pdo->lastInsertId();

    // 2) Insertar en clientes (incluyendo password_hash)
    $ins2 = $pdo->prepare("INSERT INTO clientes (nombre, email, telefono, password_hash) VALUES (?,?,?,?)");
    $ins2->execute([$nombre, $email, $telefono, $hash]);

    json_ok(["msg" => "Cuenta creada correctamente"]);

} catch (Exception $e) {
    json_err("Error al crear cuenta: " . $e->getMessage(), 500);
}