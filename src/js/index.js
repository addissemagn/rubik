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
var keysPressed = [];
var bgColor;

init();
rubik();
animate();

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
        document.body.appendChild(renderer.domElement);
    }

    var initCamera = function() {
        const fov = 20; // field of view; lower = closer
        const aspect = winWidth / winHeight;
        const near = 0.1;
        const far = 1000;

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(30, 35, 30);
        scene.add(camera);
    }

    var initOrbitControls = function() {
        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.update()
        orbitControl.enableDamping = true;
        orbitControl.dampingFactor = 0.6;
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
        scene.add(ambientLight);

        var mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
        mainLight.position.set(10, 10, 10);
        scene.add(mainLight);
    }

    initRenderer();
    initCamera();
//    initCameraControls();
    initOrbitControls();
    initLights();

    // Events
    document.addEventListener('resize', onWindowResize, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    //document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function animate() {
    rubik.animate();

    /*camera.position.set(
        controls.CameraPositionX,
        controls.CameraPositionY,
        controls.CameraPositionZ
    );*/

    requestAnimationFrame(animate);
    render();
}

function render() {
    orbitControl.update();
    renderer.render(scene, camera); // draw
}

function onWindowResize() {
    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
}

