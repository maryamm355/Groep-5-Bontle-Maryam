<?php
$host = "localhost";
$db = "users";
$user = "root";
$pass = "root";

$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>


