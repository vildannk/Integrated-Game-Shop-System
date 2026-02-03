<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService extends BaseService {
    public function __construct() {
        parent::__construct(new UserDao());
    }

    public function getUserCart($user_ID)
    {
        return $this->dao->getUserCart($user_ID);
    }

    public function getUserOrders($user_ID)
    {
        return $this->dao->getUserOrders($user_ID);
    }

    public function createCart($user_ID)
    {
        return $this->dao->createCart($user_ID);
    }
}
