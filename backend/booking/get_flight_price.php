<?php
// Returns price for a given flight_number
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
$flight_number = isset($_GET['flight_number']) ? trim($_GET['flight_number']) : '';
if (!$flight_number) {
    echo json_encode(['success' => false, 'error' => 'Missing flight_number.']);
    exit;
}
$stmt = $conn->prepare("SELECT price FROM flights WHERE flight_number = ? LIMIT 1");
$stmt->bind_param('s', $flight_number);
$stmt->execute();
$stmt->bind_result($price);
if ($stmt->fetch()) {
    echo json_encode(['success' => true, 'price' => floatval($price)]);
} else {
    echo json_encode(['success' => false, 'error' => 'No flight found.']);
}
$stmt->close();
$conn->close();
