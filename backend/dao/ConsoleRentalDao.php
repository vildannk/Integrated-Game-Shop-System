<?php
require_once 'BaseDao.php';

class ConsoleRentalDao extends BaseDao {
    public function __construct() {
        parent::__construct('console_rentals');
    }

    protected function getPrimaryKey() {
        return 'RentalID';
    }

    public function getByUserId($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM console_rentals WHERE UserID = :userId ORDER BY CreatedAt DESC");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createRental($payload) {
        $columns = implode(", ", array_keys($payload));
        $placeholders = ":" . implode(", :", array_keys($payload));
        $sql = "INSERT INTO console_rentals ($columns) VALUES ($placeholders)";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($payload);
        return $this->connection->lastInsertId();
    }


    public function getRentalWithUser($rentalId) {
        $stmt = $this->connection->prepare(
            "SELECT r.*, u.Email, u.Name AS UserName FROM console_rentals r JOIN users u ON r.UserID = u.UserID WHERE r.RentalID = :rentalId"
        );
        $stmt->bindParam(':rentalId', $rentalId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateStatus($rentalId, $status) {
        $stmt = $this->connection->prepare("UPDATE console_rentals SET Status = :status WHERE RentalID = :rentalId");
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':rentalId', $rentalId);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}

