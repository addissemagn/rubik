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
var controls;
var mainLight;
var keysPressed = [];
var bgColor;

function init() {
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    scene = new THREE.Scene();
    bgColor = 0x73ccd7;
    var bgColor1 = 0x242423;
    var bgColor2 = 0x085c76;

    scene.background = new THREE.Color(bgColor);

    var initRenderer = function() {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(winWidth, winHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.gammaFactor = 2.2;
        renderer.gammaOutpu = true;
        renderer.physicallyCorrectLights = true;
        document.body.appendChild(renderer.domElement);
    }

    var initCamera = function(x, y, z) {
        const fov = 20; // field of view; lower = closer
        const aspect = winWidth / winHeight;
        const near = 0.1;
        const far = 1000;

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(x, y, z);
        //camera.lookAt(scene.position);
        camera.lookAt(new THREE.Vector3(-4, 3, 5));
        scene.add(camera);
    }

    var initControls = function() {
        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        //orbitControl.update()
        orbitControl.enableDamping = true;
        orbitControl.dampingFactor = 0.0;
        orbitControl.rotateSpeed = 0.5;
        orbitControl.enableZoom = true;
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
        var ambientLight = new THREE.AmbientLight(0xddeeff, 0x202020, 9);
        //var ambientLight2 = new THREE.AmbientLight(0xf1a4ff, 0.2)

        scene.add(ambientLight);

        mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
        mainLight.position.set(10, 10, 10);
        scene.add(ambientLight, mainLight);
    }

    initRenderer();
    initCamera(2, 10, 30);
    initCameraControls();
    initControls();
    initLights();

    //document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('resize', onWindowResize, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
}

function onWindowResize() {
    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
}

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

function draw() {
    rubik = new Rubik();
}

function sceneAdd(orientation) {
    for (var i = 0; i < 3; i++) {
        scene.add(rubik.layers[orientation][i]);
    }
}

var prevKey;
var currKey;


var mapping = {
    "u": {
        "dir": "top",
        "layer": 0
    },
    "d": {
        "dir": "top",
        "layer": 2
    },
    "l": {
        "dir": "left",
        "layer": 0
    },
    "r": {
        "dir": "left",
        "layer": 2
    },
    "f": {
        "dir": "front",
        "layer": 0
    },
    "b": {
        "dir": "front",
        "layer": 2
    }
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var key = {
        "85": "u",
        "68": "d",
        "76": "l",
        "82": "r",
        "70": "f",
        "66": "b",
        "187": "solve"
    }



    // if key is valid
    if (key[keyCode] != undefined) {
    
        var letter = key[keyCode];


        if(!rubik.solve && letter == "solve")
            rubik.solve = true;

        if(rubik.solve) {
            rubik.solveNext();
        } else {
            // add to beginning of array
            keysPressed.unshift(letter);

            // if first key or if new key, make layer
            if (keysPressed.length == 1 ||
                (keysPressed.length > 1 && keysPressed[0] != keysPressed[1])) {
                rubik.dissolveLayer();
                rubik.makeLayer(mapping[letter].dir, mapping[letter].layer)
                scene.add(rubik.currLayer);
            }

            rubik.moveCurr();
        }

    }

    console.log(key[keyCode]);

    if(false) {

        // make top/bottom layers
        if(keyCode == 85 || keyCode == 68) {
            //clearScene();
            //rubik.makeLayers("top");
            //sceneAdd("top");

            rubik.makeLayer("top", 0);
            scene.add(rubik.currLayer);
        
            if(keyCode == 85) { // u 
                //rubik.rotateCurr();
                rubik.moveCurr();


                //rubik.makeMove(moves.U);
            } else if (keyCode == 68) { // d
                rubik.makeMove(moves.D);
            }
        } else if(keyCode == 76 || keyCode == 82) {
            //clearScene();
            rubik.makeLayers("left");
            sceneAdd("left");

            if(keyCode == 76) { // l
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
    }
}
// show rubik's cube
function showCube() {
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            for (var k = 0; k < 3; k++)
                scene.add(rubik.getCube(i, j, k));
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

    requestAnimationFrame(animate);
    render();
}

function render() {
    orbitControl.update();
    renderer.render(scene, camera); // draw
}

init();
draw();
animate();

