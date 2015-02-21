<?php
	/*
	$hosts = array(
		array(
			"type" => "iPhone Smartphone",
			"id" => 1,
			"name" => "iPhone Smartphone",
			"availableCpu" => "32",
			"availableMemory" => "32",
			"availableHdd" => "32",
			"totalCpu" => "64",
			"totalMemory" => "64",
			"totalHdd" => "64",
			"nodeIp" => "some ip",
			"applications" => array(
				array(
					"type" => "SmokeDetector"
				)
			)
		),
		array(
			"type" => "Android Smartphone",
			"id" => 14,
			"name" => "iPhone Smartphone 1",
			"availableCpu" => "32",
			"availableMemory" => "32",
			"availableHdd" => "32",
			"totalCpu" => "64",
			"totalMemory" => "64",
			"totalHdd" => "64",
			"nodeIp" => "some ip",
			"applications" => array(
				array(
					"type" => "SmokeDetector"
				)
			)
		)
	);
	echo json_encode($hosts);
	*/

	$hostTypes = array(
		array(
			"id" => 1,
			"name" => "iPhone Smartphone2",
			"totalCpu" => "32",
			"totalMemory" => "32",
			"totalHdd" => "32",
			"applicationIds" => array(8)

		)
	);

	echo json_encode($hostTypes);

?>
