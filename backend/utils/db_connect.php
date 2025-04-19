<?php
/**
 * Database Connection
 * 
 * This script establishes a connection to the MySQL database for the CAV-Zambia Airlines application.
 * It defines database credentials and creates a connection object that can be used by other scripts.
 * 
 * @author [David] Group 2 - COM322 Web Development Project
 * @version 1.0
 */

// Database configuration
$db_host = 'localhost';      // Database host
$db_name = 'group2_cavair_db'; // Database name
$db_user = 'root';          // Database username
$db_pass = '';              // Database password

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Set character set
$conn->set_charset("utf8mb4");

// Return the connection object (will be used by other scripts)
return $conn;
?>

