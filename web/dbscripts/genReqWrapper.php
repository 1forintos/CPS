<?php
require_once("dbConnection.php");

$db_name = uniqid();
$username = uniqid();
$password = uniqid();

$requests = json_decode($_POST["data"]);

$apps = [];
$counts = [];

foreach($requests as $request) {
	$apps[] = $request->appId;
	$counts[] = $request->count;
}


$con = connect();

$query = "CREATE DATABASE database$db_name";
if (!mysqli_query($con,$query)) {
	die('Error: ' . mysqli_error($con) . '\n ' . $query);
}

$query = "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password'";
if (!mysqli_query($con,$query)) {
	die('Error: ' . mysqli_error($con));
}

$query = "GRANT ALL PRIVILEGES ON database$db_name . * TO '$username'@'localhost'";
if (!mysqli_query($con,$query)) {
	die('Error: ' . mysqli_error($con));
}

$query = "FLUSH PRIVILEGES";
if (!mysqli_query($con,$query)) {
	die('Error: ' . mysqli_error($con));
}

mysqli_select_db($con, "cps");

$query = "INSERT INTO REQ_WRAPPER(user, password, db_name) VALUES('$username', '$password', '$db_name')";
if (!mysqli_query($con,$query)) {
	die('Error: ' . mysqli_error($con));
}

$query = "SELECT MAX(id) FROM REQ_WRAPPER";
$result = mysqli_query($con,$query);
if (!$result) {
	die('Error: ' . mysqli_error($con));
}
while($row = mysqli_fetch_array($result)) {
	$id = $row[0];
}

for ($i = 0, $count = count($apps); $i < $count; $i++) {
	$query = "INSERT INTO REQUEST(app, count, req) VALUES('$apps[$i]', '$counts[$i]', '$id')";
	if (!mysqli_query($con,$query)) {
		die('Error: ' . mysqli_error($con));
	}
}

echo "Added successfully";

mysqli_close ( $con );
$con = null;

?>
