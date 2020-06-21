var CW = -1 * TEST;
var CCW = TEST;
var RAD_90 = Math.PI * 0.5;
var RAD_45 = Math.PI * 0.25;
var TEST = Math.PI * 0.1;
var moves;
var mapping;

var count = 10;

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
                rubik.dissolveLayer(); // only dissolve if new layer needed
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

moves = {
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

mapping = {
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
