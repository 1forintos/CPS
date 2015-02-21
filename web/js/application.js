var ApplicationType = function(id, name, exeFileUrl, exeFileType, zipFileUrl, requirements) {
	this.id = id;
	this.name = name;
	this.exeFileUrl = exeFileUrl;
	this.exeFileType = exeFileType;
	this.zipFileUrl = zipFileUrl;

	// grouped by hosts
	this.requirements = requirements;

	this.color;
	
};

var Application = function(id, applicationType, host) {
	this.id = id;
	this.name = id;
	this.type = applicationType;

	this.availableCpu = applicationType.defaultCpu;
	this.availableMemory = applicationType.defaultMemory;
	this.availableHdd = applicationType.defaultHdd;

	this.totalCpu = applicationType.defaultCpu;
	this.totalMemory = applicationType.defaultMemory;
	this.totalHdd = applicationType.defaultHdd;

	this.state = null;
	this.nodeIp = null;

	this.geometry = {
		width: 0.7
	};

	this.host = host;
}

Application.prototype.draw = function(pos) {
	
	var appMaterial = new THREE.MeshLambertMaterial({
     	map: appTexture,
     	color: this.type.color
    });
	var appShape = new THREE.SphereGeometry(this.geometry["width"], 32, 32); 
	var app = new THREE.Mesh( appShape, appMaterial ); 
	app.position.set(pos.x, pos.y, pos.z);
	app.castShadow = true;
	app.receiveShadow = false;
	scene.add( app );
}