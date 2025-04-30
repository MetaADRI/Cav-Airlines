<?php
// Returns schedule_id for a given flight_number and departure_date
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
$flight_number = isset($_GET['flight_number']) ? trim($_GET['flight_number']) : '';
$departure_date = isset($_GET['departure_date']) ? trim($_GET['departure_date']) : '';
if (!$flight_number || !$departure_date) {
    echo json_encode(['success' => false, 'error' => 'Missing flight_number or departure_date.']);
    exit;
}
$stmt = $conn->prepare("SELECT fs.schedule_id FROM flight_schedules fs JOIN flights f ON fs.flight_id = f.flight_id WHERE f.flight_number = ? AND fs.departure_date = ? LIMIT 1");
$stmt->bind_param('ss', $flight_number, $departure_date);
$stmt->execute();
$stmt->bind_result($schedule_id);
if ($stmt->fetch()) {
    echo json_encode(['success' => true, 'schedule_id' => $schedule_id]);
} else {
    echo json_encode(['success' => false, 'error' => 'No schedule found.']);
}
$stmt->close();
$conn->close();
