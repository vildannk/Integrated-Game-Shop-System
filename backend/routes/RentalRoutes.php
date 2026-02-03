<?php
require_once __DIR__ . '/_helpers.php';

Flight::route('GET /rentals/catalog', function () {
    $data = Flight::consoleCatalogService()->getActiveCatalog();
    json_response($data);
});

Flight::route('GET /rentals', function () {
    require_roles([1]);
    $data = Flight::consoleRentalService()->getAll();
    json_response($data);
});

Flight::route('GET /rentals/me', function () {
    require_auth();
    $userId = Flight::auth_middleware()->getUserId();
    $data = Flight::consoleRentalService()->getRentalsByUser($userId);
    json_response($data);
});

Flight::route('POST /rentals', function () {
    require_auth();
    $data = Flight::request()->data->getData();
    $data['UserID'] = Flight::auth_middleware()->getUserId();
    $result = Flight::consoleRentalService()->createRental($data);
    json_response($result, true, 201, 'Rental created');
});

Flight::route('PATCH /rentals/@id', function ($id) {
    require_roles([1]);
    $data = Flight::request()->data->getData();
    $status = $data['Status'] ?? null;
    $result = Flight::consoleRentalService()->updateRentalStatus($id, $status);
    json_response($result, true, 200, 'Rental updated');
});

