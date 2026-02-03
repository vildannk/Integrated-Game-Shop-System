<?php

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../services/ProductService.php';
require_once __DIR__ . '/../services/UserService.php';
require_once __DIR__ . '/../services/OrderService.php';
require_once __DIR__ . '/../services/CartService.php';
require_once __DIR__ . '/../services/CartItemsService.php';
require_once __DIR__ . '/../services/ConsoleRentalService.php';

function require_auth() {
    $token = Flight::request()->getHeader('Authentication');
    Flight::auth_middleware()->verifyToken($token);
}

function require_roles($roles) {
    require_auth();
    Flight::auth_middleware()->authorizeRoles($roles);
}

function json_response($data = null, $success = true, $code = 200, $message = null) {
    Flight::json([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], $code);
}
