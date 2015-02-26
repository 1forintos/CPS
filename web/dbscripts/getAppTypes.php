<?php
    require_once("dbConnection.php");

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
?>