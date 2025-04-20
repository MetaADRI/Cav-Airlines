<?php
/**
 * Login Page Handler
 * 
 * This script handles user login authentication by validating credentials
 * against the database and creating a session for authenticated users.
 * 
 * Database: group2_cavair_db
 * 
 * @author [David L.] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Include database connection and authentication utilities
require_once 'utils/db_connect.php';
require_once 'utils/auth.php';

// Initialize variables
$email = '';
$error_message = '';
$success = false;

// If user is already logged in and this is not a POST (AJAX), redirect to dashboard
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && isLoggedIn()) {
    header('Location: frontend/user_dashboard.html');
    exit();
}

// Handle login POST (AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    // Get form data and sanitize inputs
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password']; // Password will be verified securely, no need to sanitize
    
    // Validate email format
    if (!isValidEmail($email)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ]);
        exit();
    }
    // Authenticate user
    $user = authenticateUser($email, $password, $conn);
    if ($user) {
        // Authentication successful
        createUserSession($user);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful.'
        ]);
        exit();
    } else {
        // Authentication failed
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password.'
        ]);
        exit();
    }
}

// Close database connection
$conn->close();
?>
