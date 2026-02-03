<?php
require_once 'BaseDao.php';

class ProductDao extends BaseDao {
    public function __construct() {
        parent::__construct("products");
    }

    protected function getPrimaryKey() {
        return "ProductID";
    }

    public function getOnSale() {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE OnSale = 1");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByCategoryId($categoryId) {
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE CategoryID = :categoryId");
        $stmt->bindParam(':categoryId', $categoryId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function searchByName($keyword) {
        $searchTerm = '%' . $keyword . '%';
        $stmt = $this->connection->prepare("SELECT * FROM products WHERE Name LIKE :keyword");
        $stmt->bindParam(':keyword', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStock($productId, $newStock) {
        $stmt = $this->connection->prepare("UPDATE products SET Stock = :stock WHERE ProductID = :id");
        $stmt->bindParam(':stock', $newStock);
        $stmt->bindParam(':id', $productId);
        return $stmt->execute();
    }

    public function addProduct($data) {
        try {
            $required = ['Name', 'Price', 'Stock', 'CategoryID', 'Description', 'ImageURL'];
            foreach ($required as $field) {
                if (!isset($data[$field]) || $data[$field] === '') {
                    throw new Exception("Missing required field: $field");
                }
            }

            if (!is_numeric($data['Price']) || $data['Price'] <= 0) {
                throw new Exception("Price must be a positive number");
            }
            if (!is_numeric($data['Stock']) || $data['Stock'] < 0) {
                throw new Exception("Stock must be a non-negative number");
            }
            if (!is_numeric($data['CategoryID'])) {
                throw new Exception("Invalid CategoryID");
            }

            if (!isset($data['OnSale'])) {
                $data['OnSale'] = 0;
            }

            $columns = array_keys($data);
            $placeholders = array_map(function($col) { return ":$col"; }, $columns);
            $sql = "INSERT INTO products (" . implode(", ", $columns) . ") 
                   VALUES (" . implode(", ", $placeholders) . ")";

            $stmt = $this->connection->prepare($sql);

            foreach ($data as $key => $value) {
                $type = PDO::PARAM_STR;
                if (is_int($value) || in_array($key, ['Stock', 'CategoryID', 'OnSale'])) {
                    $type = PDO::PARAM_INT;
                } elseif (is_bool($value)) {
                    $type = PDO::PARAM_BOOL;
                } elseif (is_float($value) || $key === 'Price') {
                    $value = (string)$value;
                }
                $stmt->bindValue(":$key", $value, $type);
            }

            if ($stmt->execute()) {
                $insertId = $this->connection->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Product added successfully',
                    'productId' => $insertId,
                    'data' => $data
                ];
            }

            throw new Exception("Failed to execute query");
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage()
            ];
        }
    }

    public function getPaged($limit, $offset) {
        $stmt = $this->connection->prepare("SELECT * FROM products LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
