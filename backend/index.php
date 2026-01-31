<?php
require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;



ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Flight::register('cartItemsService', 'CartItemsService');
Flight::register('wishlistService', 'WishlistService');
Flight::register('authService', 'AuthService');
Flight::register('authMiddleware', "AuthMiddleware");
Flight::register('consoleRentalService', 'ConsoleRentalService');


Flight::route('/*', function () {
    if (
        strpos(Flight::request()->url, '/auth/login') === 0 ||
        strpos(Flight::request()->url, '/auth/register') === 0 ||
        strpos(Flight::request()->url, '/product/') === 0
    ) {
        return TRUE;
    }
    if (strpos(Flight::request()->url, '/admin') === 0) {

        try {
            $token = Flight::request()->getHeader('Authentication');

            if (Flight::authMiddleware()->verifyToken($token) && Flight::authMiddleware()->verifyIsAdmin()) {

                return TRUE;
            } else {
                echo "USER NOT ADMIN";
            }
        } catch (Exception $e) {
            Flight::halt(401, $e->getMessage());
        }
    } else {
        try {
            $token = Flight::request()->getHeader("Authentication");
            if (Flight::authMiddleware()->verifyToken($token)) {
                return TRUE;
            }
        } catch (\Exception $e) {
            Flight::halt(401, $e->getMessage());
        }
    }
});


require_once __DIR__ . '/services/AuthService.php';
require_once __DIR__ . '/services/ProductService.php';
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/OrderService.php';
require_once __DIR__ . '/services/CartService.php';

require_once __DIR__ . '/services/OrderItemService.php';
require_once __DIR__ . '/services/WishlistService.php';
require_once __DIR__ . '/services/PaymentService.php';
require_once __DIR__ . '/services/CartItemsService.php';
require_once __DIR__ . '/services/AuthService.php';
require_once __DIR__ . '/services/ConsoleRentalService.php';

Flight::register('productService', 'ProductService');
Flight::register('userService', 'UserService');
Flight::register('orderService', 'OrderService');
Flight::register('cartService', 'CartService');
Flight::register('orderItemService', 'OrderItemService');

require_once __DIR__ . '/routes/ProductRoutes.php';
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/OrderRoutes.php';
require_once __DIR__ . '/routes/AuthRoutes.php';
require_once __DIR__ . '/routes/CartRoutes.php';
require_once __DIR__ . '/routes/CartItemRoutes.php';
require_once __DIR__ . '/routes/WishlistRoutes.php';
require_once __DIR__ . '/routes/PaymentRoutes.php';
require_once __DIR__ . '/routes/ConsoleRentalRoutes.php';

Flight::route('GET /openapi.json', function() {
    // Suppress all output except JSON
    ob_clean();
    header('Content-Type: application/json');
    $openapiPath = __DIR__ . '/openapi.json';
    if (file_exists($openapiPath)) {
        echo file_get_contents($openapiPath);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'OpenAPI spec not found']);
    }
    exit;
});


Flight::start();
