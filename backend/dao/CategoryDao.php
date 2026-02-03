<?php
require_once 'BaseDao.php';

class CategoryDao extends BaseDao {
    public function __construct() {
        parent::__construct('categories');
    }

    protected function getPrimaryKey() {
        return 'CategoryID';
    }

    public function getByName($name) {
        $stmt = $this->connection->prepare("SELECT * FROM categories WHERE CategoryName = :name");
        $stmt->bindValue(':name', $name);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
