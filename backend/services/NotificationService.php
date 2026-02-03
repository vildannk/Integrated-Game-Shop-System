<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/NotificationDao.php';

class NotificationService extends BaseService {
    public function __construct() {
        parent::__construct(new NotificationDao());
    }

    public function addAdminNotification($title, $message, $type = 'admin', $refType = null, $refId = null) {
        return $this->dao->insert([
            'UserID' => null,
            'IsAdmin' => 1,
            'Type' => $type,
            'Title' => $title,
            'Message' => $message,
            'ReferenceType' => $refType,
            'ReferenceId' => $refId,
            'IsRead' => 0
        ]);
    }

    public function addUserNotification($userId, $title, $message, $type = 'user', $refType = null, $refId = null, $statusLabel = null) {
        return $this->dao->insert([
            'UserID' => (int)$userId,
            'IsAdmin' => 0,
            'Type' => $type,
            'Title' => $title,
            'Message' => $message,
            'ReferenceType' => $refType,
            'ReferenceId' => $refId,
            'StatusLabel' => $statusLabel,
            'IsRead' => 0
        ]);
    }

    public function getAdminNotifications($limit = 50) {
        return $this->dao->getAdminNotifications($limit);
    }

    public function getUserNotifications($userId, $limit = 50) {
        return $this->dao->getUserNotifications($userId, $limit);
    }

    public function markRead($id) {
        return $this->dao->markRead($id);
    }

    public function markReadWithStatus($id, $statusLabel) {
        return $this->dao->markReadWithStatus($id, $statusLabel);
    }

    public function markUnread($id) {
        return $this->dao->markUnread($id);
    }
}
