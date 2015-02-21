<?php
    $con = connect();
    $results = [];

    $query = "
        SELECT * 
        FROM applicationtype
        ORDER BY name
    ";
    $result = mysqli_query($con, $query);
    if($result != false) {
        while($row = mysqli_fetch_array($result)) {
            $results["appTypes"][] = $row;    
        }
    }
    
    $query = "
        SELECT *
        FROM requirement
    ";

    $result = mysqli_query($con, $query);
    if($result != false) {
        while($row = mysqli_fetch_array($result)) {
            $results["requirements"][] = $row;    
        }
    }
    
    mysqli_close ( $con );

    echo json_encode($results);

    function connect() {
        $con=mysqli_connect("localhost","root","","cps");
        // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
        
        return $con;
    }
?>