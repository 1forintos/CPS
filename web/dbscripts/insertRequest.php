<?php
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

    function connect() {
        $con=mysqli_connect("localhost","root","","cps");
        // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
        
        return $con;
    }
?>