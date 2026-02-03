<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/CategoryDao.php';

class CategoryService extends BaseService {
    public function __construct() {
        parent::__construct(new CategoryDao());
    }

    public function createCategory($data) {
        if (empty($data['CategoryName'])) {
            throw new Exception('CategoryName is required');
        }
        $existing = $this->dao->getByName($data['CategoryName']);
        if ($existing) {
            throw new Exception('Category already exists');
        }
        return $this->dao->insert([ 'CategoryName' => $data['CategoryName'] ]);
    }
}
