<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../helpers/auth.php";

only_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
$id = $in["id"] ?? null;

if (!$id) json_err("ID requerido");

try {
  $pdo->beginTransaction();

  // Eliminar items de los pedidos del usuario
  $pdo->prepare("
    DELETE pi FROM pedido_items pi
    JOIN pedidos p ON p.id_pedido = pi.id_pedido
    WHERE p.id_usuario = ?
  ")->execute([(int)$id]);

  // Eliminar pedidos del usuario
  $pdo->prepare("DELETE FROM pedidos WHERE id_usuario = ?")->execute([(int)$id]);

  // Eliminar tokens del usuario
  $pdo->prepare("DELETE FROM api_tokens WHERE user_id = ?")->execute([(int)$id]);

  // Eliminar usuario
  $st = $pdo->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
  $st->execute([(int)$id]);

  if ($st->rowCount() === 0) {
    $pdo->rollBack();
    json_err("Usuario no encontrado", 404);
  }

  $pdo->commit();
  json_ok(["mensaje" => "Usuario eliminado"]);

} catch (Exception $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  json_err("Error al eliminar usuario: " . $e->getMessage(), 500);
}