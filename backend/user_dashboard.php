<?php
// Load database configuration and connection
require_once 'utils/config.php';
require_once 'utils/db_connect.php';

// Start the session to access session variables
session_start();

// Check if the user is logged in, otherwise redirect to login page
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

try {
    // Fetch the logged-in user's profile data from the database
    $stmt = $conn->prepare("SELECT full_name, email, phone, created_at FROM users WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch as associative array

    // If no user is found (e.g., deleted), terminate the script with a message
    if (!$user) {
        die("User not found.");
    }
} catch (PDOException $e) {
    // Handle errors related to user data fetching
    die("Error fetching user: " . $e->getMessage());
}

try {
    // Prepare SQL to fetch booking and flight details for the logged-in user
    $stmt = $conn->prepare("
    SELECT 
        b.booking_id, 
        f.flight_number, 
        f.origin,              // Departure city
        f.destination,         // Arrival city
        f.aircraft_type,       // Type of aircraft used
        fs.departure_time,     // Scheduled departure time
        fs.arrival_time,       // Scheduled arrival time
        b.amount,              // Total cost for this booking
        b.num_passengers       // Number of passengers in this booking
    FROM bookings b
    JOIN flight_schedules fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    WHERE b.user_id = ?
");
    $stmt->execute([$_SESSION['user_id']]); // Execute query with the current user ID
    $bookings = $stmt->fetchAll(); // Fetch all bookings into an array
} catch (PDOException $e) {
    // Handle errors during bookings fetching
    die("Error fetching bookings: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Page setup -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CAVAIR</title>

    <!-- Bootstrap CSS for styling -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styling -->
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f8f9fa;
        }
        .dashboard-header {
            background: linear-gradient(135deg, #8e2de2, #4a00e0);
            color: white;
            padding: 20px;
            margin-bottom: 30px;
        }
        .profile-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .booking-card {
            border-left: 4px solid #8e2de2;
            transition: transform 0.2s;
        }
        .booking-card:hover {
            transform: translateY(-3px);
        }
        .status-pending { color: #ffc107; }
        .status-confirmed { color: #28a745; }
        .status-cancelled { color: #dc3545; }
    </style>
</head>
<body>

    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <!-- Display user name -->
                <h1>Welcome, <?= htmlspecialchars($user['full_name']) ?></h1>
                <a href="logout.php" class="btn btn-light">Logout</a>
            </div>
        </div>
    </div>

    <!-- Main content area -->
    <div class="container">
        <div class="row">
            <!-- Profile Info Card -->
            <div class="col-md-4">
                <div class="profile-card">
                    <h3>Your Profile</h3>
                    <p><strong>Email:</strong> <?= htmlspecialchars($user['email']) ?></p>
                    <p><strong>Phone:</strong> <?= htmlspecialchars($user['phone'] ?? 'Not provided') ?></p>
                    <p><strong>Member since:</strong> <?= date('M Y', strtotime($user['created_at'])) ?></p>
                </div>
            </div>

            <!-- Booking Info Area -->
            <div class="col-md-8">
                <h2>Your Bookings</h2>

                <?php if (count($bookings) > 0): ?>
                    <!-- Loop through bookings and show each one -->
                    <div class="list-group">
                        <?php foreach ($bookings as $booking): ?>
                            <div class="list-group-item booking-card mb-3">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <!-- Show basic route info -->
                                        <h5><?= htmlspecialchars($booking['origin']) ?> to <?= htmlspecialchars($booking['destination']) ?></h5>
                                        <p class="mb-1">
                                            <strong>Flight:</strong> <?= htmlspecialchars($booking['flight_number']) ?> | 
                                            <!-- Error warning: departure_date is not selected in query -->
                                            <strong>Date:</strong> <?= date('M d, Y', strtotime($booking['departure_date'])) ?>
                                        </p>
                                        <p class="mb-1">
                                            <strong>Time:</strong> <?= date('h:i A', strtotime($booking['departure_time'])) ?> - <?= date('h:i A', strtotime($booking['arrival_time'])) ?>
                                        </p>
                                    </div>
                                    <div>
                                        <!-- Show status with dynamic styling - booking_status not selected either -->
                                        <span class="badge bg-<?= $booking['booking_status'] == 'Confirmed' ? 'success' : ($booking['booking_status'] == 'Pending' ? 'warning' : 'danger') ?>">
                                            <?= $booking['booking_status'] ?>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <!-- If no bookings exist -->
                    <div class="alert alert-info">You have no bookings yet.</div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
