<?php
// Returns flight_number for a given origin and destination
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
$origin = isset($_GET['origin']) ? trim($_GET['origin']) : '';
$destination = isset($_GET['destination']) ? trim($_GET['destination']) : '';
if (!$origin || !$destination) {
    echo json_encode(['success' => false, 'error' => 'Missing origin or destination.']);
    exit;
}
$stmt = $conn->prepare("SELECT flight_number FROM flights WHERE origin = ? AND destination = ? LIMIT 1");
$stmt->bind_param('ss', $origin, $destination);
$stmt->execute();
$stmt->bind_result($flight_number);
if ($stmt->fetch()) {
    echo json_encode(['success' => true, 'flight_number' => $flight_number]);
} else {
    echo json_encode(['success' => false, 'error' => 'No flight found.']);
}
$stmt->close();
$conn->close();
