function initRenderer() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer = new THREE.WebGLRenderer(rendererParams);
	var rendererParams = {
		antialias: true,
		preserveDrawingBuffer: false,
		maxLights: 10
	};
	renderer.setSize(width, height);
	renderer.autoClear = true;
	document.body.appendChild( renderer.domElement );
}

function initScene(scene) { 
	
	var width = window.innerWidth;
	var height = window.innerHeight;

	camera = new THREE.PerspectiveCamera( 45, width / height, 0.01, 1000 );
	initCameraMovement(camera);
	camera.position.z = 50;
	
	hostTexture = THREE.ImageUtils.loadTexture('textures/Texture1.jpg');
	appTexture = THREE.ImageUtils.loadTexture('textures/Texture4.jpg');
	initLights();


	var geometry = new THREE.PlaneBufferGeometry( 200, 200, 32 );
	var material = new THREE.MeshPhongMaterial( {
		color: 0x333333, 
		side: THREE.DoubleSide
	} );
	backgroundPlane = new THREE.Mesh( geometry, material );
	backgroundPlane.position.z = -10;
	//backgroundPlane.castShadow = false;
	//backgroundPlane.receiveShadow = true;
	scene.add( backgroundPlane );	
	numOfInitialObjects = scene.children.length;
	renderFrame();
}

function animate() {	
	$('.hostLabel').each(function(){ $(this).remove();})
	var pos = new THREE.Vector3( -20, 8, 0 );
    renderId = requestAnimationFrame( animate );
    for(var i in hosts) {
		pos = hosts[i].draw(pos);
	}
    renderer.render( scene, camera );
}

function stopAnimation() {
	cancelAnimationFrame(renderId);	
}

function renderFrame() {
	if(!readyToRender) {
		return;
	}
	readyToRender = false;
	animate();
	stopAnimation();

	var obj;
	var objectsToDelet = scene.children.length - numOfInitialObjects;
	for (var j = scene.children.length - 1; j >= numOfInitialObjects; j--) {
	    obj = scene.children[j];
    	scene.remove(obj);
	}
	readyToRender = true;
}

function initLights() {

	var lights = [];

	// directional lighting
	var directionalLight1 = new THREE.DirectionalLight(0x888888);
	directionalLight1.position.set(1, 2, 3).normalize();
	directionalLight1.target.position.set(-10,5,0);
	scene.add(directionalLight1);
	var directionalLight2 = new THREE.DirectionalLight(0x888888);
	directionalLight2.position.set(-3, -2, 1).normalize();
	directionalLight2.target.position.set(0,0,0);
	scene.add(directionalLight2);
	var directionalLight3 = new THREE.DirectionalLight(0x888888);
	directionalLight3.position.set(-5, 1, 5).normalize();
	directionalLight1.target.position.set(5, -5, 0);
	scene.add(directionalLight3);
	
	
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

	lights[0] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[0].position.set( 0, 0, 40 ).normalize();
	lights[1] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[1].position.set( 15, 5, 56 ).normalize();
	lights[2] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[2].position.set( -15, 5, 57 ).normalize();
	lights[3] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[3].position.set( 15, -20, 58 ).normalize();
	lights[4] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[4].position.set( -15, -20, 69 ).normalize();
	lights[5] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[5].position.set( -15, -20, 54 ).normalize();
	lights[6] = new THREE.PointLight( 0xAAAAAA, 0.5, 200 );	
	lights[6].position.set( 3, -20, 42 ).normalize();
	

	scene.add(lights[0]);
	//scene.add(lights[1]);
	scene.add(lights[2]);
	//scene.add(lights[3]);
	scene.add(lights[4]);
	//scene.add(lights[5]);
	scene.add(lights[6]);

	
	var spotLight1 = new THREE.SpotLight(0x666666);
	var spotLight2 = new THREE.SpotLight(0x666666);

	spotLight1.castShadow = true;
	spotLight2.castShadow = true;

	//spotLight1.shadowMapWidth = 1024;
	//spotLight2.shadowMapWidth = 1024;
	//spotLight1.shadowMapHeight = 1024;
	//spotLight2.shadowMapHeight = 1024;

	spotLight1.shadowCameraNear = 0.1;
	spotLight2.shadowCameraNear = 0.1;
	spotLight1.shadowCameraFar = 2000;
	spotLight2.shadowCameraFar = 2000;
	spotLight1.shadowCameraFov = 30;
	spotLight2.shadowCameraFov = 30;
	spotLight1.shadowDarkness = 0.15;
	spotLight2.shadowDarkness = 0.15;
	spotLight1.position.set(15, 5, 100);
	spotLight2.position.set(-15, -10, 70);
	spotLight1.target.position = new THREE.Object3D(0, 0, 0);
	spotLight2.target.position = new THREE.Object3D(-5, -5, 0);
	spotLight1.angle = Math.PI * 14 / 32;
	spotLight2.angle = Math.PI * 14 / 32;
	//scene.add( spotLight1 );
	//scene.add( spotLight2 );
}

function initCameraMovement(camera) {
	/*
	$(document).keydown(function(e) {
		var keyCode = (e.keyCode ? e.keyCode : e.which);
		
	    switch(keyCode) {
	        case 37: // left
		        camera.position.x -= 2;
		        break;

	        case 38: // up
		        camera.position.y += 2;
		        break;

	        case 39: // right
		        camera.position.x += 2;
		        break;

	        case 40: // down
	        	camera.position.y -= 2;
		        break;

	        case 120: // forward
	        	camera.position.z -= 2;
		        break;

		    case 121: // backward
	        	camera.position.z += 2;
		        break;
		            
	        default: return; // exit this handler for other keys
	    }
		renderFrame();
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
*/
}

function toScreenXY(position) {
	var jqdiv = renderer.domElement;
    var pos = position.clone();
    var projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    projScreenMat.multiplyVector3(pos);

    var resultCoord = {
		x: null,
		y: null
	};
    resultCoord.x = ( pos.x + 1 ) * jqdiv.width / 2 + jqdiv.offsetLeft;
    resultCoord.y = ( - pos.y + 1) * jqdiv.height / 2 + jqdiv.offsetTop;
    return resultCoord;

}

function draw2dText(text, pos3d) {
	var pos2d = toScreenXY(pos3d);
	var textDiv = document.createElement('div');
	textDiv.className = "hostLabel";
	pos2d.x -= 100;
	pos2d.y -= 45;
	textDiv.innerHTML = text;
	textDiv.style.top = pos2d.y + 'px';
	textDiv.style.left = pos2d.x + 'px';
	document.body.appendChild(textDiv);
}

// number 0 < x < 1
function getPerformanceColor(number) {	
	var red = Math.floor(number * 255);
	var green = Math.floor((1 - number) * 255);
	var redHex = red.toString(16);
	if(redHex.length == 2) {
		redHex = "0" + redHex;
	}

	var greenHex = green.toString(16);
	if(greenHex.length == 2) {
		greenHex = "0" + greenHex;
	}
	var hexColor = "0x" + redHex + greenHex + "00";
	var color = parseInt(hexColor, 16);

	return color;
}