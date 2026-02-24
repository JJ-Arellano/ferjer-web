<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../helpers/response.php";

// 🔍 DEPURACIÓN: Loggear lo que llega
error_log("=== update_status.php ===");
error_log("Method: " . $_SERVER["REQUEST_METHOD"]);
$input = file_get_contents("php://input");
error_log("Raw input: " . $input);

if ($_SERVER["REQUEST_METHOD"] !== "POST") json_err("Método no permitido", 405);

$in = read_json_body();
error_log("Parsed data: " . print_r($in, true));

$folio = isset($in["folio"]) ? (int)$in["folio"] : 0;
$estatus = trim($in["estatus"] ?? "");
$comentario = trim($in["comentario"] ?? "Cambio de estatus");

error_log("Processed - Folio: $folio (tipo: " . gettype($folio) . "), Estatus: $estatus, Comentario: $comentario");

if ($folio <= 0 || $estatus === "") {
    error_log("❌ Datos inválidos: folio=$folio, estatus=$estatus");
    json_err("Datos inválidos");
}

try {
    $pdo->beginTransaction();

    // Verificar que el equipo existe
    $st = $pdo->prepare("SELECT id_equipo FROM equipos WHERE folio=? LIMIT 1");
    $st->execute([$folio]);
    $eq = $st->fetch(PDO::FETCH_ASSOC);
    
    if (!$eq) { 
        $pdo->rollBack(); 
        error_log("❌ Folio no encontrado: $folio");
        json_err("Folio no encontrado", 404); 
    }

    $id_equipo = (int)$eq["id_equipo"];
    error_log("✅ Equipo encontrado: id_equipo=$id_equipo");

    // Obtener ID del estado
    $stE = $pdo->prepare("SELECT id_estado FROM estados WHERE nombre=? LIMIT 1");
    $stE->execute([$estatus]);
    $es = $stE->fetch(PDO::FETCH_ASSOC);
    
    if (!$es) { 
        $pdo->rollBack(); 
        error_log("❌ Estatus no encontrado: $estatus");
        json_err("Estatus inválido", 400); 
    }

    $id_estado = (int)$es["id_estado"];
    error_log("✅ Estado encontrado: id_estado=$id_estado");

    // Actualizar equipo
    $upd = $pdo->prepare("UPDATE equipos SET id_estado=? WHERE id_equipo=?");
    $upd->execute([$id_estado, $id_equipo]);
    
    error_log("Rows affected by UPDATE: " . $upd->rowCount());

    if ($upd->rowCount() !== 1) {
        $pdo->rollBack();
        error_log("❌ No se actualizó el equipo");
        json_err("No se actualizó el equipo", 500);
    }

    // Insertar en historial
    $ins = $pdo->prepare("
        INSERT INTO historial_orden (id_equipo, id_estado, comentario)
        VALUES (?,?,?)
    ");
    $ins->execute([$id_equipo, $id_estado, $comentario]);
    
    error_log("✅ Historial insertado: " . $pdo->lastInsertId());

    $pdo->commit();

    json_ok([
        "msg" => "Actualizado",
        "folio" => $folio,
        "estatus" => $estatus,
        "id_estado" => $id_estado
    ]);
    
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log("❌ Excepción: " . $e->getMessage());
    json_err("Error al actualizar: " . $e->getMessage(), 500);
}