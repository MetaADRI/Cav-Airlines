<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../backend/utils/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT booking_id, user_id, schedule_id, seat_number, status FROM bookings');
        $bookings = $stmt->fetchAll();
        echo json_encode(['success' => true, 'bookings' => $bookings]);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['user_id'], $data['schedule_id'], $data['seat_number'], $data['status'])) {
            echo json_encode(['success' => false, 'error' => 'Missing fields']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO bookings (user_id, schedule_id, seat_number, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([$data['user_id'], $data['schedule_id'], $data['seat_number'], $data['status']]);
        echo json_encode(['success' => true]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['booking_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing booking_id']);
            exit;
        }
        $fields = [];
        $params = [];
        foreach (['user_id', 'schedule_id', 'seat_number', 'status'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($fields)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }
        $params[] = $data['booking_id'];
        $sql = 'UPDATE bookings SET ' . implode(', ', $fields) . ' WHERE booking_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['booking_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing booking_id']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM bookings WHERE booking_id = ?');
        $stmt->execute([$data['booking_id']]);
        echo json_encode(['success' => true]);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Unsupported method']);
}
