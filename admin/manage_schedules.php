<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../backend/utils/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT schedule_id, flight_number, departure_date, departure_time, arrival_time FROM flight_schedules');
        $schedules = $stmt->fetchAll();
        echo json_encode(['success' => true, 'schedules' => $schedules]);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['flight_number'], $data['departure_date'], $data['departure_time'], $data['arrival_time'])) {
            echo json_encode(['success' => false, 'error' => 'Missing fields']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO flight_schedules (flight_number, departure_date, departure_time, arrival_time) VALUES (?, ?, ?, ?)');
        $stmt->execute([$data['flight_number'], $data['departure_date'], $data['departure_time'], $data['arrival_time']]);
        echo json_encode(['success' => true]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['schedule_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing schedule_id']);
            exit;
        }
        $fields = [];
        $params = [];
        foreach (['flight_number', 'departure_date', 'departure_time', 'arrival_time'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($fields)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }
        $params[] = $data['schedule_id'];
        $sql = 'UPDATE flight_schedules SET ' . implode(', ', $fields) . ' WHERE schedule_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['schedule_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing schedule_id']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM flight_schedules WHERE schedule_id = ?');
        $stmt->execute([$data['schedule_id']]);
        echo json_encode(['success' => true]);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Unsupported method']);
}
