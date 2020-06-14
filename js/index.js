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
        camera = new THREE.PerspectiveCamera(70, winWidth / winHeight, 0.1, 1000);
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

    document.addEventListener('mousedown', onDocumentMouseDown, false);
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
    }
}

var group;
function draw() {
    rubik = new Rubik();

    rubik.getTopBottom();
    sceneAdd("top");
    group = rubik.layers["top"][0];
}

function sceneAdd(orientation) {
    for (var i = 0; i < 3; i++) {
        scene.add(rubik.layers[orientation][i]);
    }
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    //    new TWEEN.Tween( rubik.layers["top"][0].rotation  )
    //.to( {  y:  rubik.layers["top"][0].rotation.y + RAD_90 }, 1000  )
    //.easing( TWEEN.Easing.Quadratic.EaseOut )
    //.start();

    //rotate(moves.U)
    //rotate(moves.Dr)
    if(rubik.state.spin["top"][0] == false) {
        rubik.state.spin["top"][0] = true;
        rubik.state.currRotate = 0;

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
    TWEEN.update();
    renderer.render(scene, camera); // draw
}

init();
draw();
animate();

