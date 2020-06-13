var colors = {
    "white": 0xffffff,
    "green": 0x00ff00,
    "red": 0xff0000,
    "yellow": 0xf00000
}

var x = [-8.5, -4, 0.5];
var y = [7.5, 3, -1.5];
var z = [5, 0.5, -4];

class Rubik {
    constructor() {
        var rubik = new Array();
        var mar = 0;
        this.side = new THREE.Object3D();

        for (var i = 0; i < 3; i++) {
            rubik[i] = new Array();
            for (var j = 0; j < 3; j++) {
                rubik[i][j] = new Array();
                for (var k = 0; k < 3; k++) {
                    rubik[i][j][k] = new Array();
                }
            }
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    var cube = new Cube(i, j, k, colors.red);
                    scene.add(cube.cube);
                    this.side.add(cube.cube);
                    rubik[i][j][k] = cube; 
                }
            }
        }
        this.rubik = rubik;
    }

    getSide() {
        return this.side;
    }

    setSidePosition(x, y, z) {
        this.side.position.set(x, y, z);
    }

    getCube(x, y, z) {
        return this.rubik[x][y][z].cube;
    }

}

class Cube {
    // create and draw box
    constructor(dx, dy, dz, color) {
        var len = 4;

        //var x = -8.5;
        //var y = 7.5;
        //var z = 5;
        var diff = 4;
        var margin = 0;

        var geo = new THREE.BoxGeometry(len, len, len);
        var mat = new THREE.MeshBasicMaterial({
            color: color
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

