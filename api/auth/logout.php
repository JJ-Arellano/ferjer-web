<?php
require_once __DIR__ . "/../helpers/response.php";
session_start();
session_destroy();
json_ok(["msg" => "Sesión cerrada"]);