// process:
// initially i make the whole group and show it
// say i wanna rotate Up or Down
// then i need to make the Up or Down groups
// rotate the one wanted
// ! is this needed or can i just restart the process -> dismantle the up/down groups

var colors = {
    "W": 0xffffff,
    "G": 0x00ff00,
    "R": 0xff0000,
    "Y": 0xf00000,
    "O": 0xff8c00
}

var x = [-8.5, -4, 0.5];
var y = [7.5, 3, -1.5];
var z = [5, 0.5, -4];

// F, Fr - front
// B, Br - back
// U, Ur - up
// D, Dr - down
// L, Lr - left
// R, Rr - right

class Rubik {
    constructor() {
        this.state = {
            currAngle: 0,
            speed: (Math.PI/50),
            spin: {
                "top": {
                    0: false,
                    1: false,
                    2: false
                },
                "left": {
                    0: false,
                    1: false,
                    2: false
                },
                "front": {
                    0: false,
                    1: false,
                    2: false
                } 
            },
        };

        this.makeFace = {};

        this.center = {
            "top": { // y
                "x": 4,
                "y": -3,
                "z": -0.5
            },
            "left": { // x
                "x": 4,
                "y": -3,
                "z": -0.5
            },
            "front" : { // z
                "x": 4,
                "y": -3,
                "z": -0.5
            }
        }

        this.rubik = new Array();

        for (var i = 0; i < 3; i++) {
            this.rubik[i] = new Array();
            for (var j = 0; j < 3; j++) {
                this.rubik[i][j] = new Array();
                for (var k = 0; k < 3; k++) {
                    var cube = new Cube(i, j, k, colors.O);
                    this.rubik[i][j][k] = cube; 
                    scene.add(cube.cube);
                }
            }
        }

        this.layers = {};

        // TODO: reevaluate
        this.makeFace["top"] = this.getTopBottom;
        this.makeFace["front"] = this.getFrontBack;
        this.makeFace["left"] = this.getLeftRight;
    }

    // if layer not already rotating, initiate rotation
    makeMove(move) {
        if(this.state.spin[move.dir][move.layer] == false) {
            this.state.spin[move.dir][move.layer] = true;
            this.state.currAngle = 0;
        }
    }

    animate() {
        var dirs = ["top", "left", "front"];

        // stop rotation after 90deg
        if(this.state.currAngle > (Math.PI / 2)) {
            for (var layer = 0; layer < 3; layer++)
                for (var i = 0; i < 1; i++) {
                    this.state.spin[dirs[i]][layer] = false;
                    //rotationReset();
                }
        } else { // rotate 90deg
            for (var layer = 0; layer < 3; layer++) {
                for (var i = 0; i < 3; i++) {
                    if(this.state.spin[dirs[i]][layer] == true) {
                        console.log("hello");
                        this.rotateLayer(dirs[i], layer, this.state.speed);
                        this.state.currAngle += this.state.speed;
                    }
                }
            }
        }
    }

    rotateLayer(dir, layer, angle) {
        if (dir == "top") 
            this.layers[dir][layer].rotation.y += angle;
        else if (dir == "front") 
            this.layers[dir][layer].rotation.z += angle;
        else if (dir == "left") 
            this.layers[dir][layer].rotation.x += angle;
    }

    rotationReset() {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var k = 0; k < 3; k++)
                    this.cube.rotation.set(0, 0, 0);
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

    makeLayers(dir) {
        this.layers[dir] = new Array();
        var l = new Array(); // each layer

        for (var i = 0; i < 3; i++) {
            l[i] = new THREE.Object3D();
            l[i].position.set(this.center[dir].x, this.center[dir].y, this.center[dir].z);
        }

        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var LAY = 0; LAY < 3; LAY++) { // i & j are the plane cords, LAY is layer
                    if (dir == "left") // x axis
                        l[LAY].add(this.getCube(LAY, i, j));
                    else if (dir == "top") // y axix
                        l[LAY].add(this.getCube(i, LAY, j));
                    else if (dir == "front") // z axis
                        l[LAY].add(this.getCube(i, j, LAY));
                }

        this.group = l[0];

        for (var i = 0; i < 3; i++) {
            this.layers[dir][i] = new THREE.Group();
            this.layers[dir][i].add(l[i]);
        }
    }
}

class Cube {
    // create and draw box
    constructor(dx, dy, dz, color) {
        var len = 4;

        var diff = 4;
        var margin = 0;

        var geo = new THREE.BoxGeometry(len, len, len);
        var mat = new THREE.MeshLambertMaterial({
            color: color,
            wireframe: false
        });
        this.cube = new THREE.Mesh(geo, mat);

        this.cube.position.set(x[dx], y[dy], z[dz]);
        //this.cube.position.set(x + (dx*diff + margin), y - (dy*diff + margin), z);
        this.cube.rotation.set(0, 0, 0);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
    }

    show() {
        scene.add(this.cube);
    }

    getCube() {
        return this.cube;
    }
}

