<?php
/**
 * Lee el archivo .env de la raíz del proyecto y carga las variables.
 * Úsalo haciendo: require_once __DIR__ . "/../helpers/env.php";
 */
function load_env(): void {
  // Busca el .env en la raíz del proyecto (dos niveles arriba de /helpers/env.php)
  $path = dirname(__DIR__, 2) . "/.env";

  if (!file_exists($path)) {
    throw new RuntimeException(".env no encontrado en: $path");
  }

  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    $line = trim($line);
    // Ignorar comentarios
    if ($line === "" || str_starts_with($line, "#")) continue;

    [$key, $value] = array_pad(explode("=", $line, 2), 2, "");
    $key   = trim($key);
    $value = trim($value);

    // Quitar comillas si las hay: DB_PASS="mi clave"
    if (preg_match('/^"(.*)"$/', $value, $m)) $value = $m[1];
    if (preg_match("/^'(.*)'$/", $value, $m)) $value = $m[1];

    if ($key !== "") putenv("$key=$value");
  }
}