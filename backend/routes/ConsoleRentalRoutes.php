<?php
/**
 * Routes for console rental flow
 */
Flight::group('/console-rentals', function () {
    Flight::set('console_rental_service', new ConsoleRentalService());

    /**
     * Create rental request
     */
    Flight::route('POST /', function () {
        Flight::auth_middleware()->authorizeRoles([1, 2]);
        $data = Flight::request()->data->getData();
        if (empty($data['UserID'])) {
            $data['UserID'] = Flight::auth_middleware()->getUserId();
        }
        Flight::json(Flight::consoleRentalService()->createRental($data), 201);
    });

    /**
     * List rentals for current authenticated user
     */
    Flight::route('GET /my', function () {
        Flight::auth_middleware()->authorizeRoles([1, 2]);
        $userId = Flight::auth_middleware()->getUserId();
        Flight::json(Flight::consoleRentalService()->getRentalsByUser($userId));
    });

    /**
     * Admin: list all rentals
     */
    Flight::route('GET /', function () {
        Flight::auth_middleware()->authorizeRoles([1, 2]);
        Flight::json(Flight::consoleRentalService()->getAll());
    });

    /**
     * Update rental status
     */
    Flight::route('PUT /@id/status', function ($id) {
        Flight::auth_middleware()->authorizeRoles([1, 2]);
        $data = Flight::request()->data->getData();
        $status = $data['Status'] ?? null;
        Flight::json(Flight::consoleRentalService()->updateRentalStatus($id, $status));
    });
});
?>
