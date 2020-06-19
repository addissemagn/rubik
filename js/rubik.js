// TODO:
// - dismantle groups without removing cube from scene

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
            speed: (Math.PI/50), // rotation speed
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

        this.solve = false;

        // center of rubik's cube
        this.center = {
            "x": -4,
            "y": 3,
            "z": 0.5
        }

        var cubeDim = 1; // side length of each cube
        var x = [this.center.x - cubeDim, this.center.x, this.center.x + cubeDim];
        var y = [this.center.y + cubeDim, this.center.y, this.center.y - cubeDim];
        var z = [this.center.z + cubeDim, this.center.z, this.center.z - cubeDim]

        this.rubik = new Array();

        // pivot for cube to rotate about
        var pivot = new THREE.Group();
        pivot.position.set(-1*this.center.x, -1*this.center.y, -1*this.center.z);
        scene.add(pivot);

        for (var i = 0; i < 3; i++) {
            this.rubik[i] = new Array();
            for (var j = 0; j < 3; j++) {
                this.rubik[i][j] = new Array();
                for (var k = 0; k < 3; k++) {
                    var cube = new Cube(x[i], y[j], z[k], cubeDim);
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

    makeLayer(dir, level) {
        this.currDir = dir;
        this.currLevel = level;

        var side = new THREE.Object3D();
        //side.position.set(-1*this.center.x, -1*this.center.y, -1*this.center.z);
        //side.rotation.set(0, 0, 0);
        side.updateMatrixWorld();

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
                side.attach(cube); // add cubes in this level to group
            }
        }

        //this.currLayer = new THREE.Group();
        //this.currLayer.add(side);

        this.currLayer = side;
    }

    dissolveLayer() {
        if(this.currLayer != null) {
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
            this.makeLayer(mapping[curr].dir, mapping[curr].layer)
            scene.add(this.currLayer);
            this.moveCurr();

            this.dirr = -1;
        }
    }

    // layer rotation animation
    animate() {
        var dirs = ["top", "left", "front"];

        // stop rotation after 90deg
        if(this.state.currAngle > (Math.PI / 2)) {
            for (var layer = 0; layer < 3; layer++)
                for (var i = 0; i < dirs.length; i++) {
                    this.state.spin[dirs[i]][layer] = false;

                    if(this.solve == true)
                        this.solveNext();
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
}

class Cube {
    constructor(x, y, z, dim) {
        var col = {
            "W": 0xf7fbff,
            "G": 0x00ae69,
            "R": 0xee4d49,
            "Y": 0xffd21b,
            "O": 0xeb7324,
            "B": 0x6d9ad3,
            "Bl": 0x242423
        }

        var col1 = {
            "W": 0xffffff,
            "G": 0x52b54a,
            "R": 0xc63029,
            "Y": 0xfff600,
            "O": 0xf17022,
            "B": 0x0363ae,
            "Bl": 0x242423
        }

        var col2 = {
            "W": 0xf9f9f9,
            "G": 0x82c91e,
            "R": 0xf25529,
            "Y": 0xecc504,
            "O": 0xfd8002,
            "B": 0x35a8bd,
            "Bl": 0x000000
        }

        var colors = [col.B, col.G, col.W, col.Y, col.R, col.O];
        var materials = new Array();

        for (var i = 0; i < 6; i++) {
            materials[i] = this.makeMaterial(colors[i]); // make materials for each face
        }

        var geometry = new THREE.BoxBufferGeometry(dim, dim, dim);

        this.cube = new THREE.Mesh(geometry, materials);
        this.cube.position.set(x, y, z);
        this.cube.rotation.set(0, 0, 0);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;

        // wireframe
        var geo = new THREE.EdgesGeometry(this.cube.geometry);
        var mat = new THREE.LineBasicMaterial({ 
            color: 0x000000, 
            linewidth: 1
        });
        var wireframe = new THREE.LineSegments(geo, mat);
        wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
        this.cube.add(wireframe);
    }

    makeMaterial(color) {
        var boxMat = new THREE.MeshBasicMaterial({ 
            color: color, 
            flatShading: true,
            side: THREE.DoubleSide
        });

        //mat.color.convertSRGBToLinear();
        return boxMat;

    }

    show() {
        scene.add(this.cube);
    }

    getCube() {
        return this.cube;
    }
}


