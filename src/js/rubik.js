// TODO:
// - dismantle groups without removing cube from scene
// - either don't let rotation before prev is done or make a queue
// - way to indicate CCW movement. i.e. space, shift with key

var keys = ["u", "d", "l", "r", "f", "b"];

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function rubik() {
    var cubeDim = 2;        // dim of each cube
    var gap = cubeDim * 0.05;
    var wireframe = false;
    var transparent = true;

    rubik = new Rubik(cubeDim, gap, wireframe, transparent);
}

class Rubik {
    constructor(cubeDim, gap, wireframe, transparent) {
        this.state = {
            // current layer rotation angle
            currAngle: 0,
            // rotation speed in RAD 
            speed: (Math.PI/20),
            // status of which layers should be rotating
            spin: {
                "top": [false, false, false],
                "left": [false, false, false],
                "front": [false, false, false]
            },
        };

        // center of rubik's cube
        this.ctr = {"x": -4, "y": 3, "z": 0.5}
        this.solve = false;
        this.shuffle = false;

        this.shuffle = {
            on: false,
            count: 0,
            prev: null,
            curr: null
        }

        this.coords = {
            "x": [this.ctr.x - cubeDim - gap, this.ctr.x, this.ctr.x + cubeDim + gap],
            "y": [this.ctr.y + cubeDim + gap, this.ctr.y, this.ctr.y - cubeDim - gap],
            "z": [this.ctr.z + cubeDim + gap, this.ctr.z, this.ctr.z - cubeDim - gap]
        }

        this.rubik = new Array();

        // pivot for cube to rotate about
        var pivot = new THREE.Group();
        // neg of group's center
        pivot.position.set(-1*this.ctr.x, -1*this.ctr.y, -1*this.ctr.z);
        scene.add(pivot);

        for (var i = 0; i < 3; i++) {
            this.rubik[i] = new Array();
            for (var j = 0; j < 3; j++) {
                this.rubik[i][j] = new Array();
                for (var k = 0; k < 3; k++) {
                    var cube = new Cube(
                        this.coords.x[i], this.coords.y[j], this.coords.z[k], this.coords,
                        cubeDim, wireframe, transparent, this.faceType(i, j, k));
                    this.rubik[i][j][k] = cube; 
                    scene.add(cube.cube);
                    pivot.add(cube.cube)
                }
            }
        }

        this.layers = {};
        this.activeCubes = new Array();
        this.dirr = 1; // for CW vs CCW for solving
    }

    faceType(i, j, k) {
        var face = null;

        if (i == 1 && j == 1 && k == 0)
            face = "F";
        else if (i == 1 && j == 1 && k == 2)
            face = "B";
        else if (j == 1 && k == 1 && i == 0)
            face = "L";
        else if (j == 1 && k == 1 && i == 2)
            face = "R";
        else if (i == 1 && k == 1 && j == 0)
            face = "U";
        else if (i == 1 && k == 1 && j == 2)
            face = "D";

        return face;
    }

    makeLayer(dir, level) {
        this.currDir = dir;
        this.currLevel = level;

        this.currLayer = new THREE.Object3D();

        //side.position.set(-1*this.center.x, -1*this.center.y, -1*this.center.z);
        //side.rotation.set(0, 0, 0);
        this.currLayer.updateMatrixWorld();
        this.currLayer.rotation.set(0, 0, 0);
        //scene.add(this.currLayer);

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var coords;

                if(dir == "left")
                    coords = [level, i, j];
                else if (dir == "top")
                    coords = [i, level, j];
                else if (dir == "front")
                    coords = [i, j, level];

                var cube = this.getCube(coords[0], coords[1], coords[2]);

                this.activeCubes.push(cube);
                this.currLayer.attach(cube);
            }
        }
    }

    dissolveLayer() {
        if(this.currLayer != null) {
            scene.updateMatrixWorld();
            this.currLayer.updateMatrixWorld();

            while(this.activeCubes.length > 0) {
                var cube = this.activeCubes.pop();
                scene.attach(cube);
            }
        }
    }

    // init var to move and currAngle
    moveCurr() {
        if(this.state.spin[this.currDir][this.currLevel] == false) { 
            this.state.spin[this.currDir][this.currLevel] = true;
            this.state.currAngle = 0;
        }
    }

    // rotate whatever curr layer it is based on it's axis
    rotateCurrLayer() {
        if (this.currDir == "top") 
            this.currLayer.rotation.y += (this.state.speed * this.dirr);
        else if (this.currDir == "front") 
            this.currLayer.rotation.z += (this.state.speed * this.dirr);
        else if (this.currDir == "left") 
            this.currLayer.rotation.x += (this.state.speed * this.dirr);
    }

    solveNext() {
        if(keysPressed.length > 0) {
            var curr = keysPressed.shift(); // remove first in array
            console.log(curr);
            // TODO: THIS LOOKS WRONG ADD DISSOLVE CONDITION!
            this.dissolveLayer(); // only dissolve if new layer needed
            this.makeLayer(mapping[curr].dir, mapping[curr].layer)
            scene.add(this.currLayer);
            this.moveCurr();

            this.dirr = -1;
        } else {
            this.solve = false;
            this.dirr = 1;
        }
    }

    shuffleNext() {
        var maxMoves = 10; 

        if (this.shuffle.count < maxMoves) {
            var key = keys[Math.floor(Math.random() * keys.length)]; // index of random key
            this.currMove = mapping[key];

            if (this.prevMove == null || this.prevMove != this.currMove) {
                this.dissolveLayer(); // only dissolve if new layer needed
                this.makeLayer(this.currMove.dir, this.currMove.layer)
                scene.add(this.currLayer);
            }

            this.moveCurr();
            this.shuffle.count += 1;
        } else {
            this.shuffle = {
                on: false,
                count: 0,
                prev: null,
                curr: null
            }
        }
        
    }

    // layer rotation animation
    animate() {
        var dirs = ["top", "left", "front"];

        // stop rotation after 90deg
        if(this.state.currAngle >= (Math.PI / 2)) {
            for (var layer = 0; layer < 3; layer++)
                for (var i = 0; i < dirs.length; i++) {
                    this.state.spin[dirs[i]][layer] = false;

                    if(this.solve == true)
                        this.solveNext();
                    else if (this.shuffle.on == true) {
                        //wait(1000);
                        this.shuffleNext();
                    }

                }
        } else { // rotate 90deg
            for (var layer = 0; layer < 3; layer++) {
                for (var i = 0; i < dirs.length; i++) {
                    if(this.state.spin[dirs[i]][layer] == true) {
                        console.log("hello");
                        this.rotateCurrLayer();
                        this.state.currAngle += this.state.speed;
                    }
                }
            }
        }
    }

    getCube(x, y, z) {
        return this.rubik[x][y][z].cube;
    }

    getWhole() {
        this.layers["whole"] = new THREE.Group();
        var side = new THREE.Object3D();

        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var k = 0; k < 3; k++)
                    side.add(this.getCube(i, j, k));

        // negative of group's center
        side.position.set(4, -3, -5);
        this.layers["whole"].add(side);
    } 

    showCube() {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var k = 0; k < 3; k++)
                    scene.add(this.getCube(i, j, k));
    }
}
