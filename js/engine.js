/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/

const canvas = document.getElementById("renderCanvas");

var currScene = 0;
var state = 0;
var carSelectNum = 0;
var mainMenuScene, carSelectScene, gameScene;
var bgLayer, playBtn, nextBtn, prevBtn, selectBtn, cam, light;
var car1Angle = 210,
    car2Angle = 330,
    car3Angle = 90,
    radius = 2.5;

//temp objs for car select
var pill, cube, cone;
var carsArray = [pill, cube, cone];

var car, carMesh;

//game and score variables
var frameGUI, scoreGUI;
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

//pin variables
var remainingPins = [true, true, true, true, true, true, true, true, true, true];
var pinStanding = [true, true, true, true, true, true, true, true, true, true];
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10, pinMesh;
var pinMeshAlpha = 0;
var pinArray = [pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10];
var pinBArray = [pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10];

//car variables
var speed = 0;
var accel = 1.4;
var decel = -.75;
var MAXSPEED = 20;

//physics info for pins and car
var pinPHYSICS = { mass: 5, restitution: 0.0 };
var carPHYSICS = { mass: 10, restitution: 0.0 };

var degToRadians = function(degrees) {
    var radians = degrees * Math.PI / 180;
    return radians;
};

var rotateCarSelectionPrev = function() {
    car1Angle += 120;
    car2Angle += 120;
    car3Angle += 120;
    carSelectNum = (carSelectNum - 1) % 3;

    cube.position.x = Math.cos(degToRadians(car1Angle)) * radius;
    cube.position.z = Math.sin(degToRadians(car1Angle)) * radius - 1;
    cone.position.x = Math.cos(degToRadians(car2Angle)) * radius;
    cone.position.z = Math.sin(degToRadians(car2Angle)) * radius - 1;
    pill.position.x = Math.cos(degToRadians(car3Angle)) * radius;
    pill.position.z = Math.sin(degToRadians(car3Angle)) * radius - 1;
};

var rotateCarSelectionNext = function() {
    car1Angle -= 120;
    car2Angle -= 120;
    car3Angle -= 120;
    carSelectNum = (carSelectNum + 1) % 3;

    cube.position.x = Math.cos(degToRadians(car1Angle)) * radius;
    cube.position.z = Math.sin(degToRadians(car1Angle)) * radius - 1;
    cone.position.x = Math.cos(degToRadians(car2Angle)) * radius;
    cone.position.z = Math.sin(degToRadians(car2Angle)) * radius - 1;
    pill.position.x = Math.cos(degToRadians(car3Angle)) * radius;
    pill.position.z = Math.sin(degToRadians(car3Angle)) * radius - 1;
};

var formatBtn = function(button) {
    button.width = "35%";
    button.height = "10%";
    button.color = "white";
    button.alpha = .8;
    button.cornerRadius = 20;
    button.background = "blue";
    button.fontSize = "50px";
    button.children[0].color = "white";
};

var formatTextGUI = function(textGUI) {
    textGUI.width = "35%";
    textGUI.height = "10%";
    textGUI.color = "white";
    textGUI.cornerRadius = 20;
    textGUI.background = "green";
    textGUI.fontSize = 24;
};

var createMainMenuScene = function() {
    mainMenuScene = new BABYLON.Scene(engine);
    mainMenuScene.createDefaultCameraOrLight(true, true, true);

    bgLayer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/bg.png', mainMenuScene, true);

    mainMenuGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, mainMenuScene);
    playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
    formatBtn(playBtn);
    playBtn.top = "42%";
    playBtn.onPointerUpObservable.add(function() {
        currScene = 1;
    });
    mainMenuGUI.addControl(playBtn);

    return mainMenuScene;
};

var createCarSelectScene = function() {
    carSelectScene = new BABYLON.Scene(engine);

    carSelectScene.clearColor = new BABYLON.Color3.Purple();
    cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 10, 2), carSelectScene);
    cam.lockedTarget = new BABYLON.Vector3.Zero();
    cam.attachControl(canvas, true);
    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), carSelectScene);

    cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, carSelectScene);
    cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop: .25, height: 1, tessellation: 24 }, carSelectScene);
    pill = new BABYLON.Mesh.CreateCapsule('pill', { radius: 0.5, height: 2 }, carSelectScene)
    cube.position.x = Math.cos(degToRadians(car1Angle)) * radius;
    cube.position.z = Math.sin(degToRadians(car1Angle)) * radius - 1;
    cone.position.x = Math.cos(degToRadians(car2Angle)) * radius;
    cone.position.z = Math.sin(degToRadians(car2Angle)) * radius - 1;
    cone.rotation.x = 90;
    cone.rotation.z = 90;
    pill.position.x = Math.cos(degToRadians(car3Angle)) * radius;
    pill.position.z = Math.sin(degToRadians(car3Angle)) * radius - 1;
    pill.rotation.x = 90;
    pill.rotation.z = -90;

    carSelectScene.registerBeforeRender(function() {
        cube.rotation.y += .005;
        cone.rotation.y += .005;
        pill.rotation.y += .005;
    });

    carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, carSelectScene);
    nextBtn = BABYLON.GUI.Button.CreateSimpleButton("nextBtn", ">");
    prevBtn = BABYLON.GUI.Button.CreateSimpleButton("prevBtn", "<");
    selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select");
    backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "<");
    formatBtn(nextBtn);
    formatBtn(prevBtn);
    nextBtn.width = "10%";
    nextBtn.top = "20%";
    nextBtn.left = "30%";
    prevBtn.width = "10%";
    prevBtn.top = "20%";
    prevBtn.left = "-30%";
    formatBtn(selectBtn);
    selectBtn.top = "42%";
    formatBtn(backBtn);
    backBtn.top = "-42%";
    backBtn.left = "-42%";
    backBtn.width = "15%";

    prevBtn.onPointerUpObservable.add(function() {
        rotateCarSelectionPrev();
    });

    nextBtn.onPointerUpObservable.add(function() {
        rotateCarSelectionNext();
    });

    backBtn.onPointerUpObservable.add(function() {
        currScene = 0;
    });

    selectBtn.onPointerUpObservable.add(function() {
        currScene = 2;
    });

    carSelectGUI.addControl(nextBtn);
    carSelectGUI.addControl(prevBtn);
    carSelectGUI.addControl(selectBtn);
    carSelectGUI.addControl(backBtn);

    return carSelectScene;
};

var createGameGUI = function() {
    var gameGUI, scoreOUTLINE, frameOUTLINE;

    gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    frameGUI = new BABYLON.GUI.TextBlock();
    scoreGUI = new BABYLON.GUI.TextBlock();

    scoreOUTLINE = BABYLON.GUI.Button.CreateSimpleButton("sOUTLINE", ""); //Morph into textblock?
    frameOUTLINE = BABYLON.GUI.Button.CreateSimpleButton("fOUTLINE", ""); //Morph into textblock?

    formatTextGUI(frameGUI);
    formatTextGUI(scoreGUI);
    formatBtn(scoreOUTLINE);
    formatBtn(frameOUTLINE);
    frameGUI.text = "Frame: ^X";
    frameGUI.top = "-40%";
    frameGUI.left = "40%";
    scoreGUI.text = "Score: Y";
    scoreGUI.top = "-45%";
    scoreGUI.left = "40%";

    scoreOUTLINE.top = "-40%";
    scoreOUTLINE.left = "40%";
    scoreOUTLINE.height = "5%";
    scoreOUTLINE.width = "20%";
    frameOUTLINE.top = "-45%";
    frameOUTLINE.left = "40%";
    frameOUTLINE.height = "5%";
    frameOUTLINE.width = "20%";

    gameGUI.addControl(scoreOUTLINE);
    gameGUI.addControl(frameOUTLINE);
    gameGUI.addControl(frameGUI);
    gameGUI.addControl(scoreGUI);
};

var addStationaryObjects = function() {
    //Function to add all non moving objects to scene

    //scene and objects
    var skybox, skyboxMaterial, ground, groundMaterial, water, waterMesh;
    var lane, laneMesh, laneMeshMat;
    var rampMesh, rampMeshMat;
    var island, islandMat;
    //alphas for testing
    var laneMeshAlpha = 1;
    var rampMeshAlpha = 1;
    var islandMeshAlpha = 0;
    var islandMatAlpha = 1; //leave at 1

    var planksTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/planks.jpg", gameScene);

    // Skybox
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, gameScene);
    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", gameScene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/TropicalSunnyDay", gameScene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Ground
    groundMaterial = new BABYLON.StandardMaterial("groundMaterial", gameScene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/ground.jpg", gameScene);
    groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
    ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, gameScene, false);
    ground.position.y = -1;
    ground.material = groundMaterial;

    // Water
    waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, gameScene, false);
    water = new BABYLON.WaterMaterial("water", gameScene);
    water.bumpTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/waterbump.png", gameScene);
    water.windForce = -45;
    water.waveHeight = .5;
    water.windDirection = new BABYLON.Vector2(0, 1);
    water.waterColor = new BABYLON.Color3(0.6, 0.0, 0.6);
    water.colorBlendFactor = 0.3;
    water.bumpHeight = 0.1;
    water.waveLength = 0.1;

    water.addToRenderList(ground);
    waterMesh.material = water;

    //CREATE LANE W/ RAMP & COLLISON BOXES FOR VEHICLE
    //lane with ramp obj from blender
    /*
    BABYLON.SceneLoader.ImportMesh("lane", "obj/", "lane.babylon", gameScene,
        function(meshes) {
            lane = meshes[0];
            lane.position = new BABYLON.Vector3(0, 3, -100);
            lane.scaling = new BABYLON.Vector3(30, 8, 120);
        });
    */

    //lane mesh for collision
    laneMesh = BABYLON.MeshBuilder.CreateBox("laneMesh", { height: 10, width: 56, depth: 230 }, gameScene);
    laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
    laneMeshMat = new BABYLON.StandardMaterial(gameScene);
    laneMeshMat.alpha = laneMeshAlpha;
    laneMeshMat.diffuseTexture = planksTexture;
    laneMesh.material = laneMeshMat;

    //ramp mesh for collisions
    rampMesh = BABYLON.MeshBuilder.CreateBox("rampMesh", { height: 10, width: 56, depth: 70 }, gameScene);
    rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
    rampMesh.rotation.x = 31 * Math.PI / 40;
    rampMeshMat = new BABYLON.StandardMaterial(gameScene);
    rampMeshMat.alpha = rampMeshAlpha;
    rampMeshMat.diffuseTexture = planksTexture;
    rampMesh.material = rampMeshMat;

    //CREATE ISLAND FOR PINS
    //island for collision and bounce
    islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, gameScene);
    islandMesh.position = new BABYLON.Vector3(0, 0, 170);
    islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", gameScene);
    islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    islandMeshMat.alpha = islandMeshAlpha;
    islandMesh.material = islandMeshMat;

    //island where pins pins sit on
    island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
    island.position = new BABYLON.Vector3(0, 0, 170);
    islandMat = new BABYLON.StandardMaterial("islandMat", gameScene);
    islandMat.alpha = islandMatAlpha;
    islandMat.diffuseTexture = planksTexture;
    island.material = islandMat;

    //physics imposters
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
};

//Function to add car to scene
var addCar = function() {
    var carMeshMat;
    var carMeshAlpha = 1;

    overRamp = false;
    //create bounding box for physics engine
    carMesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 10.0 }, gameScene);
    carMesh.position = new BABYLON.Vector3(0, 18, -180);
    carMeshMat = new BABYLON.StandardMaterial(gameScene);
    carMeshMat.alpha = carMeshAlpha;
    carMeshMat.diffuseColor = new BABYLON.Color3(0, 180, 0);
    carMesh.material = carMeshMat;

    //load in car from blender
    BABYLON.SceneLoader.ImportMesh("car", "obj/", "car.babylon", gameScene,
        function(newMeshes) {
            car = newMeshes[0];
            car.scaling = new BABYLON.Vector3(3, 3, 5);
            //car.position = new BABYLON.Vector3(0, 16, -180);
            car.position = carMesh.getAbsolutePosition();
        });

    carMesh.physicsImpostor = new BABYLON.PhysicsImpostor(carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, gameScene);

};

//Function to run all game logic
var rmCar = function() {
    carMesh.dispose();
    car.dispose(); //TODO ENABLE WITH BLENDERIMPORT
};

//Function to add all pins for next bowl
var setupPins = function(pinsStanding) {

    //CREATE FAKE PIN COLLISION BOUNDS
    pinMesh = new BABYLON.StandardMaterial(gameScene);
    pinMesh.alpha = pinMeshAlpha;
    var pinDIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };

    //REAL PINS
    for (var i = 0; i < pinsStanding.length; i = i + 1) {
        if (pinsStanding[i]) {
            BABYLON.SceneLoader.ImportMesh("Pin", "obj/", "pin.babylon", gameScene,
                function(newMeshes) {
                    pinBArray[i] = BABYLON.MeshBuilder.CreateCylinder("pin", pinDIM, gameScene);
                    switch (i) {
                        case 0:
                            pinBArray[i].position = new BABYLON.Vector3(0, 42, 148);
                            break;
                        case 1:
                            pinBArray[i].position = new BABYLON.Vector3(-7.5, 42, 163);
                            break;
                        case 2:
                            pinBArray[i].position = new BABYLON.Vector3(7.5, 42, 163);
                            break;
                        case 3:
                            pinBArray[i].position = new BABYLON.Vector3(-15, 42, 178);
                            break;
                        case 4:
                            pinBArray[i].position = new BABYLON.Vector3(0, 42, 178);
                            break;
                        case 5:
                            pinBArray[i].position = new BABYLON.Vector3(15, 42, 178);
                            break;
                        case 6:
                            pinBArray[i].position = new BABYLON.Vector3(-22.5, 42, 193);
                            break;
                        case 7:
                            pinBArray[i].position = new BABYLON.Vector3(-7.5, 42, 193);
                            break;
                        case 8:
                            pinBArray[i].position = new BABYLON.Vector3(7.5, 42, 193);
                            break;
                        case 9:
                            pinBArray[i].position = new BABYLON.Vector3(22.5, 42, 193);
                            break;
                    }
                    pinBArray[i].material = pinMesh;
                    pinBArray[i].physicsImpostor = new BABYLON.PhysicsImpostor(pinBArray[i], BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                    pinArray[i] = newMeshes[0];
                    pinArray[i].scaling = new BABYLON.Vector3(5, 5, 5);
                    pinArray[i].parent = pinBArray[i];

                });
        };
    }
    setup = true;
};

//Function to remove all pins for next bowl
function cleanupPins() {
    setup = false;
    for (var i = 0; i < pinArray.length; i = i + 1) {
        pinArray[i].dispose();
    }

    for (var j = 0; j < pinBArray.length; j = j + 1) {
        pinBArray[j].dispose();
    }
};

var addGameLogic = function() {

    //object for multiple key presses
    var map = {};

    //SETUP UP ACTION MANAGER
    gameScene.actionManager = new BABYLON.ActionManager(gameScene);
    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

    /*********************************************************************************************************/
    /************************************ BASIC GAME/FRAME IMPLEMENTATION*************************************/
    /*********************************************************************************************************/
    gameScene.registerAfterRender(function() {
        if (topFrame && !setup && (frameNum < 11 || extraFrame)) {
            if (extraFrame) {
                extraFrame = false;
            };
            addCar();
            cam.position = new BABYLON.Vector3(0, 40, -250);
            cam.lockedTarget = carMesh.getAbsolutePosition();
            setup = true;
            setupPins(pinStanding);
        };
        if (!topFrame && !setup && (frameNum < 11 || extraFrame)) {
            if (extraFrame) {
                extraFrame = false;
            };
            addCar();
            cam.position = new BABYLON.Vector3(0, 40, -250);
            cam.lockedTarget = carMesh.getAbsolutePosition();
            setup = true;
            setupPins(remainingPins);
        };
        if (carMesh.getAbsolutePosition().z > 25 && !overRamp && setup) {
            overRamp = true;
            startTimer = new Date();
        };
        if (!overRamp) {
            //input for motion
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
        } else { // wait till timer is done then count pins
            cam.position = new BABYLON.Vector3(-45, 120, -20);
            cam.lockedTarget = islandMesh.getAbsolutePosition();
            endTimer = new Date();
            if ((endTimer - startTimer) >= 10000) { //CALCULATE SCORE
                for (var i = 0; i < remainingPins.length; i = i + 1) {
                    if (remainingPins[i] == true) {
                        //check if pinBx.getAbsolutePivotPoint().z is > 20 if so add to counter
                        if (pinBArray[i].getAbsolutePosition().y < 25.0 || pinBArray[i].getAbsolutePosition().y > 27.0) {
                            remainingPins[i] = false;
                            curRollCount += 1;
                        };
                    };
                }

                //changing states
                if (frameNum == 11) { //top of 11th frame
                    rmCar();
                    cleanupPins();
                    topFrame = true;
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                };
                if (!topFrame && frameNum == 10) { //bot of 10th frame
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
                if (topFrame && frameNum == 10) { //top of 10th frame
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
                if (!topFrame && frameNum != 10) { //bot of frame
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
                if (topFrame && curRollCount < 10 && !nextFrame && frameNum != 10) { //top of frame and not a strike
                    rmCar();
                    cleanupPins();
                    topFrame = false;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;
                };
                if (topFrame && curRollCount == 10 && !nextFrame && frameNum != 10) { //top of a frame and a strike continue to next frame
                    rmCar();
                    cleanupPins();
                    frameNum += 1;
                    threeThrowAgo = twoThrowAgo;
                    twoThrowAgo = oneThrowAgo;
                    oneThrowAgo = curRollCount;
                    curRollCount = 0;

                };
                nextFrame = false;

                //calculate score
                if (threeThrowAgo == 10 && frameNum != 12) { //threw a strike three throws ago so calulate
                    score += 10 + twoThrowAgo + oneThrowAgo;
                };
                if ((threeThrowAgo + twoThrowAgo) == 10 && threeThrowAgo != 10 && twoThrowAgo != 10 && !topFrame) { //threw a spare so calculate
                    score += 10 + oneThrowAgo;
                };
                if (topFrame && frameNum < 11) {
                    remainingPins = [true, true, true, true, true, true, true, true, true, true];
                    if ((twoThrowAgo + oneThrowAgo) != 10 && oneThrowAgo != 10) { //no strike on last throw and didnt just pick up spare
                        score += twoThrowAgo + oneThrowAgo;
                    };
                };
                if (topFrame && frameNum == 11) { //score of 10th frame
                    if ((twoThrowAgo + oneThrowAgo) == 10 && oneThrowAgo != 10) { //no strike on last throw but pick up spare
                        score += 10 + twoThrowAgo + oneThrowAgo;
                    };
                    if (oneThrowAgo == 10) {
                        score += 10 + oneThrowAgo
                    };
                };
                if (topFrame && frameNum == 12) { // if got the extra frame
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
                    };
                };
            };
        };
        if ((speed + decel) > 0) {
            speed += decel;
            var ImpulseVector = new BABYLON.Vector3(0, 0, decel);
            carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition());
        };
    });
    if (topFrame) {
        frameGUI.text = "Top " + frameNum;
    } else {
        frameGUI.text = "Bot " + frameNum;
    }
    scoreGUI.text = "Score: " + score;
};

var createGameScene = function() {

    gameScene = new BABYLON.Scene(engine);

    //CREATE CAMERA & LIGHTING
    cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), gameScene); //left view
    //cam =  new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), gameScene); //behind view
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -200), gameScene); //top view
    //cam = new BABYLON.ArcRotateCamera("cam", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), gameScene); //ARCROTATE Camera
    cam.attachControl(canvas, true);

    light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), gameScene);
    light.intensity = .7;

    //CREATE PHYSICS ENGINE
    var forceVector = new BABYLON.Vector3(0, -60, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    gameScene.enablePhysics(forceVector, physicsPlugin);

    createGameGUI();
    addStationaryObjects();
    addGameLogic();

    return gameScene;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });

var activeScene = createMainMenuScene();

engine.runRenderLoop(function() {
    activeScene.render();
    if (state != currScene) {
        state = currScene;
        switch (currScene) {
            case 0:
                activeScene = createMainMenuScene();
                break;
            case 1:
                activeScene = createCarSelectScene();
                break;
            case 2:
                activeScene = createGameScene();
                break;
        }
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});