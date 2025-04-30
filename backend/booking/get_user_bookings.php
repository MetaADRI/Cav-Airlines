<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../utils/db_connect.php';
require_once __DIR__ . '/../utils/auth.php';
requireLogin();
error_log('Session user_id: ' . $_SESSION['user_id']);

$user_id = $_SESSION['user_id'];

// Get all bookings for the user
$sql = "SELECT b.*, f.origin, f.destination, fs.departure_date, fs.arrival_time, fs.departure_time
        FROM bookings b
        JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
        JOIN flights f ON b.flight_number = f.flight_number
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ensure isRoundTrip is present as boolean
        $row['isRoundTrip'] = (isset($row['is_round_trip']) && $row['is_round_trip']) ? true : false;
        // Ensure returnDate is present (null for one-way)
        $row['returnDate'] = isset($row['return_date']) && $row['return_date'] ? $row['return_date'] : null;
        $bookings[] = $row;
    }
    echo json_encode(['success' => true, 'bookings' => $bookings]);
} else {
    echo json_encode(['success' => false, 'error' => 'No bookings found.']);
}
$stmt->close();
$conn->close();
