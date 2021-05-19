/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/

//scene and objects
var scene, camera, light;
var skybox, skyboxMaterial, ground, groundMaterial, water, waterMesh;
var lane, laneMesh, laneMeshMat;
var rampMesh, rampMeshMat;
var island, islandMat;
var car, carMesh, carMeshMat;
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10, pinMesh;

//alphas for testing
var carMeshAlpha = 0;
var laneMeshAlpha = 0;
var rampMeshAlpha = 0;
var islandMeshAlpha = 0;
var islandMatAlpha = 1; //leave at 1
var pinMeshAlpha = 0;

//car variables
var speed = 0;
var accel = 1.4;
var decel = -.75;
var MAXSPEED = 20;

//object for multiple key presses
var map = {};

//physics info for pins and car
var pinPHYSICS = { mass: 5, restitution: 0.0 };
var carPHYSICS = { mass: 10, restitution: 0.0 };

//game variables
var overRamp = false; //for checking to see if user can alter car
var topFrame = true; //for checking first or second half of frame
var setup = false; // for setting up pins
var nextFrame = false;
var extraFrame = false;


var frameNum = 1;
var startTimer, endTimer;
var curRollCount = 0;
var score = 0;
var oneThrowAgo = 0; //for spare calculation
var twoThrowAgo = 0; //for spare/strike calculation
var threeThrowAgo = 0;
var remainingPins = [true, true, true, true, true, true, true, true, true, true];
var pinStanding = [true, true, true, true, true, true, true, true, true, true];

/*
 * Function to add all non moving objects to scene
 */
function addObjects() {
    /*
     * CREATE SKYBOX
     */
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    /*
     * CREATE GROUND
     */
    groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;

    ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene, false);
    ground.position.y = -1;
    ground.material = groundMaterial;

    /*
     * CREATE WATER AND MODIFIY PROPERTIES
     */
    waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
    water = new BABYLON.WaterMaterial("water", scene);
    water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
    water.windForce = -45;
    water.waveHeight = .5;
    water.windDirection = new BABYLON.Vector2(0, 1);
    water.waterColor = new BABYLON.Color3(0.6, 0.0, 0.6);
    water.colorBlendFactor = 0.3;
    water.bumpHeight = 0.1;
    water.waveLength = 0.1;

    // Add skybox and ground to the reflection and refraction
    water.addToRenderList(skybox);
    water.addToRenderList(ground);
    waterMesh.material = water;

    /*
     * CREATE LANE W/ RAMP & COLLISON BOXES FOR VEHICLE
     */
    //lane with ramp obj from blender
    BABYLON.SceneLoader.ImportMesh("Lane", "obj/", "lane.babylon", scene,
        function(newMeshes) {
            lane = newMeshes[0];
            lane.position = new BABYLON.Vector3(0, 3, -100);
            lane.scaling = new BABYLON.Vector3(30, 8, 120);
        });

    //lane mesh for collision
    laneMesh = BABYLON.MeshBuilder.CreateBox("laneMesh", { height: 10, width: 56, depth: 230 }, scene);
    laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
    laneMeshMat = new BABYLON.StandardMaterial(scene);
    laneMeshMat.alpha = laneMeshAlpha;
    laneMesh.material = laneMeshMat;
    //ramp mesh for collisions
    rampMesh = BABYLON.MeshBuilder.CreateBox("rampMesh", { height: 10, width: 56, depth: 70 }, scene);
    rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
    rampMesh.rotation.x = 31 * Math.PI / 40;
    rampMeshMat = new BABYLON.StandardMaterial(scene);
    rampMeshMat.alpha = rampMeshAlpha;
    rampMesh.material = rampMeshMat;

    /*
     * CREATE ISLAND FOR PINS
     */
    //island for collision and bounce
    islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, scene);
    islandMesh.position = new BABYLON.Vector3(0, 0, 170);
    islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", scene);
    islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    islandMeshMat.alpha = islandMeshAlpha;

    //island where pins pins sit on
    islandMesh.material = islandMeshMat;
    island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, scene);
    island.position = new BABYLON.Vector3(0, 0, 170);
    islandMat = new BABYLON.StandardMaterial("islandMat", scene);
    islandMat.alpha = islandMatAlpha;
    islandMat.diffuseTexture = new BABYLON.Texture("planks.jpg", scene);
    island.material = islandMat;

    //physics imposters
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, scene);
    islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, scene);
    laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, scene);
    rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, scene);
};
/*
 * Function to add all pins for next bowl
 */
function setupPins(pinsStanding) {
    //CREATE FAKE PIN COLLISION BOUNDS
    pinMesh = new BABYLON.StandardMaterial(scene);
    pinMesh.alpha = pinMeshAlpha;
    var pinDIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };

    //REAL PINS
    if (pinsStanding[0]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB1 = BABYLON.MeshBuilder.CreateCylinder("pinB1", pinDIM, scene);
                pinB1.position = new BABYLON.Vector3(0, 42, 148);
                pinB1.material = pinMesh;
                pinB1.physicsImpostor = new BABYLON.PhysicsImpostor(pinB1, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin1 = newMeshes[0];
                pin1.scaling = new BABYLON.Vector3(5, 5, 5);
                pin1.parent = pinB1;

            });
    };
    if (pinsStanding[1]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB2 = BABYLON.MeshBuilder.CreateCylinder("pinB2", pinDIM, scene);
                pinB2.position = new BABYLON.Vector3(-7.5, 42, 163);
                pinB2.material = pinMesh;
                pinB2.physicsImpostor = new BABYLON.PhysicsImpostor(pinB2, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin2 = newMeshes[0];
                pin2.scaling = new BABYLON.Vector3(5, 5, 5);
                pin2.parent = pinB2;
            });
    };
    if (pinsStanding[2]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB3 = BABYLON.MeshBuilder.CreateCylinder("pinB3", pinDIM, scene);
                pinB3.position = new BABYLON.Vector3(7.5, 42, 163);
                pinB3.material = pinMesh;
                pinB3.physicsImpostor = new BABYLON.PhysicsImpostor(pinB3, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin3 = newMeshes[0];
                pin3.scaling = new BABYLON.Vector3(5, 5, 5);
                pin3.parent = pinB3;
            });
    };
    if (pinsStanding[3]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB4 = BABYLON.MeshBuilder.CreateCylinder("pinB4", pinDIM, scene);
                pinB4.position = new BABYLON.Vector3(-15, 42, 178);
                pinB4.material = pinMesh;
                pinB4.physicsImpostor = new BABYLON.PhysicsImpostor(pinB4, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin4 = newMeshes[0];
                pin4.scaling = new BABYLON.Vector3(5, 5, 5);
                pin4.parent = pinB4;
            });
    };
    if (pinsStanding[4]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB5 = BABYLON.MeshBuilder.CreateCylinder("pinB5", pinDIM, scene);
                pinB5.position = new BABYLON.Vector3(0, 42, 178);
                pinB5.material = pinMesh;
                pinB5.physicsImpostor = new BABYLON.PhysicsImpostor(pinB5, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin5 = newMeshes[0];
                pin5.scaling = new BABYLON.Vector3(5, 5, 5);
                pin5.parent = pinB5;

            });
    };
    if (pinsStanding[5]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB6 = BABYLON.MeshBuilder.CreateCylinder("pinB6", pinDIM, scene);
                pinB6.position = new BABYLON.Vector3(15, 42, 178);
                pinB6.material = pinMesh;
                pinB6.physicsImpostor = new BABYLON.PhysicsImpostor(pinB6, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin6 = newMeshes[0];
                pin6.scaling = new BABYLON.Vector3(5, 5, 5);
                pin6.parent = pinB6;
            });
    };
    if (pinsStanding[6]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB7 = BABYLON.MeshBuilder.CreateCylinder("pinB7", pinDIM, scene);
                pinB7.position = new BABYLON.Vector3(-22.5, 42, 193);
                pinB7.material = pinMesh;
                pinB7.physicsImpostor = new BABYLON.PhysicsImpostor(pinB7, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin7 = newMeshes[0];
                pin7.scaling = new BABYLON.Vector3(5, 5, 5);
                pin7.parent = pinB7;
            });
    };
    if (pinsStanding[7]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB8 = BABYLON.MeshBuilder.CreateCylinder("pinB8", pinDIM, scene);
                pinB8.position = new BABYLON.Vector3(-7.5, 42, 193);
                pinB8.material = pinMesh;
                pinB8.physicsImpostor = new BABYLON.PhysicsImpostor(pinB8, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin8 = newMeshes[0];
                pin8.scaling = new BABYLON.Vector3(5, 5, 5);
                pin8.parent = pinB8;
            });
    };
    if (pinsStanding[8]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB9 = BABYLON.MeshBuilder.CreateCylinder("pinB9", pinDIM, scene);
                pinB9.position = new BABYLON.Vector3(7.5, 42, 193);
                pinB9.material = pinMesh;
                pinB9.physicsImpostor = new BABYLON.PhysicsImpostor(pinB9, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin9 = newMeshes[0];
                pin9.scaling = new BABYLON.Vector3(5, 5, 5);
                pin9.parent = pinB9;
            });
    };
    if (pinsStanding[9]) {
        BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", scene,
            function(newMeshes) {
                pinB10 = BABYLON.MeshBuilder.CreateCylinder("pinB10", pinDIM, scene);
                pinB10.position = new BABYLON.Vector3(22.5, 42, 193);
                pinB10.material = pinMesh;
                pinB10.physicsImpostor = new BABYLON.PhysicsImpostor(pinB10, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, scene);
                pin10 = newMeshes[0];
                pin10.scaling = new BABYLON.Vector3(5, 5, 5);
                pin10.parent = pinB10;
            });
    };
    setup = true;
};

/*
 * Function to remove all pins for next bowl
 */
function cleanupPins() {
    setup = false;

    pinB1.dispose();
    pin1.dispose();
    pinB2.dispose();
    pin2.dispose();
    pinB3.dispose();
    pin3.dispose();
    pinB4.dispose();
    pin4.dispose();
    pinB5.dispose();
    pin5.dispose();
    pinB6.dispose();
    pin6.dispose();
    pinB7.dispose();
    pin7.dispose();
    pinB8.dispose();
    pin8.dispose();
    pinB9.dispose();
    pin9.dispose();
    pinB10.dispose();
    pin10.dispose();
};

/*
 * Function to add car to scene
 */
//create bounding box for physics engine
function addCar() {
    overRamp = false;
    carMesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 10.0 }, scene);
    carMesh.position = new BABYLON.Vector3(0, 18, -180);
    carMeshMat = new BABYLON.StandardMaterial(scene);
    carMeshMat.alpha = carMeshAlpha;
    carMeshMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    carMesh.material = carMeshMat;
    //load in car from blender
    BABYLON.SceneLoader.ImportMesh("Car", "obj/", "car.babylon", scene,
        function(newMeshes) {
            car = newMeshes[0];
            car.scaling = new BABYLON.Vector3(3, 3, 5);
            //car.position = new BABYLON.Vector3(0, 16, -180);
            car.position = carMesh.getAbsolutePosition();
        });
    carMesh.physicsImpostor = new BABYLON.PhysicsImpostor(carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, scene);


};

/*
 * Function to run all game logic
 */
function rmCar() {
    carMesh.dispose();
    car.dispose();
};

/*
 * Function to run all game logic
 */
function gameLogic() {

    /*
     * SETUP UP ACTION MANAGER
     */
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

    /*********************************************************************************************************/
    /************************************ BASIC GAME/FRAME IMPLEMENTATION*************************************/
    /*********************************************************************************************************/
    scene.registerAfterRender(function() {
        if (topFrame && !setup && (frameNum < 11 || extraFrame)) {
            if (extraFrame) {
                extraFrame = false;
            };
            console.log("Frame Num: " + frameNum + "\nTop Frame: " + topFrame);
            addCar();
            camera.position = new BABYLON.Vector3(0, 40, -250);
            camera.lockedTarget = carMesh.getAbsolutePosition();
            setup = true;
            setupPins(pinStanding);
        }
        if (!topFrame && !setup && (frameNum < 11 || extraFrame)) {
            if (extraFrame) {
                extraFrame = false;
            };
            console.log("Frame Num: " + frameNum + "\nTop Frame: " + topFrame)
            addCar();
            camera.position = new BABYLON.Vector3(0, 40, -250);
            camera.lockedTarget = carMesh.getAbsolutePosition();
            setup = true;
            setupPins(remainingPins);
        }
        if (carMesh.getAbsolutePosition().z > 25 && !overRamp && setup) {
            overRamp = true;
            startTimer = new Date();
        };
        if (!overRamp) {
            /*
             *  input for motion
             */
            if (map["w"] || map["W"]) {
                speed += accel;
                if (speed > MAXSPEED) {
                    speed = MAXSPEED;
                };
                if (speed < 0) {
                    speed = 0;
                };
                var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
                carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition()); //impulse at center of mass;
            };
            if (map["a"] || map["A"]) {
                if (carMesh.getAbsolutePosition().x > -32) {
                    carMesh.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
                };
            };

            if (map["d"] || map["D"]) {
                if (carMesh.getAbsolutePosition().x < 32) {
                    carMesh.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
                };
            };
        } else // wait till timer is done then count pins
        {
            camera.position = new BABYLON.Vector3(-45, 120, -20);
            camera.lockedTarget = islandMesh.getAbsolutePosition();
            endTimer = new Date();
            if ((endTimer - startTimer) >= 10000) {
                if (remainingPins[0] == true) {
                    //check if pinBx.getAbsolutePivotPoint().z is > 20 if so add to counter
                    if (pinB1.getAbsolutePosition().y < 25.0 || pinB1.getAbsolutePosition().y > 27.0) {
                        remainingPins[0] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[1] == true) {
                    if (pinB2.getAbsolutePosition().y < 25.0 || pinB2.getAbsolutePosition().y > 27.0) {
                        remainingPins[1] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[2] == true) {
                    if (pinB3.getAbsolutePosition().y < 25.0 || pinB3.getAbsolutePosition().y > 27.0) {
                        remainingPins[2] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[3] == true) {
                    if (pinB4.getAbsolutePosition().y < 25.0 || pinB4.getAbsolutePosition().y > 27.0) {
                        remainingPins[3] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[4] == true) {
                    if (pinB5.getAbsolutePosition().y < 25.0 || pinB5.getAbsolutePosition().y > 27.0) {
                        remainingPins[4] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[5] == true) {
                    if (pinB6.getAbsolutePosition().y < 25.0 || pinB6.getAbsolutePosition().y > 27.0) {
                        remainingPins[5] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[6] == true) {
                    if (pinB7.getAbsolutePosition().y < 25.0 || pinB7.getAbsolutePosition().y > 27.0) {
                        remainingPins[6] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[7] == true) {
                    if (pinB8.getAbsolutePosition().y < 25.0 || pinB8.getAbsolutePosition().y > 27.0) {
                        remainingPins[7] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[8] == true) {
                    if (pinB9.getAbsolutePosition().y < 25.0 || pinB9.getAbsolutePosition().y > 27.0) {
                        remainingPins[8] = false;
                        curRollCount += 1;
                    };
                };
                if (remainingPins[9] == true) {
                    if (pinB10.getAbsolutePosition().y < 25.0 || pinB10.getAbsolutePosition().y > 27.0) {
                        remainingPins[9] = false;
                        curRollCount += 1;
                    };
                };
                /*
                 * changing states
                 */
                if (frameNum == 11) //top of 11th frame
                {
                    rmCar();
                    cleanupPins();
                    topFrame = true;
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                };
                if (!topFrame && frameNum == 10) //bot of 10th frame
                {
                    rmCar();
                    cleanupPins();
                    topFrame = true;
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                    if ((twoThrowAgo + oneThrowAgo) == 10 || oneThrowAgo == 10) {
                        extraFrame = true;
                    };
                };
                if (topFrame && frameNum == 10) //top of 10th frame
                {
                    rmCar();
                    cleanupPins();
                    topFrame = false;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                    if (oneThrowAgo == 10) {
                        extraFrame = true;
                    };
                };
                if (!topFrame && frameNum != 10) //bot of frame
                {
                    rmCar();
                    cleanupPins();
                    topFrame = true;
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                    nextFrame = true;
                };
                if (topFrame && curRollCount < 10 && !nextFrame && frameNum != 10) //top of frame and not a strike
                {
                    rmCar();
                    cleanupPins();
                    topFrame = false;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                };
                if (topFrame && curRollCount == 10 && !nextFrame && frameNum != 10) //top of a frame and a strike continue to next frame;
                {
                    rmCar();
                    cleanupPins();
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;

                };
                nextFrame = false;

                /*
                 * calculate score
                 */
                if (threeThrowAgo == 10 && frameNum != 12) //threw a strike three throws ago so calulate
                {
                    score += 10 + twoThrowAgo + oneThrowAgo;
                };
                if ((threeThrowAgo + twoThrowAgo) == 10 && threeThrowAgo != 10 && twoThrowAgo != 10 && !topFrame) //threw a spare so calculate
                {
                    score += 10 + oneThrowAgo;
                };
                if (topFrame && frameNum < 11) {
                    remainingPins = [true, true, true, true, true, true, true, true, true, true];
                    if ((twoThrowAgo + oneThrowAgo) != 10 && oneThrowAgo != 10) //no strike on last throw and didnt just pick up spare
                    {
                        score += twoThrowAgo + oneThrowAgo;
                    };
                };
                if (topFrame && frameNum == 11) //score of 10th frame
                {
                    if ((twoThrowAgo + oneThrowAgo) == 10 && oneThrowAgo != 10) //no strike on last throw but pick up spare
                    {
                        score += 10 + twoThrowAgo + oneThrowAgo;
                    };
                    if (oneThrowAgo == 10) {
                        score += 10 + oneThrowAgo
                    };
                };
                if (topFrame && frameNum == 12) // if got the extra frame
                {
                    if ((threeThrowAgo + twoThrowAgo + oneThrowAgo) == 30) {
                        score += 30;
                        threeThrowAgo = 0;
                        twoThrowAgo = 0;
                        oneThrowAgo = 0;
                    };
                    if (threeThrowAgo == 10) {
                        score += 10 + twoThrowAgo + oneThrowAgo;
                        threeThrowAgo = 0;
                        twoThrowAgo = 0;
                        oneThrowAgo = 0;
                    };
                    if (twoThrowAgo == 10) {
                        score += twoThrowAgo + oneThrowAgo;
                        threeThrowAgo = 0;
                        twoThrowAgo = 0;
                        oneThrowAgo = 0;
                    };
                    if (oneThrowAgo > 0) {
                        score += oneThrowAgo;
                        threeThrowAgo = 0;
                        twoThrowAgo = 0;
                        oneThrowAgo = 0;
                    }
                };
                console.log("Pins knocked down: " + oneThrowAgo + "\nTotal Score: " + score);
            };
        };;
        if ((speed + decel) > 0) {
            speed += decel;
            var ImpulseVector = new BABYLON.Vector3(0, 0, decel);
            carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition());
        };
    });
    console.log("Total Score: " + score);
};
//create scene
var createScene = function() {
    scene = new BABYLON.Scene(engine);
    /*
     * CREATE CAMERA & LIGHTING
     */
    //left view
    //camera =  new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-125, 50, -125), scene);
    //behind view
    //camera =  new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 50, -250), scene);
    //top view
    camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 45, -200), scene);
    //ARCROTATE Camera
    //camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), scene);
    light.intensity = .7;
    /*
     * CREATE PHYSICS ENGINE
     */
    var forceVector = new BABYLON.Vector3(0, -60, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(forceVector, physicsPlugin);

    addObjects();
    gameLogic();

    return scene;
}