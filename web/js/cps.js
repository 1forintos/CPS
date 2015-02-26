window.onload = function() {
	// currently
	// ***** GLOBALS *****
	hosts = [];
	hostTypes = [];
	applicationTypes = [];
	tmpAppRequirement = [];
	scene = new THREE.Scene();
	readyToRender = true;
	renderId = null;
	renderer = null;
	camera = null;
	hostsBeginX = -20;
	hostsEndX = 20;
	currentRowHeight = 0;
	backgroundPlane = null;
	numOfInitialObjects = 0;
	// ***** ***** *******

	initRenderer();
	initScene(scene);
	initUI(scene);
	getAppTypesFromDB();
}

window.setInterval(function(){  
	getFullDataFromREST();
}, 1000);

function initUI(scene) {

/*
	$('#btn_addNewHostType').button().click(function() {
		dialogNewHostType();
	});
*/

	$('#btn_addNewAppType').button().click(function() {
		cleanNewAppDialog();
		$('#dialog_addNewAppType').dialog();
		$('#dialog_addNewAppType').dialog("option", "width", 340);		
	});

	$('#btn_addNewRequest').button().click(function() {
		cleanNewRequestPopup();
		prepareRequestsPopup();
		$('#dialog_addNewRequest').dialog();
		$('#dialog_addNewRequest').dialog("option", "width", 400);	
	});

	$('#btn_sendNewRequest').button().click(function() {
		if(validateRequest()) {
			sendNewRequest();
		}
		$('#dialog_addNewRequest').dialog("close");
	});


	$('#btn_next').button().click(function() {
		$('#dialog_addNewAppType_part1').hide();
		$('#dialog_addNewAppType_part2').show();
	});
	$('#btn_back').button().click(function() {
		$('#dialog_addNewAppType_part2').hide();
		$('#dialog_addNewAppType_part1').show();
	});

	$('#btn_saveAppType').button().click(function() {
		var hostId = $('#select_hostTypeForApp option:selected').val();

		tmpAppRequirement[$('#select_hostTypeForApp option:selected').val()] = {
			hostId: hostId,
        	hostName: hostTypes[hostId].name,
			requiredCpu: $('#input_appType_cpu').val(),
			requiredMemory: $('#input_appType_memory').val(),
			requiredHdd: $('#input_appType_hdd').val()
        }; 

		if(!validatePopupInputs()) {
			return false;
		}
		addNewAppType();		
	});

	var prevHostTypeForApp;
    $("#select_hostTypeForApp").on('focus', function () {
        prevHostTypeForApp = $('#select_hostTypeForApp option:selected').val();
    }).change(function() {
        tmpAppRequirement[prevHostTypeForApp] = {
			hostId: prevHostTypeForApp,
        	hostName: hostTypes[prevHostTypeForApp].name,
			requiredCpu: $('#input_appType_cpu').val(),
			requiredMemory: $('#input_appType_memory').val(),
			requiredHdd: $('#input_appType_hdd').val()
        };
        
        prevHostTypeForApp = $('#select_hostTypeForApp option:selected').val();
        var savedReqOfSelected = null;
        for(var i in tmpAppRequirement) {
        	if($('#select_hostTypeForApp option:selected').val() == tmpAppRequirement[i].hostId) {
        		savedReqOfSelected = tmpAppRequirement[i];
        	}
        }

        if(savedReqOfSelected) {
	        $('#input_appType_cpu').val(savedReqOfSelected["defaultCpu"]);
	        $('#input_appType_memory').val(savedReqOfSelected["defaultMemory"]);
	        $('#input_appType_hdd').val(savedReqOfSelected["defaultHdd"]);
    	} else {
    		$('#input_appType_cpu').val("");
	        $('#input_appType_memory').val("");
	        $('#input_appType_hdd').val("");
    	}
    });

	loadHostTypesFromREST();

	/*
		$('#select_host').selectmenu({width: "100%"});
	*/
}

function validateRequest() {
	var atLeastOneAdded = false;
	for(var i in applicationTypes) {
		var appId = "#input_request_" + i;
		if(($(appId).val() != "" && $(appId).val() != null)
		&& isNaN($(appId).val())) {
			alert("Count values have to be numeric.");
			return false;
		}
		if($(appId).val() != "" && $(appId).val() != null) {
			atLeastOneAdded = true;
		}
	}
	if(!atLeastOneAdded) {
		alert("Atleast one count has to be provided.")
		return false;
	}
	return true;
}

function prepareRequestsPopup() {
	$('#table_requests tbody').empty();
	for(var i in applicationTypes) {
		var row = $('<tr/>').append(
			$('<td/>').text(applicationTypes[i].name + ":").attr('class', 'label'),
			$('<td/>').append($('<input/>').attr('type', 'text')
				.attr('id', 'input_request_' + i))
				.css('width', '20%')
		);
		$('#table_requests tbody').append(row);
	}
}

/*
function dialogNewHostType() {
	$('#dialog_details').attr('title', 'Add new Host Type').dialog();
	$('#dialog_details button').button().click(function(){
		addNewHostType();
	});
}
*/

function validatePopupInputs() {
	var go = true;
	var inputs = $('#dialog_addNewAppType input[type=text]');
	for(var i = 0; i < inputs.length; i++) {
		if(inputs[i].value == null || inputs[i].value == "") {
			go = false;	
			break;
		}
	};
	if(!go) {
		alert("Please fill in all inputs.")
		return false;
	}
	var appId = $('#input_appType_id').val();
	for(var i in hostTypes) {
		if(appId == "" 
		|| appId == null
		|| isNaN(appId)
		|| tmpAppRequirement[i].requiredCpu == "" 
		|| tmpAppRequirement[i].requiredCpu == null
		|| isNaN(tmpAppRequirement[i].requiredCpu)
		|| tmpAppRequirement[i].requiredMemory == "" 
		|| tmpAppRequirement[i].requiredMemory == null
		|| isNaN(tmpAppRequirement[i].requiredMemory)
		|| tmpAppRequirement[i].requiredHdd == "" 
		|| tmpAppRequirement[i].requiredHdd == null
		|| isNaN(tmpAppRequirement[i].requiredHdd)) {
			alert("The Application ID and all requirements for all Host types have to be added as numeric values.");
			return false;
		}
	}
	return true;
}

/*
function addNewHostType() {
	console.log("");
	if(!validatePopupInputs()) {
		return false;
	}
	
	var hostTypeName = $('#popup_input_name').val();
	for(var i in hostTypes) {	
		if(hostTypes[i].name == hostTypeName) {
			alert('This Host type already exists.');
			return false;
		}
	}
	
	// TODO cpu, memory, hdd 
	var newHostType = new HostType(
		hostTypeName, 
		$('#popup_input_cpu').val(), 
		$('#popup_input_memory').val(), 
		$('#popup_input_hdd').val()
	);
	newHostType.color = getRandomColor();
	hostTypes.push(newHostType);

	var newOption = new Option(hostTypeName, $('#select_newHostType option').length);	
	$(newOption).html();
	$('#select_newHostType').append(newOption);
	$('#select_newHostType').selectmenu("refresh");	

	closePopup();
}
*/

function addNewAppType() {	
	var newAppType = null;

	newAppType = new ApplicationType(
		$('#input_appType_id').val(), 
		$('#input_appType_name').val(), 
		$('#input_appType_exeFileUrl').val(), 
		$('#input_appType_exeFileType').val(), 
		$('#input_appType_zipFileUrl').val(), 
		tmpAppRequirement 
	);	
		
	var appTypeName = $('#input_appType_name').val();
	
	if(getAppType(appTypeName)) {
		alert('This Application type already exists.');
		return false;
	}
	
	newAppType.color = getRandomColor();
	applicationTypes.push(newAppType);

	var newOption = new Option(appTypeName, $('#select_appType option').length);
	$(newOption).html();
	$('#select_appType').append(newOption);

	insertAppTypeIntoDB(newAppType);
	$('#dialog_addNewAppType').dialog("close");
	cleanNewAppDialog();	
}

function getHostType(name) {
	for(var i in hostTypes) {
		if(hostTypes[i].name == name) {
			return hostTypes[i];
		}
	}
	return false;
}

function getAppType(name) {
	for(var i in applicationTypes) {
		if(applicationTypes[i].name == name) {
			return applicationTypes[i];
		}
	}
	return false;
}

/*
function addNewHost() {
	var hostName = $('#input_newHost').val();
	var hostTypeName = $('#select_newHostType option:selected').text();

	if(!hostName || hostName == "" || hostTypeName == null) {
		alert('Please enter a host name, select the type then press the Add button.');
		return false;
	} else {
		for(var i in hosts) {	
			if(hosts[i].name == hostName) {
				alert('This Host instance already exists.');
				return false;
			}
		}
	}
	var hostType = getHostType(hostTypeName);

	var newHost = new Host(hostName, hostType);
	hosts.push(newHost);



	var newOption = new Option(hostName, $('#select_host option').length);
	$(newOption).html();
	$('#select_host').append(newOption);
	$('#select_host').selectmenu("refresh");

	renderFrame();
}
*/

function addNewRequirement() {
	var hostName = $('#select_host option:selected').text();
	var apps = [];

	$("#select_requiredApplications option:selected").each(function () {
		var $this = $(this);
		if($this.length) {
	   		apps.push($this.text());
		}
	});	
	

	if(!hostName || hostName == "" || hostName == null
	|| apps == null || apps.length < 1) {
		alert('Please select the required applications and the host then press the corresponding Add button.');
		return false;
	}

	for(var i in hosts) {	
		if(hosts[i].name == hostName) {
			hosts[i].applications = [];
			for(var j in apps) {
				var appType = getAppType(apps[j]);
				var id = appType.name + "_" + hostName;
				var newAppInstance = new Application(id, appType);

				// newAppInstance.host = hosts[i]; ?

				hosts[i].applications.push(newAppInstance);
			}
			
			break;
		}
	}
	renderFrame();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return parseInt(color, 16);
}

function getAppTypesFromDB() {
	$.post('dbscripts/getAppTypes.php', null, function(results) { 
		var response = JSON.parse(results);
		var receivedAppTypes = [];

		for(var i in response.appTypes) {
			receivedAppTypes.push({
				id: response.appTypes[i].id,
				name: response.appTypes[i].name,
				exeFileUrl: response.appTypes[i].exeFileUrl,
				exeFileType: response.appTypes[i].exeFileType,
				zipFile: response.appTypes[i].zipFile,
				requirements: []
			});
		}

		for(var i in receivedAppTypes) {
			var currAppId = receivedAppTypes[i].id;
			var requirements = [];			
			for(var j in response.requirements) {								
				if(response.requirements[j].app == currAppId) {
					requirements.push({
						hostId: response.requirements[j].id,
						hostName: response.requirements[j].host,
						requiredCpu: response.requirements[j].required_cpu,
						requiredMemory: response.requirements[j].required_memory,
						requiredHdd: response.requirements[j].required_hdd,
					});
				}
			}

			receivedAppTypes[i]['requirements'] = requirements;			
		}		
	   	applicationTypes = receivedAppTypes;
	});
}

function getFullDataFromREST() {
	var localUrl = 'http://' + window.location.host + ':8070/cps/full?callback=?' 
	$.getJSON(localUrl, null, function(results) { 

		// results = '[{"totalCpu":10,"totalHdd":10,"totalMemory":10,"availableMemory":2,"availableCpu":9,"availableHdd":10,"id":"hi2","type":"ht1","nodeIp":"asd.asd.asd.asd","applications":[{ "id":"hi2", "type":"ht1"}]},{"totalCpu":10,"totalHdd":10,"totalMemory":10,"availableMemory":10,"availableCpu":10,"availableHdd":10,"id":"hi1","type":"ht1","applications":[]}]';
		var receivedHosts = results;
		hosts = [];
		for(var i in receivedHosts) {
			var type = getHostType(receivedHosts[i].type);
			var newHost = new Host(receivedHosts[i].id, type);
			newHost.availableCpu = receivedHosts[i].availableCpu;
			newHost.availableMemory = receivedHosts[i].availableMemory;
			newHost.availableHdd = receivedHosts[i].availableHdd;
			newHost.totalCpu = receivedHosts[i].totalCpu;
			newHost.totalMemory = receivedHosts[i].totalMemory;
			newHost.totalHdd = receivedHosts[i].totalHdd;
			newHost.nodeIp = receivedHosts[i].nodeIp;
			newHost.availableCpu = receivedHosts[i].availableCpu;
			for(var j in receivedHosts[i].applications) {
				var app = receivedHosts[i].applications[j];
				var appType = getAppType(app.type);
				var newApp = new Application(app.id, appType, newHost);
				newHost.applications.push(newApp);
			}
			hosts.push(newHost);
		}
		if(readyToRender) {
			renderFrame();
		}
	});
}

function insertNewAppTypeIntoDB() {

}

function insertAppTypeIntoDB(newAppType) {
	
	$.post(
		'dbscripts/insertAppType.php', 
		{data: JSON.stringify(newAppType)},
		function(result){
		}
	);
}

function loadHostTypesFromREST() {

	var localUrl = 'http://' + window.location.host + ':8070/cps/hosts?callback=?' 
	$.getJSON(localUrl, null, function(results) { 

	// var dummyResults = '[{"id":1,"name":"ht1","default_cpu":"32","default_memory":"32","default_hdd":"32"},{"id":2,"name":"Android Smartphone","default_cpu":"64","default_memory":"64","default_hdd":"64"}]';
	
		var receivedHostTypes = results;

		for(var i in receivedHostTypes) {
			var newHostType = new HostType(
				receivedHostTypes[i].name,
				0,
				0,
				0
			);

			newHostType.color = getRandomColor();
			hostTypes.push(newHostType);	
			
			var newOption = new Option(receivedHostTypes[j].name, $('#select_hostTypeForApp option').length);		
			$(newOption).html();
			$('#select_hostTypeForApp').append(newOption);

		}
/*
		for(var j in receivedHostTypes) {		
			var newOption = new Option(receivedHostTypes[j].name, $('#select_hostTypeForApp option').length);		
			$(newOption).html();
			$('#select_hostTypeForApp').append(newOption);
		}
*/
	});

}

function sendNewRequest() {
	var requests = [];
	for(var i in applicationTypes) {
		var inputId = "#input_request_" + i;
		requests.push({
			appId: applicationTypes[i].id,
			count: $(inputId).val()
		});
	}
	if(requests.length > 0) {
		$.post(
			'dbscripts/insertRequest.php', 
			{data: JSON.stringify(requests)},
			function(result){

				var localUrl = 'http://' + window.location.host + ':8070/cps/init?callback=?' 
				$.getJSON(localUrl, null, function(results) { 
					}
				);
				
			}
		);
	}
}

function cleanNewAppDialog() {
	$('#dialog_addNewAppType input[type=text]').each(function() {
		$(this).val("");
	});
	if($('#select_hostTypeForApp').length > 0) {
		tmpAppRequirement = [];
		$('#select_hostTypeForApp').val("0");
	}
	$('#dialog_addNewAppType_part2').hide();
	$('#dialog_addNewAppType_part1').show();
}

function cleanNewRequestPopup() {

}