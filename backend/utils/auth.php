<?php
/**
 * Authentication Utilities
 * 
 * This file contains helper functions for user authentication, session management,
 * and security features for the CAV-Zambia Airlines application.
 * 
 * Database: group2_cavair_db_setup
 * 
 * @author Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Authenticate a user with email and password
 * 
 * @param string $email User's email address
 * @param string $password User's password (plain text)
 * @param mysqli $conn Database connection
 * @return array|bool User data array on success, false on failure
 */
function authenticateUser($email, $password, $conn) {
    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT user_id, full_name, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Check if user exists
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Remove password from user array before returning
            unset($user['password']);
            return $user;
        }
    }
    
    // Authentication failed
    return false;
}

/**
 * Register a new user
 * 
 * @param string $full_name User's full name
 * @param string $email User's email address
 * @param string $password User's password (plain text)
 * @param string $phone User's phone number (optional)
 * @param mysqli $conn Database connection
 * @return int|bool User ID on success, false on failure
 */
function registerUser($full_name, $email, $password, $phone, $conn) {
    // Check if email already exists
    $check_stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Email already exists
        return false;
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user - using the schema from group2_cavair_db_setup.sql
    $insert_stmt = $conn->prepare("INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)");
    $insert_stmt->bind_param("ssss", $full_name, $email, $phone, $hashed_password);
    
    if ($insert_stmt->execute()) {
        return $conn->insert_id; // Return new user ID
    } else {
        return false;
    }
}

/**
 * Update user's last login timestamp
 * Note: This is a placeholder function as the current database schema doesn't have a last_login field
 * 
 * @param int $user_id User ID
 * @param mysqli $conn Database connection
 * @return bool Always returns true
 */
function updateLastLogin($user_id, $conn) {
    // The current group2_cavair_db_setup schema doesn't have a last_login field
    // This function is kept for compatibility
    return true;
}

/**
 * Create a user session after successful authentication
 * 
 * @param array $user User data array
 * @return void
 */
function createUserSession($user) {
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['logged_in'] = true;
    $_SESSION['last_activity'] = time();
}

/**
 * Check if user is logged in
 * 
 * @return bool True if logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

/**
 * Require user to be logged in, redirect to login page if not
 * 
 * @param string $redirect_url URL to redirect to if not logged in
 * @return void
 */
function requireLogin($redirect_url = '../frontend/login.html') {
    if (!isLoggedIn()) {
        header("Location: $redirect_url");
        exit();
    }
    
    // Check for session timeout
    checkSessionTimeout();
}

/**
 * Check for session timeout and logout if inactive for too long
 * 
 * @param int $timeout_minutes Minutes of inactivity before timeout
 * @return void
 */
function checkSessionTimeout($timeout_minutes = 30) {
    if (isset($_SESSION['last_activity'])) {
        $inactive_time = time() - $_SESSION['last_activity'];
        $timeout_seconds = $timeout_minutes * 60;
        
        if ($inactive_time >= $timeout_seconds) {
            // Session has timed out
            logout();
            header("Location: ../frontend/login.html?timeout=1");
            exit();
        }
    }
    
    // Update last activity time
    $_SESSION['last_activity'] = time();
}

/**
 * Log out current user
 * 
 * @return void
 */
function logout() {
    // Unset all session variables
    $_SESSION = array();
    
    // Delete the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destroy the session
    session_destroy();
}

/**
 * Generate a secure random token
 * 
 * @param int $length Length of the token
 * @return string Random token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Create password reset token and store in database
 * 
 * @param int $user_id User ID
 * @param mysqli $conn Database connection
 * @param int $expiry_hours Hours until token expires
 * @return string|bool Token on success, false on failure
 */
function createPasswordResetToken($user_id, $conn, $expiry_hours = 24) {
    // Generate token
    $token = generateToken();
    $expires_at = date('Y-m-d H:i:s', time() + ($expiry_hours * 3600));
    
    // Delete any existing tokens for this user
    $delete_stmt = $conn->prepare("DELETE FROM password_reset_tokens WHERE user_id = ?");
    $delete_stmt->bind_param("i", $user_id);
    $delete_stmt->execute();
    
    // Insert new token
    $stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $token, $expires_at);
    
    if ($stmt->execute()) {
        return $token;
    } else {
        return false;
    }
}

/**
 * Validate password reset token
 * 
 * @param string $token Token to validate
 * @param mysqli $conn Database connection
 * @return int|bool User ID on success, false on failure
 */
function validatePasswordResetToken($token, $conn) {
    $stmt = $conn->prepare("SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        return $row['user_id'];
    } else {
        return false;
    }
}

/**
 * Reset user password
 * 
 * @param int $user_id User ID
 * @param string $new_password New password (plain text)
 * @param mysqli $conn Database connection
 * @return bool True on success, false on failure
 */
function resetPassword($user_id, $new_password, $conn) {
    // Hash new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update password
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $stmt->bind_param("si", $hashed_password, $user_id);
    $result = $stmt->execute();
    
    if ($result) {
        // Delete used token
        $delete_stmt = $conn->prepare("DELETE FROM password_reset_tokens WHERE user_id = ?");
        $delete_stmt->bind_param("i", $user_id);
        $delete_stmt->execute();
    }
    
    return $result;
}

/**
 * Get user by ID
 * 
 * @param int $user_id User ID
 * @param mysqli $conn Database connection
 * @return array|bool User data array on success, false on failure
 */
function getUserById($user_id, $conn) {
    $stmt = $conn->prepare("SELECT user_id, full_name, email, phone, created_at FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        return $result->fetch_assoc();
    } else {
        return false;
    }
}

/**
 * Get user by email
 * 
 * @param string $email User email
 * @param mysqli $conn Database connection
 * @return array|bool User data array on success, false on failure
 */
function getUserByEmail($email, $conn) {
    $stmt = $conn->prepare("SELECT user_id, full_name, email, phone, created_at FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        return $result->fetch_assoc();
    } else {
        return false;
    }
}

/**
 * Update user profile
 * 
 * @param int $user_id User ID
 * @param array $data Data to update (keys: full_name, phone)
 * @param mysqli $conn Database connection
 * @return bool True on success, false on failure
 */
function updateUserProfile($user_id, $data, $conn) {
    $stmt = $conn->prepare("UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?");
    $stmt->bind_param("ssi", $data['full_name'], $data['phone'], $user_id);
    return $stmt->execute();
}

/**
 * Change user password
 * 
 * @param int $user_id User ID
 * @param string $current_password Current password (plain text)
 * @param string $new_password New password (plain text)
 * @param mysqli $conn Database connection
 * @return bool True on success, false on failure
 */
function changePassword($user_id, $current_password, $new_password, $conn) {
    // Get current password hash
    $stmt = $conn->prepare("SELECT password FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify current password
        if (password_verify($current_password, $user['password'])) {
            // Hash new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            
            // Update password
            $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
            $update_stmt->bind_param("si", $hashed_password, $user_id);
            return $update_stmt->execute();
        }
    }
    
    return false;
}

/**
 * Sanitize user input
 * 
 * @param string $input Input to sanitize
 * @return string Sanitized input
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email format
 * 
 * @param string $email Email to validate
 * @return bool True if valid, false otherwise
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Check password strength
 * 
 * @param string $password Password to check
 * @return bool True if strong enough, false otherwise
 */
function isStrongPassword($password) {
    // Password must be at least 8 characters long and contain at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    return (strlen($password) >= 8 &&
            preg_match('/[A-Z]/', $password) &&
            preg_match('/[a-z]/', $password) &&
            preg_match('/[0-9]/', $password) &&
            preg_match('/[^A-Za-z0-9]/', $password));
}

?>
