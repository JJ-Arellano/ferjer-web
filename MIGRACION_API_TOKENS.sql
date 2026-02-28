-- MIGRACION_API_TOKENS.sql
-- Agrega soporte de tokens Bearer para la API (móvil/web)
-- Ejecuta esto en tu base ferjer_sistema (phpMyAdmin -> SQL)

CREATE TABLE IF NOT EXISTS api_tokens (
  id_token INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME NULL,
  INDEX (token_hash),
  INDEX (id_usuario),
  CONSTRAINT fk_api_tokens_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
