var HostType = function(id, cpu, memory, hdd) {
	this.id = id;
	this.name = id;

	this.defaultCpu = cpu;
	this.defaultMemory = memory;
	this.defaultHdd = hdd;

	this.color;
};

var Host = function(id, hostType) {
	this.id = id;
	this.name = id;
	this.type = hostType;
	this.applications = [];

	this.availableCpu = hostType.defaultCpu;
	this.availableMemory = hostType.defaultMemory;
	this.availableHdd = hostType.defaultHdd;

	this.totalCpu = hostType.defaultCpu;
	this.totalMemory = hostType.defaultMemory;
	this.totalHdd = hostType.defaultHdd;

	this.nodeIp = null;

	this.geometry = {
		width: 2,
		height: 2,
		thickness: 2,
		appsPerRow: 5
	}
}

// pos = front top left point - THREE.Vector3 object
Host.prototype.draw = function(pos) {

	var nonExistingApp = new Application("none", new ApplicationType("none", 0, 0, 0));
	var appWidth = nonExistingApp.geometry["width"] * 2;

	var numOfApps = this.applications.length;
	if(numOfApps < 2) {
		this.geometry["width"] = 2 * appWidth;
		this.geometry["height"] = 2 * appWidth;
	} else {
		if(numOfApps <= 5) {
			this.geometry["width"] = (2 * appWidth) + (numOfApps - 1) * appWidth * 1.5;
			this.geometry["height"] = 2 * appWidth;
		} else {			
			this.geometry["width"] = (2 * appWidth) + (5 - 1) * appWidth * 1.5;

			var rows = Math.floor(numOfApps / this.geometry["appsPerRow"]);
			if(numOfApps % this.geometry["appsPerRow"] != 0) {
				rows++;
			}
			this.geometry["height"] = (2 * appWidth) + (rows - 1) * appWidth * 1.5;
		}
	} 

	var hostShape = new THREE.BoxGeometry(
		this.geometry["width"], 
		this.geometry["height"], 
		this.geometry["thickness"]
	);

    var hostMaterial = new THREE.MeshLambertMaterial({
     	map: hostTexture,
     	color: this.type.color
    });

	var host = new THREE.Mesh(hostShape, hostMaterial);
	host.position.set(
		pos.x + this.geometry["width"] / 2, 
		pos.y - this.geometry["height"] / 2, 
		pos.z
	);
	host.overdraw = true;
	//host.castShadow = true;
	//host.receiveShadow = false;
	scene.add(host);

	// draw performance bars
	// left - memory	
	var memoryUsage = (1 - this.availableMemory / this.totalMemory);
	var memoryBarShape = new THREE.PlaneBufferGeometry( 
		0.3, 
		memoryUsage * this.geometry["height"], 
		32,
		32
	);

    var memoryBarMaterial = new THREE.MeshBasicMaterial({
     	color: getPerformanceColor(memoryUsage)
    });

	var memoryBar = new THREE.Mesh(memoryBarShape, memoryBarMaterial);
	memoryBar.position.set(
		host.position.x - this.geometry["width"] / 2 - 0.15, 
		host.position.y + this.geometry["height"] * memoryUsage / 2, 
		host.position.z + this.geometry["thickness"] * 1.5
	);
	scene.add(memoryBar);
	
	// right - cpu
	var cpuUsage = (1 - this.availableCpu / this.totalCpu);
	var cpuBarShape = new THREE.PlaneBufferGeometry( 
		0.3, 
		cpuUsage * this.geometry["height"], 
		32,
		32
	);

    var cpuBarMaterial = new THREE.MeshBasicMaterial({
     	color: getPerformanceColor(cpuUsage)
    });

	var cpuBar = new THREE.Mesh(cpuBarShape, cpuBarMaterial);
	cpuBar.position.set(
		host.position.x + this.geometry["width"] / 2 + 0.15, 
		host.position.y + this.geometry["height"] * cpuUsage / 2, 
		host.position.z + this.geometry["thickness"] * 1.5
	);
	scene.add(cpuBar);

	var textPos = host.position;
	textPos.z += this.geometry["thickness"];
	textPos.y += this.geometry["height"] / 2;
	draw2dText(this.name, textPos);

	var appPos = new THREE.Vector3(
		pos.x + appWidth, 
		pos.y - appWidth, 
		pos.z + this.geometry["thickness"] * 0.35
	);

	var j = 1;
	for(var i in this.applications) {
		this.applications[i].draw(appPos);
		appPos.x += 1.5 * appWidth;
		if(j % this.geometry["appsPerRow"] == 0) {
			appPos.x = pos.x + appWidth;
			appPos.y -= 1.5 * appWidth;
		}
		j++;
	}

	var gapBetweenHosts = 2;
	var nextHostX = pos.x + this.geometry["width"] + gapBetweenHosts;
	var nextHostY = pos.y;

	if(nextHostX >= hostsEndX) {
		nextHostX = hostsBeginX;
		nextHostY = pos.y - currentRowHeight - gapBetweenHosts - this.geometry["height"] / 2;
		currentRowHeight = 0;
	} else if(currentRowHeight < this.geometry["height"]) {
		currentRowHeight = this.geometry["height"];
	}

	var newPos = new THREE.Vector3( 
		nextHostX, 
		nextHostY, 
		0
	);
	return newPos;
}