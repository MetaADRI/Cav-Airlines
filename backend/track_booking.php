<?php
require_once(__DIR__ . '/utils/config.php');
require_once 'utils/db_connect.php';
require_once 'utils/auth.php';


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get available flights
try {
    $stmt = $conn->prepare("
        SELECT fs.schedule_id, f.origin, f.destination, f.type, fs.frequency, fs.departure_time, fs.arrival_time
        FROM flight_schedules fs
        JOIN flights f ON fs.flight_id = f.flight_id
        ORDER BY f.origin, f.destination, fs.departure_time
    ");
    $stmt->execute();
    $schedules = $stmt->fetchAll();
} catch(PDOException $e) {
    $error = "Error: " . $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $schedule_id = $_POST['schedule_id'];
    $num_passengers = $_POST['num_passengers'];
    $id_type = $_POST['id_type'];
    
    // Handle file upload
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["id_file"]["name"]);
    $uploadOk = 1;
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    
    // Check if file is a PDF or image
    if($fileType != "pdf" && $fileType != "jpg" && $fileType != "png" && $fileType != "jpeg") {
        $error = "Sorry, only PDF, JPG, JPEG, PNG files are allowed.";
        $uploadOk = 0;
    }
    
    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        $error = "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["id_file"]["tmp_name"], $target_file)) {
            // Get flight details to calculate amount
            try {
                $stmt = $conn->prepare("
                    SELECT f.type 
                    FROM flight_schedules fs
                    JOIN flights f ON fs.flight_id = f.flight_id
                    WHERE fs.schedule_id = ?
                ");
                $stmt->execute([$schedule_id]);
                $flight = $stmt->fetch();
                
                // Calculate amount (simple pricing logic)
                $base_price = ($flight['type'] == 'International') ? 300 : 150;
                $amount = $base_price * $num_passengers;
                
                // Create booking
                $stmt = $conn->prepare("
                    INSERT INTO bookings (user_id, schedule_id, service_type, num_passengers, amount, id_type, id_file_path)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $_SESSION['user_id'],
                    $schedule_id,
                    $flight['type'],
                    $num_passengers,
                    $amount,
                    $id_type,
                    $target_file
                ]);
                
                header("Location: dashboard.php?booking=success");
                exit();
            } catch(PDOException $e) {
                $error = "Error: " . $e->getMessage();
            }
        } else {
            $error = "Sorry, there was an error uploading your file.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book a Flight</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* General Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    color: #fff;
    min-height: 100vh;
}

/* Header */
header {
    background: linear-gradient(to right, #8e2de2, #4a00e0);
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
}

header h1 {
    font-size: 24px;
    color: #fff;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
}

nav a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
}

nav a:hover {
    color: #ffd6ff;
}

/* Container */
.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Form */
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
    color: #ffffff;
}

input[type="number"],
input[type="file"],
select {
    padding: 10px;
    border: none;
    border-radius: 5px;
    width: 100%;
    font-size: 16px;
    background-color: #fff;
    color: #333;
}

input[type="file"] {
    background-color: #f5f5f5;
}

.btn {
    padding: 12px;
    background: linear-gradient(to right, #a18cd1, #fbc2eb);
    border: none;
    color: #333;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background: linear-gradient(to right, #fbc2eb, #a18cd1);
}

/* Error Message */
p[style*="color: red"] {
    background: #ff3e3e;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
}

    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Flight Booking System</h1>
            <nav>
                <ul>
                    <li>Welcome, <?php echo htmlspecialchars($_SESSION['full_name']); ?></li>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="logout.php">Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="container">
        <h2>Book a Flight</h2>
        
        <?php if(isset($error)): ?>
            <p style="color: red;"><?php echo $error; ?></p>
        <?php endif; ?>
        
        <form action="book_flight.php" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <label for="schedule_id">Select Flight:</label>
                <select id="schedule_id" name="schedule_id" required>
                    <option value="">-- Select a flight --</option>
                    <?php foreach($schedules as $schedule): ?>
                    <option value="<?php echo $schedule['schedule_id']; ?>">
                        <?php echo htmlspecialchars(
                            $schedule['origin'] . ' to ' . $schedule['destination'] . 
                            ' (' . $schedule['type'] . ') - ' . 
                            $schedule['departure_time'] . ' to ' . $schedule['arrival_time'] . 
                            ' (' . $schedule['frequency'] . ')'
                        ); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <div class="form-group">
                <label for="num_passengers">Number of Passengers:</label>
                <input type="number" id="num_passengers" name="num_passengers" min="1" max="10" required>
            </div>
            
            <div class="form-group">
                <label for="id_type">ID Type:</label>
                <select id="id_type" name="id_type" required>
                    <option value="">-- Select ID type --</option>
                    <option value="ID">National ID</option>
                    <option value="Passport">Passport</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="id_file">Upload ID/Passport (PDF or Image):</label>
                <input type="file" id="id_file" name="id_file" accept=".pdf,.jpg,.jpeg,.png" required>
            </div>
            
            <button type="submit" class="btn">Book Flight</button>
        </form>
    </div>
</body>
</html>