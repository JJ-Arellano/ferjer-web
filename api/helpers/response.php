<?php
function json_ok($data = [], int $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(["ok" => true] + $data, JSON_UNESCAPED_UNICODE);
  exit;
}

function json_err(string $msg, int $code = 400, $extra = []) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(["ok" => false, "error" => $msg] + (array)$extra, JSON_UNESCAPED_UNICODE);
  exit;
}

function read_json_body(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}