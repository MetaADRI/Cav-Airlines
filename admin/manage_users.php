<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../backend/utils/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all users
        $stmt = $pdo->query('SELECT user_id, name, email, phone, role FROM users');
        $users = $stmt->fetchAll();
        echo json_encode(['success' => true, 'users' => $users]);
        break;
    case 'POST':
        // Add new user
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['name'], $data['email'], $data['phone'], $data['role'])) {
            echo json_encode(['success' => false, 'error' => 'Missing fields']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['role']]);
        echo json_encode(['success' => true]);
        break;
    case 'PUT':
        // Update user
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing user_id']);
            exit;
        }
        $fields = [];
        $params = [];
        foreach (['name', 'email', 'phone', 'role'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($fields)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }
        $params[] = $data['user_id'];
        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        // Delete user
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Missing user_id']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM users WHERE user_id = ?');
        $stmt->execute([$data['user_id']]);
        echo json_encode(['success' => true]);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Unsupported method']);
}
