<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService extends BaseService {
    public function __construct() {
        parent::__construct(new UserDao());
    }

    public function registerUser($userData) {
        $required = ['Name', 'Email', 'Password'];
        foreach ($required as $field) {
            if (empty($userData[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        if (!filter_var($userData['Email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }
        if ($this->dao->getByEmail($userData['Email'])) {
            throw new Exception("Email already registered.");
        }
        $userData['Password'] = password_hash($userData['Password'], PASSWORD_BCRYPT);
        if (!isset($userData['RoleID'])) {
            $userData['RoleID'] = 2;
        }
        return $this->dao->insert($userData);
        
    }

    public function getUserByEmail($email) {
        return $this->dao->getByEmail($email);
    }

    public function authenticate($email, $password) {
        $user = $this->getUserByEmail($email);
        if (!$user || !password_verify($password, $user['Password'])) {
            throw new Exception("Invalid email or password.");
        }
        return $user;
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

    public function checkOut($user_ID)
    {
        return $this->dao->checkOut($user_ID);
    }   
}

?>
