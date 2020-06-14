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
var controls;

function init() {
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    scene = new THREE.Scene();
    //var axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    var initRenderer = function() {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xEEEEEE);
        renderer.setSize(winWidth, winHeight);
        document.body.appendChild(renderer.domElement);
    }

    var initCamera = function(x, y, z) {
        camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 0.1, 1000);
        camera.position.set(x, y, z);
        camera.lookAt(scene.position);
        camera.lookAt(new THREE.Vector3(-4, 3, 5));
        scene.add(camera);
    }

    var initControls = function() {
        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', render);
        orbitControl.enableZoom = false;
    }

    var initCameraControls = function() {
        controls = new function() {
            this.CameraPositionX = 2;
            this.CameraPositionY = 10;
            this.CameraPositionZ = 30;
        }
        var gui = new dat.GUI();
        var cameraFolder = gui.addFolder("Camera");
        cameraFolder.add(controls, 'CameraPositionX', -100, 100);
        cameraFolder.add(controls, 'CameraPositionY', -100, 100);
        cameraFolder.add(controls, 'CameraPositionZ', -100, 100);
    }

    var initLights = function() {
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, 100, 200);
        spotLight.castShadow = true;
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

    //document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
}

var pivot;
var topdown;

var RAD_90 = Math.PI * 0.5;
var RAD_45 = Math.PI * 0.25;
var TEST = Math.PI * 0.1;

var CW = -1 * TEST;
var CCW = TEST;

var moves = {
    // top 0 CW
    "U": {
        "dir": "top",
        "layer": 0,
        "angle": CW
    },
    // top 0 CCW
    "Ur": {
        "dir": "top",
        "layer": 0,
        "angle": CCW
    },
    "D": {
        "dir": "top",
        "layer": 2,
        "angle": CW
    },
    "Dr": {
        "dir": "top",
        "layer": 2,
        "angle": CCW
    },
    "L": {
        "dir": "left",
        "layer": 0,
        "angle": CW
    },
    "R": {
        "dir": "left",
        "layer": 2,
        "angle": CW
    },
    "F": {
        "dir": "front",
        "layer": 0,
        "angle": CW
    },
    "B": {
        "dir": "front",
        "layer": 2,
        "angle": CW
    }
}

var group;
function draw() {
    rubik = new Rubik();

    rubik.getWhole();
    showCube();
}

function sceneAdd(orientation) {
    for (var i = 0; i < 3; i++) {
        scene.add(rubik.layers[orientation][i]);
    }
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;

    // make top/bottom layers
    if(keyCode == 85 || keyCode == 68) {
        //clearScene();
        rubik.makeLayers("top");
        sceneAdd("top");

        if(keyCode == 85) { // u
            rubik.makeMove(moves.U);
        } else if (keyCode == 68) { // d
            rubik.makeMove(moves.D);
        }
    } else if(keyCode == 16 || keyCode == 82) {
        //clearScene();
        rubik.makeLayers("left");
        sceneAdd("left");

        if(keyCode == 16) { // l
            rubik.makeMove(moves.L);
        } else if (keyCode == 82) { // r
            rubik.makeMove(moves.R);
        }
    } else if(keyCode == 70 || keyCode == 66) {
        //clearScene();
        rubik.makeLayers("front");
        sceneAdd("front");

        if(keyCode == 70) { // f
            rubik.makeMove(moves.F);
        } else if (keyCode == 66) { // b
            rubik.makeMove(moves.B);
        } 
    }
};

function showCube() {
    scene.add(rubik.layers["whole"]);
}

function clearScene() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}

//tween.start();
function rotate(move) {
    rubik.layers[move.dir][move.layer].rotateY(move.angle);
}

function animate() {
    rubik.animate();

    camera.position.set(
        controls.CameraPositionX,
        controls.CameraPositionY,
        controls.CameraPositionZ
    );

    render();
}

function render() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera); // draw
}

init();
draw();
animate();

