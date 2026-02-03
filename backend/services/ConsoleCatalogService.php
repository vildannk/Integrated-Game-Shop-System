<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ConsoleCatalogDao.php';

class ConsoleCatalogService extends BaseService {
    public function __construct() {
        parent::__construct(new ConsoleCatalogDao());
    }

    public function getActiveCatalog() {
        return $this->dao->getActive();
    }
}

