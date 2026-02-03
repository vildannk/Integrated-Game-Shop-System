<?php
require_once __DIR__ . '/../dao/NotificationDao.php';
require_once __DIR__ . '/../dao/ConsoleRentalDao.php';

$notificationDao = new NotificationDao();
$rentalDao = new ConsoleRentalDao();

$conn = $notificationDao->getConnection();
$stmt = $conn->prepare("SELECT * FROM notifications WHERE Type = 'rental' AND (ReferenceId IS NULL OR ReferenceId = 0)");
$stmt->execute();
$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$notifications) {
    echo "No rental notifications to backfill.\n";
    exit(0);
}

foreach ($notifications as $n) {
    $msg = $n['Message'] ?? '';
    $matches = [];
    if (!preg_match('/rental for (.+) \\((\\d{4}-\\d{2}-\\d{2}) to (\\d{4}-\\d{2}-\\d{2})\\)/', $msg, $matches)) {
        continue;
    }
    $consoleName = $matches[1];
    $start = $matches[2];
    $end = $matches[3];

    $rStmt = $conn->prepare("
        SELECT RentalID FROM console_rentals
        WHERE ConsoleName = :console
          AND StartDate = :start
          AND EndDate = :end
        ORDER BY CreatedAt DESC
        LIMIT 1
    ");
    $rStmt->bindValue(':console', $consoleName);
    $rStmt->bindValue(':start', $start);
    $rStmt->bindValue(':end', $end);
    $rStmt->execute();
    $rental = $rStmt->fetch(PDO::FETCH_ASSOC);
    if (!$rental || empty($rental['RentalID'])) {
        continue;
    }

    $uStmt = $conn->prepare("UPDATE notifications SET ReferenceType = 'console_rental', ReferenceId = :rid WHERE NotificationID = :nid");
    $uStmt->bindValue(':rid', (int)$rental['RentalID'], PDO::PARAM_INT);
    $uStmt->bindValue(':nid', (int)$n['NotificationID'], PDO::PARAM_INT);
    $uStmt->execute();
}

echo "Backfill completed.\n";
