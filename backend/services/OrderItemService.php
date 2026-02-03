<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/OrderItemDao.php';
require_once __DIR__ . '/../dao/ProductDao.php';

class OrderItemService extends BaseService {
    private $productDao;

    public function __construct() {
        parent::__construct(new OrderItemDao());
        $this->productDao = new ProductDao();
    }

    public function getItemsByOrder($orderId) {
        return $this->dao->getByOrderId($orderId);
    }

    public function addItemToOrder($orderId, $productId, $quantity) {
        if ($quantity <= 0) {
            throw new Exception("Quantity must be at least 1");
        }

        $product = $this->productDao->getById($productId);
        if (!$product) {
            throw new Exception("Product not found");
        }

        if ($product['Stock'] < $quantity) {
            throw new Exception("Insufficient stock");
        }

        return $this->dao->insert([
            'OrderID' => $orderId,
            'ProductID' => $productId,
            'Quantity' => $quantity,
            'Price' => $product['Price']
        ]);
    }

    public function updateItemQuantity($itemId, $newQuantity) {
        if ($newQuantity <= 0) {
            throw new Exception("Quantity must be at least 1");
        }

        $item = $this->dao->getById($itemId);
        if (!$item) {
            throw new Exception("Order item not found");
        }

        $product = $this->productDao->getById($item['ProductID']);
        if ($product['Stock'] + $item['Quantity'] < $newQuantity) {
            throw new Exception("Insufficient stock");
        }

        return $this->dao->update($itemId, [
            'Quantity' => $newQuantity
        ]);
    }

    public function calculateOrderTotal($orderId) {
        $items = $this->getItemsByOrder($orderId);
        $total = 0;
        foreach ($items as $item) {
            $total += $item['Price'] * $item['Quantity'];
        }
        return $total;
    }
}

