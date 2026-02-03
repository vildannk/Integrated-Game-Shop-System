<?php
require_once __DIR__ . '/_helpers.php';
require_once __DIR__ . '/../services/NotificationService.php';

Flight::route('GET /notifications', function () {
    require_roles([1]);
    $data = Flight::notificationService()->getAdminNotifications();
    json_response($data);
});

Flight::route('GET /notifications/me', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $data = Flight::notificationService()->getUserNotifications($userId);
    json_response($data);
});

Flight::route('PATCH /notifications/@id/read', function ($id) {
    require_auth();
    $user = Flight::get('user');
    $notification = Flight::notificationService()->getById($id);
    if (!$notification) {
        json_response(null, false, 404, 'Notification not found');
        return;
    }

    if ($user->is_admin == 1) {
        if ((int)$notification['IsAdmin'] !== 1) {
            json_response(null, false, 403, 'Forbidden');
            return;
        }
    } else {
        if ((int)$notification['UserID'] !== (int)$user->UserID) {
            json_response(null, false, 403, 'Forbidden');
            return;
        }
    }

    $payload = Flight::request()->data->getData();
    $statusLabel = $payload['StatusLabel'] ?? null;
    if ($statusLabel) {
        $result = Flight::notificationService()->markReadWithStatus($id, $statusLabel);
    } else {
        $result = Flight::notificationService()->markRead($id);
    }
    json_response(['updated' => $result], true, 200, 'Notification updated');
});

Flight::route('PATCH /notifications/@id/unread', function ($id) {
    require_auth();
    $user = Flight::get('user');
    $notification = Flight::notificationService()->getById($id);
    if (!$notification) {
        json_response(null, false, 404, 'Notification not found');
        return;
    }

    if ($user->is_admin == 1) {
        if ((int)$notification['IsAdmin'] !== 1) {
            json_response(null, false, 403, 'Forbidden');
            return;
        }
    } else {
        if ((int)$notification['UserID'] !== (int)$user->UserID) {
            json_response(null, false, 403, 'Forbidden');
            return;
        }
    }

    $result = Flight::notificationService()->markUnread($id);
    json_response(['updated' => $result], true, 200, 'Notification updated');
});
