<?php
	$con = connect();
    $results = [];

    $appData = $_POST['data'];
    $data = json_decode($appData);

    $query = "
        INSERT INTO applicationtype (id, name, exeFileUrl, exeFileType, zipFileUrl)
        VALUES (" . 
        	$data->id . ", '" .
        	$data->name . "', '" .
        	$data->exeFileUrl . "', '" .
        	$data->exeFileType . "', '" .
        	$data->zipFileUrl . 
    "')";
	
    $result = mysqli_query($con, $query) or die(mysqli_error($con));
    
    foreach($data->requirements as $req) {
	    $query = "
	        INSERT INTO requirement (host, app, required_cpu, required_memory, required_hdd)
	        VALUES ('" . 
	        	$req->hostName . "', " .
	        	$data->id . ", " .
	        	$req->requiredCpu . ", " .
	        	$req->requiredMemory . ", " .
	        	$req->requiredHdd . 
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