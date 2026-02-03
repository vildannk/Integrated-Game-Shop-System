<?php
require_once 'BaseDao.php';

class NotificationDao extends BaseDao {
    public function __construct() {
        parent::__construct('notifications');
    }

    protected function getPrimaryKey() {
        return 'NotificationID';
    }

    public function getAdminNotifications($limit = 50) {
        $stmt = $this->connection->prepare("SELECT * FROM notifications WHERE IsAdmin = 1 ORDER BY CreatedAt DESC LIMIT :lim");
        $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserNotifications($userId, $limit = 50) {
        $stmt = $this->connection->prepare("SELECT * FROM notifications WHERE IsAdmin = 0 AND UserID = :userId ORDER BY CreatedAt DESC LIMIT :lim");
        $stmt->bindValue(':userId', (int)$userId, PDO::PARAM_INT);
        $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function markRead($id) {
        $stmt = $this->connection->prepare("UPDATE notifications SET IsRead = 1 WHERE NotificationID = :id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function markReadWithStatus($id, $statusLabel) {
        $stmt = $this->connection->prepare("UPDATE notifications SET IsRead = 1, StatusLabel = :statusLabel WHERE NotificationID = :id");
        $stmt->bindValue(':statusLabel', $statusLabel);
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function markUnread($id) {
        $stmt = $this->connection->prepare("UPDATE notifications SET IsRead = 0 WHERE NotificationID = :id");
        $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
