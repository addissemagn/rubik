// [] lighting
// [] mouse control

// global vars
var scene;
var camera;
var renderer;
var orbitControl;
var cube;
var light;
var pivot;
var spotLight;
var ambientLight;

function render() {
    renderer.render(scene, camera); // draw
}

// controls
var controls = new function() {
    this.CameraPositionX = 2;
    this.CameraPositionY = 10;
    this.CameraPositionZ = 30;
}

function init() {
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    scene = new THREE.Scene();

    var initRenderer = function() {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xEEEEEE);
        renderer.setSize(winWidth, winHeight);
        document.body.appendChild(renderer.domElement);
    }

    var initCamera = function(x, y, z) {
        camera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.1, 1000);
        camera.position.set(x, y, z);
        camera.lookAt(scene.position);
        camera.lookAt(new THREE.Vector3(-4, 3, 5));
        scene.add(camera);
    }

    var initControls = function() {
        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', render);
        orbitControl.enableZoom = true;
    }

    var initCameraControls = function() {
        var gui = new dat.GUI();
        var cameraFolder = gui.addFolder("Camera");
        cameraFolder.add(controls, 'CameraPositionX', -100, 100);
        cameraFolder.add(controls, 'CameraPositionY', -100, 100);
        cameraFolder.add(controls, 'CameraPositionZ', -100, 100);
    }

    var initLights = function() {
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, 100, 200);
        scene.add(spotLight);

        var ambiColor = "#0c0c0c";
        ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);
    }

    initRenderer();
    initCamera(2, 10, 30);
    initCameraControls();
    initControls();
    initLights();
}

var group;

function draw() {
    rubik = new Rubik();

    var side = rubik.getSide();
    pivot = new THREE.Group();
    pivot.add(rubik.getSide());
    rubik.setSidePosition(4, -3, -5);
    scene.add(pivot);

    group = new THREE.Group();
    var top = new THREE.Object3D();

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            top.add(rubik.getCube(i, j, 0));
        }
    }
    top.position.set(4, -3, -5);
    group.add(top);

    scene.add(group);
}

function animate() {
    group.rotation.z += 0.01;
    //pivot.rotation.z += 0.01;
    camera.position.x = controls.CameraPositionX;
    camera.position.y = controls.CameraPositionY;
    camera.position.z = controls.CameraPositionZ;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
draw();
animate();

