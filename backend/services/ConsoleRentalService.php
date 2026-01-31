<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ConsoleRentalDao.php';

class ConsoleRentalService extends BaseService {
    public function __construct() {
        parent::__construct(new ConsoleRentalDao());
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
        return [
            'success' => true,
            'rentalId' => $rentalId,
            'data' => $payload
        ];
    }

    public function getRentalsByUser($userId) {
        return $this->dao->getByUserId($userId);
    }

    public function updateRentalStatus($rentalId, $status) {
        $allowed = ['pending', 'confirmed', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            throw new Exception("Invalid status value");
        }
        $this->dao->updateStatus($rentalId, $status);
        return ['success' => true, 'rentalId' => $rentalId, 'status' => $status];
    }
}
?>
