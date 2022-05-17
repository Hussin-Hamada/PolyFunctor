<?php
// Initialize the session
session_start();

// Check if the user is already logged in, if yes then redirect him to home page
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    echo "<script>alert('another account is already logged in. You need to log out first');location = '../index.html';</script>";
    exit;
}
 
// Include config file
require('connect.php');
 
// Define variables
$email = $_GET['email'];
$password = $_GET['login-password'];
 
// Prepare a select statement
$sql = "SELECT id, Fname,Lname FROM users WHERE email='".$email."' and pass='".$password."'";
$stmt = $mysqli->prepare($sql);

// execute the prepared statement
$stmt->execute();

// Store result
$stmt->store_result();
                
if($stmt->num_rows == 1){

    $stmt->bind_result($id, $Fname, $Lname);
    $stmt->fetch();
                                
    // Store data in session variables
    $_SESSION["loggedin"] = true;
    $_SESSION["id"] = $id;
    $_SESSION["Fname"] = $Fname;
    $_SESSION["Lname"] = $Lname;
    
    // Redirect user to welcome page
    echo "<script>alert('login successful.');location = '../index.html';</script>";

} else {
    echo "<script>alert('wrong email or password.');location = '../index.html';</script>";
}

// Close statement
$stmt->close();
    

// Close connection
$mysqli->close();

?>