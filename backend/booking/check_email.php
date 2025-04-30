<?php
// Endpoint to check if email exists (for AJAX validation)
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
$email = isset($_GET['email']) ? trim($_GET['email']) : '';
if (!$email) {
    echo json_encode(['exists' => false, 'error' => 'No email provided.']);
    exit;
}
$stmt = $conn->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();
$conn->close();
echo json_encode(['exists' => ($count > 0)]);
