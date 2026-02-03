<?php
require_once __DIR__ . "/../config/Config.php";
require_once __DIR__ . "/Database.php";

class BaseDao {
    protected $table;
    protected $connection;

    public function __construct($table) {
        $this->table = $table;
        $this->connection = Database::connect();
    }

    public function getAll($order_column = null, $order_direction = "ASC") {
        $query = "SELECT * FROM {$this->table}";

        if ($order_column) {
            $order_direction = strtoupper($order_direction) === 'DESC' ? 'DESC' : 'ASC';
            $query .= " ORDER BY {$order_column} {$order_direction}";
        }

        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->connection->prepare("SELECT * FROM {$this->table} WHERE {$this->getPrimaryKey()} = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function insert($data) {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($data);
    }

    public function update($id, $data) {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");
        $sql = "UPDATE {$this->table} SET $fields WHERE {$this->getPrimaryKey()} = :id";
        $stmt = $this->connection->prepare($sql);
        $data['id'] = $id;
        return $stmt->execute($data);
    }

    public function delete($id) {
        $stmt = $this->connection->prepare("DELETE FROM {$this->table} WHERE {$this->getPrimaryKey()} = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getConnection() {
        return $this->connection;
    }

    protected function getPrimaryKey() {
        return 'id';
    }
}
