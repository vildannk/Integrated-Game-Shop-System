<?php
require_once 'BaseDao.php';

class OrderItemDao extends BaseDao {
    public function __construct() {
        parent::__construct("order_items");
    }

    
    public function getByOrderId($orderId)
    {
        $stmt = $this->connection->prepare("SELECT * FROM order_items WHERE OrderID = :orderId");
        $stmt->bindParam(':orderId', $orderId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }}


