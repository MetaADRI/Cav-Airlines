<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../utils/db_connect.php';
require_once __DIR__ . '/../utils/auth.php';
requireLogin();

$response = array('success' => false);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize input
    $user_id = $_SESSION['user_id'];
    $schedule_id = isset($_POST['schedule_id']) ? intval($_POST['schedule_id']) : 0;
    $flight_number = isset($_POST['flight_number']) ? trim($_POST['flight_number']) : '';
    $service_type = isset($_POST['service_type']) ? trim($_POST['service_type']) : '';
    $class_type = isset($_POST['class_type']) ? trim($_POST['class_type']) : '';
    $num_passengers = isset($_POST['num_passengers']) ? intval($_POST['num_passengers']) : 1;
    $amount = isset($_POST['amount']) ? floatval($_POST['amount']) : 0;
    $id_type = isset($_POST['id_type']) ? trim($_POST['id_type']) : '';
    $booking_status = 'Pending';

    // Accept is_round_trip and return_date from POST
    $is_round_trip = isset($_POST['is_round_trip']) ? intval($_POST['is_round_trip']) : 0;
    $return_date = isset($_POST['return_date']) && $_POST['return_date'] !== '' ? $_POST['return_date'] : null;

    // Validate required fields
    if (!$user_id || !$schedule_id || !$flight_number || !$service_type || !$class_type || !$num_passengers || !$amount || !$id_type) {
        $response['error'] = 'Missing required fields.';
        echo json_encode($response); exit;
    }
    // For round trip, return_date is required
    if ($is_round_trip && !$return_date) {
        $response['error'] = 'Return date is required for round trip bookings.';
        echo json_encode($response); exit;
    } 

    // Handle file upload with validation
    $id_file_path = '';
    if (isset($_FILES['id_passport_upload']) && $_FILES['id_passport_upload']['error'] === UPLOAD_ERR_OK) {
        $allowed_exts = ['jpg', 'jpeg', 'png', 'pdf'];
        $max_size = 5 * 1024 * 1024; // 5 MB
        $ext = strtolower(pathinfo($_FILES['id_passport_upload']['name'], PATHINFO_EXTENSION));
        $file_size = $_FILES['id_passport_upload']['size'];
        if (!in_array($ext, $allowed_exts)) {
            $response['error'] = 'Invalid file type. Only JPG, PNG, and PDF are allowed.';
            echo json_encode($response); exit;
        }
        if ($file_size > $max_size) {
            $response['error'] = 'File is too large. Maximum size is 5 MB.';
            echo json_encode($response); exit;
        }
        // Save uploads to the uploads folder in the backend directory
        $upload_dir = realpath(__DIR__ . '/../uploads');
        if ($upload_dir === false) {
            $upload_dir = __DIR__ . '/../uploads/';
            if (!is_dir($upload_dir)) { mkdir($upload_dir, 0775, true); }
        }
        $filename = uniqid('id_', true) . '.' . $ext;
        $dest = rtrim($upload_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
        if (move_uploaded_file($_FILES['id_passport_upload']['tmp_name'], $dest)) {
            $id_file_path = 'uploads/' . $filename;
        } else {
            $response['error'] = 'Failed to upload file.';
            echo json_encode($response); exit;
        }
    } else {
        $response['error'] = 'ID/Passport file is required.';
        echo json_encode($response); exit;
    }

    // Fetch user's name from users table
    $user_name = '';
    $user_query = $conn->prepare("SELECT full_name FROM users WHERE user_id = ?");
    $user_query->bind_param('i', $user_id);
    $user_query->execute();
    $user_result = $user_query->get_result();
    if ($user_result && $user_result->num_rows > 0) {
        $user_row = $user_result->fetch_assoc();
        $user_name = $user_row['full_name'];
    }
    $user_query->close();

    // Insert booking with user's name
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, name, schedule_id, flight_number, service_type, class_type, num_passengers, amount, id_type, id_file_path, booking_status, is_round_trip, return_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param(
            'isisssidsssis',
            $user_id,          // int
            $user_name,        // string
            $schedule_id,      // int
            $flight_number,    // string
            $service_type,     // string
            $class_type,       // string
            $num_passengers,   // int
            $amount,           // double
            $id_type,          // string
            $id_file_path,     // string
            $booking_status,   // string
            $is_round_trip,    // int
            $return_date       // string|null
        );
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['booking_id'] = $stmt->insert_id;
        } else {
            $response['error'] = 'Database error: ' . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['error'] = 'Database prepare failed: ' . $conn->error;
    }
} else {
    $response['error'] = 'Invalid request method.';
}

echo json_encode($response);
