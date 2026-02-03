<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../config/Config.php';
require_once __DIR__ . '/../dao/ConsoleRentalDao.php';
require_once __DIR__ . '/NotificationService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class ConsoleRentalService extends BaseService {
    private $notificationService;
    private $userDao;

    public function __construct() {
        parent::__construct(new ConsoleRentalDao());
        $this->notificationService = new NotificationService();
        $this->userDao = new UserDao();
    }

    public function createRental($data) {
        $required = ['UserID', 'ConsoleName', 'Plan', 'StartDate', 'EndDate', 'DailyRate', 'DeliveryOption'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                throw new Exception("Field {$field} is required.");
            }
        }

        $start = new DateTime($data['StartDate']);
        $end = new DateTime($data['EndDate']);
        if ($end < $start) {
            throw new Exception("End date cannot be before start date.");
        }

        $days = max(1, (int)$start->diff($end)->format('%a') + 1);
        $dailyRate = (float)$data['DailyRate'];
        $total = round($days * $dailyRate, 2);

        $payload = [
            'UserID' => (int)$data['UserID'],
            'ConsoleName' => $data['ConsoleName'],
            'Plan' => $data['Plan'],
            'StartDate' => $start->format('Y-m-d'),
            'EndDate' => $end->format('Y-m-d'),
            'RentalDays' => $days,
            'DailyRate' => $dailyRate,
            'TotalPrice' => $total,
            'DeliveryOption' => $data['DeliveryOption'],
            'Notes' => $data['Notes'] ?? null,
            'Status' => $data['Status'] ?? 'pending'
        ];

        $rentalId = $this->dao->createRental($payload);
        $user = $this->userDao->getById((int)$payload['UserID']);
        $userName = $user && isset($user['Name']) ? $user['Name'] : "User #{$payload['UserID']}";
        $this->notificationService->addAdminNotification(
            'New console rental submitted',
            "{$userName} submitted a rental for {$payload['ConsoleName']} ({$payload['StartDate']} to {$payload['EndDate']}).",
            'rental',
            'console_rental',
            $rentalId
        );
        return [
            'success' => true,
            'rentalId' => $rentalId,
            'data' => $payload
        ];
    }

    public function getRentalsByUser($userId) {
        return $this->dao->getByUserId($userId);
    }


    private function sendStatusEmail($rental) {
        if (!$rental || empty($rental['Email'])) {
            return;
        }

        $to = $rental['Email'];
        $from = Config::EMAIL_FROM();
        $subject = 'Console Rental Status Update';
        $name = $rental['UserName'] ?? 'Customer';
        $console = $rental['ConsoleName'] ?? 'Console';
        $status = strtoupper($rental['Status'] ?? 'PENDING');

        $message = "Hello {$name},

" .
            "Your rental status has been updated.
" .
            "Console: {$console}
" .
            "Status: {$status}
" .
            "Dates: {$rental['StartDate']} to {$rental['EndDate']}
" .
            "Total: {$rental['TotalPrice']} BAM

" .
            "Thank you,
Game & Gear";

        $headers = "From: {$from}

" .
                   "Reply-To: {$from}

" .
                   "X-Mailer: PHP/" . phpversion();

        $sent = false;
        if (function_exists('mail')) {
            $sent = @mail($to, $subject, $message, $headers);
        }

        if (!$sent) {
            $logDir = __DIR__ . '/../logs';
            if (!is_dir($logDir)) {
                @mkdir($logDir, 0755, true);
            }
            $logLine = date('Y-m-d H:i:s') . " | Email to {$to} | Status {$status} | Console {$console}
";
            @file_put_contents($logDir . '/rental_status_emails.log', $logLine, FILE_APPEND);
        }
    }

    public function updateRentalStatus($rentalId, $status) {
        $normalized = strtolower(trim((string)$status));
        if ($normalized === 'declined' || $normalized === 'canceled') {
            $normalized = 'cancelled';
        } elseif ($normalized === 'accepted') {
            $normalized = 'confirmed';
        }
        $allowed = ['pending', 'confirmed', 'cancelled'];
        if (!in_array($normalized, $allowed, true)) {
            throw new Exception("Invalid status value");
        }
        $status = $normalized;
        $this->dao->updateStatus($rentalId, $status);
        $rental = $this->dao->getRentalWithUser($rentalId);
        if ($rental) {
            $rental['Status'] = $status;
            $this->sendStatusEmail($rental);
            $title = 'Rental status update';
            $statusLabel = $status === 'confirmed' ? 'accepted' : ($status === 'cancelled' ? 'declined' : $status);
            $message = "Your rental for {$rental['ConsoleName']} was {$statusLabel}.";
            $this->notificationService->addUserNotification(
                $rental['UserID'],
                $title,
                $message,
                'rental_status',
                'console_rental',
                $rentalId,
                ucfirst($statusLabel)
            );
        } else {
            $fallback = $this->dao->getById($rentalId);
            if ($fallback) {
                $title = 'Rental status update';
                $statusLabel = $status === 'confirmed' ? 'accepted' : ($status === 'cancelled' ? 'declined' : $status);
                $consoleName = $fallback['ConsoleName'] ?? 'console';
                $message = "Your rental for {$consoleName} was {$statusLabel}.";
                $this->notificationService->addUserNotification(
                    $fallback['UserID'],
                    $title,
                    $message,
                    'rental_status',
                    'console_rental',
                    $rentalId,
                    ucfirst($statusLabel)
                );
            }
        }
        return ['success' => true, 'rentalId' => $rentalId, 'status' => $status];
    }
}

