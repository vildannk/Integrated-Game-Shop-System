<?php
require_once 'BaseDao.php';

class OrderDao extends BaseDao {
    public function __construct() {
        parent::__construct("orders");
    }

    protected function getPrimaryKey() {
        return "OrderID";
    }
}

