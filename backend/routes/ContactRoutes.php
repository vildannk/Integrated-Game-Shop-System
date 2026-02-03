<?php
require_once __DIR__ . '/_helpers.php';
require_once __DIR__ . '/../services/NotificationService.php';

Flight::route('POST /contact/messages', function () {
    $data = Flight::request()->data->getData();
    $name = trim(strip_tags($data['name'] ?? ''));
    $email = trim(strip_tags($data['email'] ?? ''));
    $subject = trim(strip_tags($data['subject'] ?? ''));
    $message = trim(strip_tags($data['message'] ?? ''));

    if ($name === '' || $email === '' || $subject === '' || $message === '') {
        json_response(null, false, 400, 'All fields are required.');
        return;
    }

    $fullMessage = "Name: {$name}\nEmail: {$email}\nSubject: {$subject}\nMessage: {$message}";
    Flight::notificationService()->addAdminNotification(
        'New contact message',
        $fullMessage,
        'contact'
    );

    json_response(['sent' => true], true, 201, 'Message sent');
});
