<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('POST /uploads/images', function () {
    require_roles([1]);

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        json_response(null, false, 400, 'Image file is required.');
        return;
    }

    $file = $_FILES['image'];
    $allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!in_array($file['type'], $allowed, true)) {
        json_response(null, false, 400, 'Only JPG, PNG, and WEBP files are allowed.');
        return;
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
    $finalName = $safeName . '-' . time() . '.' . $ext;

    $targetDir = __DIR__ . '/../public/images/uploads/';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    $targetPath = $targetDir . $finalName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        json_response(null, false, 500, 'Failed to save image.');
        return;
    }

    $url = 'backend/public/images/uploads/' . $finalName;
    json_response(['url' => $url], true, 201, 'Image uploaded');
});
