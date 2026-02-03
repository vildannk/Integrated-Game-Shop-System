<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /orders', function () {
    require_roles([1]);
    $orders = Flight::orderService()->getAllOrders();
    json_response($orders);
});

Flight::route('GET /orders/me', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $orders = Flight::orderService()->getOrdersByUserId($userId);
    json_response($orders);
});

Flight::route('GET /orders/@id', function ($id) {
    require_auth();
    $order = Flight::orderService()->getOrderWithItems($id);
    $user = Flight::get('user');
    if (!$user) {
        json_response(null, false, 401, 'Unauthorized');
        return;
    }
    if ((int)$user->role !== 1 && (int)$order['order']['UserID'] !== (int)$user->UserID) {
        json_response(null, false, 403, 'Forbidden');
        return;
    }
    json_response($order);
});
