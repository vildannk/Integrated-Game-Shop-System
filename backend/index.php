<?php
require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/services/AuthService.php';
require_once __DIR__ . '/services/ProductService.php';
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/OrderService.php';
require_once __DIR__ . '/services/CartService.php';
require_once __DIR__ . '/services/OrderItemService.php';
require_once __DIR__ . '/services/CartItemsService.php';
require_once __DIR__ . '/services/ConsoleRentalService.php';
require_once __DIR__ . '/services/ConsoleCatalogService.php';
require_once __DIR__ . '/services/CategoryService.php';
require_once __DIR__ . '/services/NotificationService.php';

Flight::register('authService', 'AuthService');
Flight::register('productService', 'ProductService');
Flight::register('userService', 'UserService');
Flight::register('orderService', 'OrderService');
Flight::register('cartService', 'CartService');
Flight::register('orderItemService', 'OrderItemService');
Flight::register('cartItemsService', 'CartItemsService');
Flight::register('consoleRentalService', 'ConsoleRentalService');
Flight::register('consoleCatalogService', 'ConsoleCatalogService');
Flight::register('categoryService', 'CategoryService');
Flight::register('notificationService', 'NotificationService');
Flight::register('auth_middleware', 'AuthMiddleware');

require_once __DIR__ . '/routes/_helpers.php';
require_once __DIR__ . '/routes/AuthRoutes.php';
require_once __DIR__ . '/routes/ProductRoutes.php';
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/CartRoutes.php';
require_once __DIR__ . '/routes/OrderRoutes.php';
require_once __DIR__ . '/routes/RentalRoutes.php';
require_once __DIR__ . '/routes/CategoryRoutes.php';
require_once __DIR__ . '/routes/UploadRoutes.php';
require_once __DIR__ . '/routes/NotificationRoutes.php';
require_once __DIR__ . '/routes/ContactRoutes.php';

Flight::route('GET /openapi.json', function() {
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
