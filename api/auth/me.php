<?php
require_once __DIR__ . "/../helpers/response.php";
session_start();

if (!isset($_SESSION["user"])) json_err("No autenticado", 401);
json_ok(["user" => $_SESSION["user"]]);