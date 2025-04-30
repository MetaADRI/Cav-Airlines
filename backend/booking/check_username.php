<?php
// Endpoint to check if username exists (for AJAX validation)
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
$username = isset($_GET['username']) ? trim($_GET['username']) : '';
if (!$username) {
    echo json_encode(['exists' => false, 'error' => 'No username provided.']);
    exit;
}
$stmt = $conn->prepare('SELECT COUNT(*) FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();
$conn->close();
echo json_encode(['exists' => ($count > 0)]);
