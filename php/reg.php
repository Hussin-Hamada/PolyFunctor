<?php

require('connect.php');
//variables 
$Fname = $_GET['fname'];
$Lname = $_GET['lname'];
$email = $_GET['email'];
$pass = $_GET['createPassword'];
if (isset($_GET['submit'])) {

    $sql = "INSERT INTO `users` (`id`, `Fname`, `Lname`, `email`, `pass`) VALUES (NULL, '$Fname', '$Lname', '$email', '$pass');";
    if(mysqli_query($mysqli, $sql)){
        echo "<script>alert('account created successfully, you can login now.');location = '../index.html';</script>";
    } else {
        echo "<script>alert('email already used, please use another one.');location = '../index.html';</script>";
    }
    mysqli_close($mysqli);
}

?>