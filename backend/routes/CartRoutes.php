<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /cart', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $cart = Flight::userService()->getUserCart($userId);
    $items = Flight::userService()->getUserOrders($userId);
    json_response([
        'cart' => $cart,
        'items' => $items
    ]);
});

Flight::route('POST /cart/items', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $payload = Flight::request()->data->getData();
    $productId = $payload['ProductID'] ?? null;
    $quantity = $payload['quantity'] ?? 1;

    if (!$productId) {
        json_response(null, false, 400, 'ProductID is required');
        return;
    }

    $cart = Flight::cartService()->getCartByUserID($userId);
    if (!$cart || !isset($cart['CartID'])) {
        $created = Flight::userService()->createCart($userId);
        $cartId = is_array($created) && isset($created['CartID']) ? $created['CartID'] : null;
    } else {
        $cartId = $cart['CartID'];
    }

    if (!$cartId) {
        json_response(null, false, 500, 'Unable to create cart');
        return;
    }

    $result = Flight::cartItemsService()->addCartItem($cartId, $productId, $quantity);
    json_response($result, true, 201, 'Item added to cart');
});

Flight::route('DELETE /cart/items/@id', function ($id) {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $result = Flight::cartItemsService()->deleteCartItem($id, $userId);
    json_response($result, true, 200, 'Item removed');
});

Flight::route('POST /cart/checkout', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $payload = Flight::request()->data->getData();
    $shipping = $payload['shipping'] ?? [];
    $payment = $payload['payment'] ?? [];

    $shippingAddress = trim($shipping['address'] ?? '');
    $shippingCity = trim($shipping['city'] ?? '');
    $shippingPostal = trim($shipping['postalCode'] ?? '');
    $shippingStreetNumber = trim($shipping['streetNumber'] ?? '');

    if ($shippingAddress === '' || $shippingCity === '' || $shippingPostal === '' || $shippingStreetNumber === '') {
        json_response(null, false, 400, 'Shipping details are required');
        return;
    }

    try {
        $orderId = Flight::orderService()->createOrderFromCart($userId, [
            'ShippingAddress' => $shippingAddress,
            'ShippingCity' => $shippingCity,
            'ShippingPostalCode' => $shippingPostal,
            'ShippingStreetNumber' => $shippingStreetNumber
        ], $payment);
        json_response(['orderId' => $orderId], true, 201, 'Order created');
    } catch (Exception $e) {
        json_response(null, false, 400, $e->getMessage());
    }
});
