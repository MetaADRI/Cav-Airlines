<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
require_once __DIR__ . '/../utils/auth.php';
requireLogin();

$booking_ref = isset($_POST['booking_ref']) ? trim($_POST['booking_ref']) : '';
$name = isset($_POST['name']) ? trim($_POST['name']) : '';

if (!$booking_ref || !$name) {
    echo json_encode(['success' => false, 'error' => 'Missing booking reference or name.']);
    exit;
}

$sql = "SELECT b.*, f.origin, f.destination, fs.departure_date, fs.arrival_time, fs.departure_time
        FROM bookings b
        JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
        JOIN flights f ON b.flight_number = f.flight_number
        WHERE b.booking_id = ? AND LOWER(b.name) = LOWER(?)
        LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param('is', $booking_ref, $name);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $row['isRoundTrip'] = (isset($row['is_round_trip']) && $row['is_round_trip']) ? true : false;
    $row['returnDate'] = isset($row['return_date']) && $row['return_date'] ? $row['return_date'] : null;
    echo json_encode(['success' => true, 'booking' => $row]);
} else {
    echo json_encode(['success' => false, 'error' => 'No booking found.']);
}
$stmt->close();
$conn->close();
