<?php
    require_once("dbConnection.php");

	$con = connect();
    $results = [];

    $appData = $_POST['data'];
    $requestRows = json_decode($appData);

    foreach ($requestRows as $row) {
        $query = "
            INSERT INTO request (app, count)
            VALUES (" . 
                $row->appId . ", " .
                $row->count . 
            ")";
    
        $result = mysqli_query($con, $query) or die(mysqli_error($con));
    }    
   	
    mysqli_close ( $con );
?>