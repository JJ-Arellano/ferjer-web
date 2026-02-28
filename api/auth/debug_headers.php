<?php
header("Content-Type: application/json; charset=utf-8");

$auth = $_SERVER["HTTP_AUTHORIZATION"] ?? null;

$apacheAuth = null;
if (function_exists("apache_request_headers")) {
  $h = apache_request_headers();
  $apacheAuth = $h["Authorization"] ?? ($h["authorization"] ?? null);
}

echo json_encode([
  "HTTP_AUTHORIZATION" => $auth,
  "apache_headers_authorization" => $apacheAuth
], JSON_UNESCAPED_UNICODE);