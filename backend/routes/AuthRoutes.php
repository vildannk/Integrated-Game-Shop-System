<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('POST /auth/register', function () {
    $data = Flight::request()->data->getData();
    $result = Flight::authService()->register($data);
    json_response($result, true, 201, 'User registered');
});

Flight::route('POST /auth/login', function () {
    $data = Flight::request()->data->getData();
    $response = Flight::authService()->login($data);
    if ($response['success']) {
        json_response($response['data'], true, 200, 'Login successful');
    } else {
        json_response(null, false, 401, $response['error'] ?? 'Login failed');
    }
});
