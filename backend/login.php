<?php
/**
 * Login Page Handler
 * 
 * This script handles user login authentication by validating credentials
 * against the database and creating a session for authenticated users.
 * 
 * Database: group2_cavair_db
 * 
 * @author [Michael, David L.] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Include database connection and authentication utilities
require_once 'utils/db_connect.php';
require_once 'utils/auth.php';

// Initialize variables
$email = '';
$error_message = '';
$success = false;

// Check if user is already logged in
if (isLoggedIn()) {
    // User is already logged in, redirect to dashboard
    header('Location: user_dashboard.php');
    exit();
}

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data and sanitize inputs
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password']; // Password will be verified securely, no need to sanitize
    
    // Validate email format
    if (!isValidEmail($email)) {
        $error_message = 'Please enter a valid email address.';
    } else {
        // Authenticate user
        $user = authenticateUser($email, $password, $conn);
        
        if ($user) {
            // Authentication successful
            // Create user session
            createUserSession($user);
            
            // Set success flag
            $success = true;
            
            // Redirect to dashboard
            header('Location: user_dashboard.php');
            exit();
        } else {
            // Authentication failed
            $error_message = 'Invalid email or password. Please try again.';
        }
    }
}

// If not redirected (login failed), show the login form
if (!$success) {
    // Include login form HTML
    include '../frontend/login.html';
    
    // Display error message if any
    if (!empty($error_message)) {
        echo "<script>alert('$error_message');</script>";
    }
}

// Close database connection
$conn->close();
?>
