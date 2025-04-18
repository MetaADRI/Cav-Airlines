<?php
/**
 * Registration Page Handler
 * 
 * This script processes user registration by validating input data,
 * checking for existing users, and creating new user accounts in the database.
 * 
 * Database: group2_cavair_db
 * 
 * @author [Micheal, David L.] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Include database connection and authentication utilities
require_once 'utils/db_connect.php';
require_once 'utils/auth.php';

// Always return JSON for POST requests
header('Content-Type: application/json');
$response = ["success" => false, "message" => "Unknown error."];

// Initialize variables
$full_name = '';
$email = '';
$phone = '';
$error_message = '';
$success = false;

// If this is a GET request and the user is logged in, redirect to homepage
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && isLoggedIn()) {
    header('Location: ../frontend/index.php');
    exit();
}

// Handle registration POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data and sanitize inputs
    $full_name = isset($_POST['full_name']) ? sanitizeInput($_POST['full_name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // Validate inputs
    if (empty($full_name) || strlen($full_name) < 3) {
        $response["success"] = false;
        $response["message"] = 'Please enter a valid full name (at least 3 characters).';
    } elseif (!isValidEmail($email)) {
        $response["success"] = false;
        $response["message"] = 'Please enter a valid email address.';
    } elseif (empty($password) || !isStrongPassword($password)) {
        $response["success"] = false;
        $response["message"] = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
    } else {
        // Register new user
        $user_id = registerUser($full_name, $email, $password, $phone, $conn);
        if ($user_id) {
            // Registration successful
            $user = [
                'user_id' => $user_id,
                'full_name' => $full_name,
                'email' => $email
            ];
            createUserSession($user);
            $response["success"] = true;
            $response["message"] = 'Registration successful';
        } else {
            $response["success"] = false;
            $response["message"] = 'This email address is already registered. Please use a different email or login.';
        }
    }
    echo json_encode($response);
    exit();
}


// For GET requests, show the HTML registration form (not AJAX)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    include '../frontend/register.html';
    exit();
}

// Close database connection
$conn->close();
?>
