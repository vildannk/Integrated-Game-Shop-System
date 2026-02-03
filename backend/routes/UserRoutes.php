<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /users/me', function () {
    require_auth();
    $user = Flight::get('user');
    json_response($user);
});
