<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT id, name, age, status FROM users ORDER BY id DESC";
    $result = $conn->query($sql);
    
    $users = array();
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'data' => $users]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

