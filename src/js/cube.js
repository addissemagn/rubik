class Cube {
    constructor(x, y, z, coords, dim, wireframe, transparent, face) {
        this.makeFaceColors(x, y, z, coords);

        var geometry = new THREE.BoxBufferGeometry(dim, dim, dim);
        var materials = new Array();
        var text = new Array();

        // make material and texture for each cube face
        for (var i = 0; i < 6; i++) {
            text[i] = (face != null && this.colTxt[i] != this.col.Bl[1]) 
                ? this.makeText(this.colTxt[i], face) : null;
            materials[i] = this.makeMaterial(text[i], this.colMat[i], transparent); 
        }

        this.cube = new THREE.Mesh(geometry, materials);
        this.cube.position.set(x, y, z);
        this.cube.rotation.set(0, 0, 0);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;

        // border around cube
        if(wireframe)
            this.cube.add(this.makeWireframe());
    }


    makeMaterial(text, color, transparent) {
        // only add color if no texture to avoid double layer of color
        var color = (text == null) ? color : null; 
        var map = (text == null) ? null : text.texture;

        var mat = new THREE.MeshBasicMaterial({ 
            color: color, 
            map: map,
            transparent: transparent,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        //mat.color.convertSRGBToLinear();
        return mat;
    }

    makeText(color, face) {
        var dim = 512; // in pixels
        var pos = (dim / 2) + 20; // center
        var text = new THREEx.DynamicTexture(dim, dim);
        text.context.font = "bolder 120px Verdana";
        text.texture.needsUpdate = true;
        text.clear(color).drawText(face, undefined, pos, 'black');

        return text;
    }

    makeWireframe() {
        var geo = new THREE.EdgesGeometry(this.cube.geometry);
        var mat = new THREE.LineBasicMaterial({ 
            color: 0x000000, 
            linewidth: 1
        });
        var wireframe = new THREE.LineSegments(geo, mat);
        wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd

        return wireframe;
    }

    makeFaceColors(x, y, z, coords) {
        var col = {
            "B": [0x6d9ad3, "#6d9ad3"],
            "G": [0x00ae69, "#00ae69"],
            "W": [0xf7fbff, "#f7fbff"],
            "Y": [0xffd21b, "#ffd21b"],
            "R": [0xee4d49, "#ee4d49"],
            "O": [0xeb7324, "#eb7324"],
            "Bl": [0x242423, "#242423"]
        }

        var max = {
            "x": coords.x[coords.x.length - 1],
            "y": coords.y[coords.y.length - 1],
            "z": coords.z[coords.z.length - 1]
        }

        var min = {
            "x": coords.x[0],
            "y": coords.y[0],
            "z": coords.z[0]
        }

        var colMat = new Array();   // material
        var colTxt = new Array();   // texture

        // init with all black
        var numCols = 6;
        while(numCols--) {
            colMat.push(col.Bl[0]);
            colTxt.push(col.Bl[1]);
        }

        // set face colors
        // white
        if(y == min.y) {
            colMat[2] = col.W[0];
            colTxt[2] = col.W[1];
        }

        // yellow
        if(y == max.y) {
            colMat[3] = col.Y[0];
            colTxt[3] = col.Y[1];
        }

        // green
        if(x == min.x) {
            colMat[1] = col.G[0];
            colTxt[1] = col.G[1];
        }

        // blue
        if(x == max.x) {
            colMat[0] = col.B[0];
            colTxt[0] = col.B[1];
        }

        // red
        if(z == min.z) {
            colMat[4] = col.R[0];
            colTxt[4] = col.R[1];
        }

        // orange
        if(z == max.z) {
            colMat[5] = col.O[0];
            colTxt[5] = col.O[1];
        }
        
        this.col = col;
        this.colMat = colMat;
        this.colTxt = colTxt;
    }

    show() {
        scene.add(this.cube);
    }

    getCube() {
        return this.cube;
    }
}


