<?php
/**
 * Registration Page Handler
 * 
 * This script processes user registration by validating input data,
 * checking for existing users, and creating new user accounts in the database.
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
$full_name = '';
$email = '';
$phone = '';
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
    $full_name = sanitizeInput($_POST['full_name']);
    $email = sanitizeInput($_POST['email']);
    $phone = sanitizeInput($_POST['phone']); // Optional field
    $password = $_POST['password']; // Will be hashed, no need to sanitize
    
    // Validate inputs
    if (empty($full_name) || strlen($full_name) < 3) {
        $error_message = 'Please enter a valid full name (at least 3 characters).';
    } elseif (!isValidEmail($email)) {
        $error_message = 'Please enter a valid email address.';
    } elseif (empty($password) || !isStrongPassword($password)) {
        $error_message = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
    } else {
        // Register new user
        $user_id = registerUser($full_name, $email, $password, $phone, $conn);
        
        if ($user_id) {
            // Registration successful
            // Create user data array for session creation
            $user = [
                'user_id' => $user_id,
                'full_name' => $full_name,
                'email' => $email
            ];
            
            // Create session for the new user
            createUserSession($user);
            
            // Set success flag
            $success = true;
            
            // Redirect to dashboard
            header('Location: user_dashboard.php');
            exit();
        } else {
            // Registration failed - likely email already exists
            $error_message = 'This email address is already registered. Please use a different email or login.';
        }
    }
}

// If not redirected (registration failed), show the registration form
if (!$success) {
    // Include registration form HTML
    include '../frontend/register.html';
    
    // Display error message if any
    if (!empty($error_message)) {
        echo "<script>alert('$error_message');</script>";
    }
}

// Close database connection
$conn->close();
?>
