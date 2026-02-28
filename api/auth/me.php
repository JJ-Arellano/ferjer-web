<?php
require_once __DIR__ . "/../helpers/auth.php";
require_once __DIR__ . "/../helpers/response.php";

$user = require_login();
json_ok(["user" => $user]);