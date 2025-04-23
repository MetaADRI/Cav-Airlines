<?php
// upload.php

// Return JSON responses
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
require_once 'config/database.php';

// Start session to manage user authentication
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access. Please log in.']);
    exit;
}

// Define allowed file types and size limit
$allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
$maxFileSize      = 5 * 1024 * 1024; // 5MB

// Check if a file is uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];

    // Validate file upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'File upload error.']);
        exit;
    }

    if (!in_array($file['type'], $allowedFileTypes, true)) {
        http_response_code(415);
        echo json_encode(['error' => 'Invalid file type.']);
        exit;
    }

    if ($file['size'] > $maxFileSize) {
        http_response_code(413);
        echo json_encode(['error' => 'File size exceeds the limit of 5MB.']);
        exit;
    }

    // Generate a unique file name to avoid conflicts
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileName = uniqid() . '_' . basename($file['name']);
    $filePath = $uploadDir . $fileName;

    // Move the uploaded file to the target directory
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // Save file information to the database
        $userId    = $_SESSION['user_id'];
        $bookingId = $_POST['booking_id'] ?? null; // Ensure booking_id is passed

        if (!$bookingId) {
            http_response_code(400);
            echo json_encode(['error' => 'Booking ID is required.']);
            // Clean up the file if booking_id is missing
            unlink($filePath);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO uploads 
                (user_id, booking_id, file_name, file_path, uploaded_at)
            VALUES 
                (:user_id, :booking_id, :file_name, :file_path, NOW())
        ");
        $stmt->bindParam(':user_id',     $userId,    PDO::PARAM_INT);
        $stmt->bindParam(':booking_id',  $bookingId, PDO::PARAM_INT);
        $stmt->bindParam(':file_name',   $fileName,  PDO::PARAM_STR);
        $stmt->bindParam(':file_path',   $filePath,  PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode([
                'success'   => 'File uploaded successfully.',
                'file_name' => $fileName
            ]);
        } else {
            // Roll back file upload if database insertion fails
            unlink($filePath);
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save file information to the database.']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded.']);
}
