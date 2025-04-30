<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../backend/utils/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT flight_number, origin, destination, type, price FROM flights');
        $flights = $stmt->fetchAll();
        echo json_encode(['success' => true, 'flights' => $flights]);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['flight_number'], $data['origin'], $data['destination'], $data['type'], $data['price'])) {
            echo json_encode(['success' => false, 'error' => 'Missing fields']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO flights (flight_number, origin, destination, type, price) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$data['flight_number'], $data['origin'], $data['destination'], $data['type'], $data['price']]);
        echo json_encode(['success' => true]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['flight_number'])) {
            echo json_encode(['success' => false, 'error' => 'Missing flight_number']);
            exit;
        }
        $fields = [];
        $params = [];
        foreach (['origin', 'destination', 'type', 'price'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($fields)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }
        $params[] = $data['flight_number'];
        $sql = 'UPDATE flights SET ' . implode(', ', $fields) . ' WHERE flight_number = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['flight_number'])) {
            echo json_encode(['success' => false, 'error' => 'Missing flight_number']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM flights WHERE flight_number = ?');
        $stmt->execute([$data['flight_number']]);
        echo json_encode(['success' => true]);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Unsupported method']);
}
