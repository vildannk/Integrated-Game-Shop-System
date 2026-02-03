<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/OrderDao.php';
require_once __DIR__ . '/../dao/OrderItemDao.php';
require_once __DIR__ . '/../dao/CartDao.php';
require_once __DIR__ . '/../dao/ProductDao.php';
require_once __DIR__ . '/NotificationService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class OrderService extends BaseService {
    private $orderItemDao;
    private $cartDao;
    private $productDao;
    private $notificationService;
    private $userDao;

    public function __construct() {
        parent::__construct(new OrderDao());
        $this->orderItemDao = new OrderItemDao();
        $this->cartDao = new CartDao();
        $this->productDao = new ProductDao();
        $this->notificationService = new NotificationService();
        $this->userDao = new UserDao();
    }

    public function getAllOrders() {
        return $this->dao->getAll();
    }

    public function getOrdersByUserId($userId) {
        $stmt = $this->dao->getConnection()->prepare("SELECT * FROM orders WHERE UserID = :userId ORDER BY OrderDate DESC");
        $stmt->bindValue(':userId', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderWithItems($orderId) {
        $order = $this->dao->getById($orderId);
        if (!$order) {
            throw new Exception("Order not found");
        }
        $items = $this->orderItemDao->getByOrderId($orderId);
        return [
            'order' => $order,
            'items' => $items
        ];
    }

    public function updateOrderStatus($orderId, $status) {
        $allowed = ['pending','processing','shipped','delivered','cancelled'];
        if (!in_array($status, $allowed, true)) {
            throw new Exception("Invalid status value");
        }
        return $this->dao->update($orderId, ['Status' => $status]);
    }

    public function createOrder($orderData) {
        if (empty($orderData['UserID']) || empty($orderData['Items'])) {
            throw new Exception("UserID and Items are required");
        }

        $userId = (int)$orderData['UserID'];
        $items = $orderData['Items'];
        $shipping = $orderData['ShippingAddress'] ?? 'N/A';

        $totalAmount = 0;
        $orderItems = [];

        foreach ($items as $item) {
            $productId = (int)($item['ProductID'] ?? 0);
            $quantity = (int)($item['Quantity'] ?? 0);
            if ($productId <= 0 || $quantity <= 0) {
                throw new Exception("Invalid item data");
            }
            $product = $this->productDao->getById($productId);
            if (!$product) {
                throw new Exception("Product not found: {$productId}");
            }
            if ($product['Stock'] < $quantity) {
                throw new Exception("Not enough stock for product: {$product['Name']}");
            }
            $totalAmount += $product['Price'] * $quantity;
            $orderItems[] = [
                'ProductID' => $productId,
                'Quantity' => $quantity,
                'Price' => $product['Price']
            ];
        }

        $orderId = $this->dao->insert([
            'UserID' => $userId,
            'TotalAmount' => $totalAmount,
            'ShippingAddress' => $shipping
        ]);

        foreach ($orderItems as $item) {
            $this->orderItemDao->insert(array_merge(['OrderID' => $orderId], $item));
            $product = $this->productDao->getById($item['ProductID']);
            $this->productDao->updateStock($item['ProductID'], $product['Stock'] - $item['Quantity']);
        }

        return [
            'success' => true,
            'orderId' => $orderId,
            'total' => $totalAmount
        ];
    }

    public function createOrderFromCart($userId, $shippingData, $paymentData = []) {
        $shippingAddress = is_array($shippingData) ? ($shippingData['ShippingAddress'] ?? '') : $shippingData;
        if (empty($shippingAddress)) {
            $shippingAddress = 'N/A';
        }

        $shippingCity = is_array($shippingData) ? ($shippingData['ShippingCity'] ?? null) : null;
        $shippingPostal = is_array($shippingData) ? ($shippingData['ShippingPostalCode'] ?? null) : null;
        $shippingStreetNumber = is_array($shippingData) ? ($shippingData['ShippingStreetNumber'] ?? null) : null;

        $cardNumber = preg_replace('/\D+/', '', (string)($paymentData['cardNumber'] ?? ''));
        $cardLast4 = $cardNumber ? substr($cardNumber, -4) : null;
        $cardName = trim((string)($paymentData['nameOnCard'] ?? ''));

        $expRaw = trim((string)($paymentData['expiry'] ?? ''));
        $expMonth = null;
        $expYear = null;
        if (preg_match('/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/', $expRaw, $matches)) {
            $expMonth = $matches[1];
            $expYear = strlen($matches[2]) === 2 ? ('20' . $matches[2]) : $matches[2];
        }

        $cartItems = $this->cartDao->getByUserId($userId);
        if (empty($cartItems)) {
            throw new Exception("Cart is empty.");
        }

        $totalAmount = 0;
        $orderItems = [];
        foreach ($cartItems as $item) {
            $product = $this->productDao->getById($item['ProductID']);
            if ($product['Stock'] < $item['quantity']) {
                throw new Exception("Not enough stock for product: " . $product['Name']);
            }
            $itemTotal = $product['Price'] * $item['quantity'];
            $totalAmount += $itemTotal;
            $orderItems[] = [
                'ProductID' => $product['ProductID'],
                'Quantity' => $item['quantity'],
                'Price' => $product['Price']
            ];
        }

        $orderId = $this->dao->insert([
            'UserID' => $userId,
            'TotalAmount' => $totalAmount,
            'ShippingAddress' => $shippingAddress,
            'ShippingCity' => $shippingCity,
            'ShippingPostalCode' => $shippingPostal,
            'ShippingStreetNumber' => $shippingStreetNumber,
            'CardName' => $cardName ?: null,
            'CardLast4' => $cardLast4,
            'CardExpMonth' => $expMonth,
            'CardExpYear' => $expYear
        ]);

        foreach ($orderItems as $item) {
            $this->orderItemDao->insert(array_merge(['OrderID' => $orderId], $item));
            $product = $this->productDao->getById($item['ProductID']);
            $this->productDao->updateStock($item['ProductID'], $product['Stock'] - $item['Quantity']);
        }

        $this->cartDao->clearCart($userId);
        $user = $this->userDao->getById($userId);
        $userName = $user && isset($user['Name']) ? $user['Name'] : "User #{$userId}";
        $this->notificationService->addAdminNotification(
            'New order placed',
            "{$userName} placed an order. Total: " . $totalAmount . " BAM",
            'order'
        );
        return $orderId;
    }
}

