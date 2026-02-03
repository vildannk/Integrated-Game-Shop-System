<?php
require_once 'BaseDao.php';

class ConsoleCatalogDao extends BaseDao {
    public function __construct() {
        parent::__construct('console_catalog');
    }

    protected function getPrimaryKey() {
        return 'ConsoleID';
    }

    public function getActive() {
        $stmt = $this->connection->prepare("SELECT * FROM console_catalog WHERE Active = 1 ORDER BY Name ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

