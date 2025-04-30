<?php
// update_profile.php - Handles AJAX profile updates from the frontend
require_once '../utils/db_connect.php';
require_once '../utils/auth.php';

header('Content-Type: application/json');


// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated. Please log in again.']);
    exit();
}

$user_id = $_SESSION['user_id'];
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';

// Validate email
if (!isValidEmail($email)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit();
}

// Validate phone (must be digits, allow + at start)
if ($phone && !preg_match('/^\+?\d+$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number.']);
    exit();
}

// Update user profile
$updateData = [
    'email' => $email,
    'phone' => $phone
];
if (updateUserProfile($user_id, $updateData, $conn)) {
    // Optionally update session
    $_SESSION['email'] = $email;
    $_SESSION['phone'] = $phone;
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully.', 'email' => $email, 'phone' => $phone]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile.']);
}
$conn->close();
