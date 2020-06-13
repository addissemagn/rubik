var colors = {
    "white": 0xffffff,
    "green": 0x00ff00,
    "red": 0xff0000,
    "yellow": 0xf00000,
    "orange": 0xff8c00
}

var x = [-8.5, -4, 0.5];
var y = [7.5, 3, -1.5];
var z = [5, 0.5, -4];

class Rubik {
    constructor() {
        var rubik = new Array();

        for (var i = 0; i < 3; i++) {
            rubik[i] = new Array();
            for (var j = 0; j < 3; j++) {
                rubik[i][j] = new Array();
                for (var k = 0; k < 3; k++) {
                    var cube = new Cube(i, j, k, colors.orange);
                    rubik[i][j][k] = cube; 
                    scene.add(cube.cube);
                }
            }
        }

        this.rubik = rubik;
        this.layers = {};
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

    // actually z axis
    getFrontBack() {
        this.layers["front"] = {};

        var l1 = new THREE.Object3D();
        var l2 = new THREE.Object3D();
        var l3 = new THREE.Object3D();

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                l1.add(this.getCube(i, j, 0));
                l2.add(this.getCube(i, j, 1));
                l3.add(this.getCube(i, j, 2));
            }
        }

        l1.position.set(4, -3, -5);
        l2.position.set(4, -3, -5);
        l3.position.set(4, -3, -5);

        this.layers["front"]["1"] = new THREE.Group();
        this.layers["front"]["2"] = new THREE.Group();
        this.layers["front"]["3"] = new THREE.Group();

        this.layers["front"]["1"].add(l1);
        this.layers["front"]["2"].add(l2);
        this.layers["front"]["3"].add(l3);
    }

    getLayers(dir = "top", x, y, z) {
        // top: x=i, y=LAY; z=j
        // negative of group's center
        var centers = {
            "top": {
                "x": 4,
                "y": -3,
                "z": -0.5
            }
        }

        this.layers[dir] = new Array();
        var l = new Array(); // each layer

        for (var i = 0; i < 3; i++) {
            l[i] = new THREE.Object3D();
            l[i].position.set(center.dir.x, center.dir.y, center.dir.z);
        }

        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var LAY = 0; LAY < 3; LAY++) // layer; i & j are the plane
                    l[LAY].add(this.getCube(i, LAY, j));

        for (var i = 0; i < 3; i++) {
            this.layers[dir][i] = new THREE.Group();
            this.layers[dir][i].add(l[i]);
        }
    }
    // y axis
    getTopBottom() {
        var dir = "top";

        // negative of group's center
        var center = {
            "x": 4,
            "y": -3,
            "z": -0.5
        }

        this.layers[dir] = new Array();
        var l = new Array(); // each layer

        for (var i = 0; i < 3; i++) {
            l[i] = new THREE.Object3D();
            l[i].position.set(center.x, center.y, center.z);
        }

        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                for (var LAY = 0; LAY < 3; LAY++) // layer; i & j are the plane
                    l[LAY].add(this.getCube(i, LAY, j));

        this.group = l[0];

        for (var i = 0; i < 3; i++) {
            this.layers[dir][i] = new THREE.Group();
            this.layers[dir][i].add(l[i]);
        }
    }

    // x axis
    getLeftRight() {
        this.layers["left"] = {};

        var l1 = new THREE.Object3D();
        var l2 = new THREE.Object3D();
        var l3 = new THREE.Object3D();

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                l1.add(this.getCube(0, i, j));
                l2.add(this.getCube(1, i, j));
                l3.add(this.getCube(2, i, j));
            }
        }

        // negative of groups center
        l1.position.set(4, -3, -0.5);
        l2.position.set(4, -3, -0.5);
        l3.position.set(4, -3, -0.5);

        this.layers["left"]["1"] = new THREE.Group();
        this.layers["left"]["2"] = new THREE.Group();
        this.layers["left"]["3"] = new THREE.Group();

        this.layers["left"]["1"].add(l1);
        this.layers["left"]["2"].add(l2);
        this.layers["left"]["3"].add(l3);
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

