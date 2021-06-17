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
var gameGUI;
var frameGUI, scoreGUI, speedGUI, score2GUI;
var overRamp = false; //for checking to see if user can alter car
var isSetup = false; // for setting up pins
var map = {}; //object for multiple key presses

var gameOver = false;
var extraFrame = false;
var startTimer, endTimer;
var curRollCount = 0;

/*
var topFrame = true;
var frameNum = 1;
var scorecard = [];
var score = 0;
var oneThrowAgo = 0; //for spare/strike calculation
var twoThrowAgo = 0; //for spare/strike calculation
var threeThrowAgo = 0; //for spare/strike calculation
*/

var testingBOOL = false;

var firstTime = true;
var frameNum = 10;
var topFrame = false;
var scorecard = ["-", "X", 9, "/", "0", "0", 2, 4, 3, 3, 6, "/", 9, "/", "0", "0", "-", "X", 0];
var score = 71;
var oneThrowAgo = [0, 18]; //for spare/strike calculation
var twoThrowAgo = [10, 17]; //for spare/strike calculation
var threeThrowAgo = [0, 15]; //for spare/strike calculation

//pin variables
var pinStanding = [true, true, true, true, true, true, true, true, true, true];
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10;
var pinMesh, pinMeshAlpha = 0;

//car variables
var speed = 0;
var accel = .4667;
var decel = -.25;
var MAXSPEED = 10;
var carMoved = false;

//physics info for pins and car
var pinPHYSICS = { mass: 3, restitution: 0.0 };
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
    gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("scoreGUI", "");
    frameGUI = BABYLON.GUI.Button.CreateSimpleButton("frameGUI", "");
    speedGUI = BABYLON.GUI.Button.CreateSimpleButton("speedGUI", "");
    score2GUI = BABYLON.GUI.Button.CreateSimpleButton("score2GUI", "");

    formatBtn(scoreGUI);
    formatBtn(frameGUI);
    formatBtn(speedGUI);
    formatBtn(score2GUI);

    frameGUI.textBlock.text = "Frame:";
    frameGUI.top = "-45%";
    frameGUI.left = "40%";
    frameGUI.height = "5%";
    frameGUI.width = "20%";
    frameGUI.textBlock.fontSize = 24;

    scoreGUI.textBlock.text = "Score:";
    scoreGUI.top = "-40%";
    scoreGUI.left = "40%";
    scoreGUI.height = "5%";
    scoreGUI.width = "20%";
    scoreGUI.textBlock.fontSize = 24;

    speedGUI.textBlock.text = "Speed:";
    speedGUI.top = "-35%";
    speedGUI.left = "40%";
    speedGUI.height = "5%";
    speedGUI.width = "20%";
    speedGUI.textBlock.fontSize = 24;

    score2GUI.textBlock.text = "Last Bowl:";
    score2GUI.top = "-30%";
    score2GUI.left = "40%";
    score2GUI.height = "5%";
    score2GUI.width = "20%";
    score2GUI.textBlock.fontSize = 24;

    gameGUI.addControl(frameGUI);
    gameGUI.addControl(scoreGUI);
    gameGUI.addControl(speedGUI);
    gameGUI.addControl(score2GUI);
};

//Function to add all non moving objects to scene
var addStationaryObjects = function() {

    //scene and objects
    var skybox, skyboxMaterial, ground, groundMaterial, water, waterMesh;
    var lane, laneMesh, laneMeshMat;
    var rampMesh, rampMeshMat;
    var island, islandMat;
    //alphas for testing
    var laneMeshAlpha = 0;
    var rampMeshAlpha = 0;
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

    //lane mesh for collision
    laneMesh = BABYLON.MeshBuilder.CreateBox("laneMesh", { height: 10, width: 56, depth: 230 }, gameScene);
    laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
    laneMeshMat = new BABYLON.StandardMaterial(gameScene);
    laneMeshMat.alpha = laneMeshAlpha;
    laneMesh.material = laneMeshMat;
    //ramp mesh for collisions
    rampMesh = BABYLON.MeshBuilder.CreateBox("rampMesh", { height: 10, width: 56, depth: 70 }, gameScene);
    rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
    rampMesh.rotation.x = 31 * Math.PI / 40;
    rampMeshMat = new BABYLON.StandardMaterial(gameScene);
    rampMeshMat.alpha = rampMeshAlpha;
    rampMesh.material = rampMeshMat;

    //lane with ramp obj from blender
    BABYLON.SceneLoader.ImportMesh("Lane", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/lane.babylon", gameScene,
        function(newMeshes) {
            lane = newMeshes[0];
            lane.position = new BABYLON.Vector3(0, 3, -100);
            lane.scaling = new BABYLON.Vector3(30, 8, 120);
            var copyMat = laneMeshMat;
            copyMat.alpha = 1;
            copyMat.diffuseTexture = planksTexture;
            lane.material = copyMat;
        });

    //CREATE ISLAND FOR PINS
    //island for collision and bounce
    islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, gameScene);
    islandMesh.position = new BABYLON.Vector3(0, 25, 170);
    islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", gameScene);
    islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    islandMeshMat.alpha = islandMeshAlpha;
    islandMesh.material = islandMeshMat;

    //island where pins pins sit on
    island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
    island.position = new BABYLON.Vector3(0, 25, 170);
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
    var carMeshAlpha = 0;

    overRamp = false;
    //create bounding box for physics engine
    carMesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 10.0 }, gameScene);
    carMesh.position = new BABYLON.Vector3(0, 18, -180);
    carMeshMat = new BABYLON.StandardMaterial(gameScene);
    carMeshMat.alpha = carMeshAlpha;
    carMeshMat.diffuseColor = new BABYLON.Color3(0, 180, 0);
    carMesh.material = carMeshMat;

    //load in car from blender
    BABYLON.SceneLoader.ImportMesh("Car", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/car.babylon", gameScene,
        function(newMeshes) {
            car = newMeshes[0];
            car.scaling = new BABYLON.Vector3(3, 3, 5);
            //car.position = new BABYLON.Vector3(0, 16, -180);
            car.position = carMesh.getAbsolutePosition();
        });

    carMesh.physicsImpostor = new BABYLON.PhysicsImpostor(carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, gameScene);
    carMoved = false;
};

//Function to remove car
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
    var pinHeight = 50;
    for (var i = 0; i < 10; i = i + 1) {
        if (pinsStanding[i]) {
            switch (i) {
                case 0:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB1 = BABYLON.MeshBuilder.CreateCylinder("pinB1", pinDIM, gameScene);
                            pinB1.position = new BABYLON.Vector3(0, pinHeight, 148);
                            pinB1.material = pinMesh;
                            pinB1.physicsImpostor = new BABYLON.PhysicsImpostor(pinB1, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin1 = newMeshes[0];
                            pin1.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin1.parent = pinB1;
                        });
                    break;
                case 1:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB2 = BABYLON.MeshBuilder.CreateCylinder("pinB2", pinDIM, gameScene);
                            pinB2.position = new BABYLON.Vector3(-7.5, pinHeight, 163);
                            pinB2.material = pinMesh;
                            pinB2.physicsImpostor = new BABYLON.PhysicsImpostor(pinB2, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin2 = newMeshes[0];
                            pin2.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin2.parent = pinB2;
                        });
                    break;
                case 2:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB3 = BABYLON.MeshBuilder.CreateCylinder("pinB3", pinDIM, gameScene);
                            pinB3.position = new BABYLON.Vector3(7.5, pinHeight, 163);
                            pinB3.material = pinMesh;
                            pinB3.physicsImpostor = new BABYLON.PhysicsImpostor(pinB3, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin3 = newMeshes[0];
                            pin3.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin3.parent = pinB3;
                        });
                    break;
                case 3:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB4 = BABYLON.MeshBuilder.CreateCylinder("pinB4", pinDIM, gameScene);
                            pinB4.position = new BABYLON.Vector3(-15, pinHeight, 178);
                            pinB4.material = pinMesh;
                            pinB4.physicsImpostor = new BABYLON.PhysicsImpostor(pinB4, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin4 = newMeshes[0];
                            pin4.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin4.parent = pinB4;
                        });
                    break;
                case 4:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB5 = BABYLON.MeshBuilder.CreateCylinder("pinB5", pinDIM, gameScene);
                            pinB5.position = new BABYLON.Vector3(0, pinHeight, 178);
                            pinB5.material = pinMesh;
                            pinB5.physicsImpostor = new BABYLON.PhysicsImpostor(pinB5, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin5 = newMeshes[0];
                            pin5.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin5.parent = pinB5;
                        });
                    break;
                case 5:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB6 = BABYLON.MeshBuilder.CreateCylinder("pinB6", pinDIM, gameScene);
                            pinB6.position = new BABYLON.Vector3(15, pinHeight, 178);
                            pinB6.material = pinMesh;
                            pinB6.physicsImpostor = new BABYLON.PhysicsImpostor(pinB6, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin6 = newMeshes[0];
                            pin6.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin6.parent = pinB6;
                        });
                    break;
                case 6:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB7 = BABYLON.MeshBuilder.CreateCylinder("pinB7", pinDIM, gameScene);
                            pinB7.position = new BABYLON.Vector3(-22.5, pinHeight, 193);
                            pinB7.material = pinMesh;
                            pinB7.physicsImpostor = new BABYLON.PhysicsImpostor(pinB7, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin7 = newMeshes[0];
                            pin7.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin7.parent = pinB7;
                        });
                    break;
                case 7:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB8 = BABYLON.MeshBuilder.CreateCylinder("pinB8", pinDIM, gameScene);
                            pinB8.position = new BABYLON.Vector3(-7.5, pinHeight, 193);
                            pinB8.material = pinMesh;
                            pinB8.physicsImpostor = new BABYLON.PhysicsImpostor(pinB8, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin8 = newMeshes[0];
                            pin8.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin8.parent = pinB8;
                        });
                    break;
                case 8:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB9 = BABYLON.MeshBuilder.CreateCylinder("pinB9", pinDIM, gameScene);
                            pinB9.position = new BABYLON.Vector3(7.5, pinHeight, 193);
                            pinB9.material = pinMesh;
                            pinB9.physicsImpostor = new BABYLON.PhysicsImpostor(pinB9, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin9 = newMeshes[0];
                            pin9.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin9.parent = pinB9;
                        });
                    break;
                case 9:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB10 = BABYLON.MeshBuilder.CreateCylinder("pinB10", pinDIM, gameScene);
                            pinB10.position = new BABYLON.Vector3(22.5, pinHeight, 193);
                            pinB10.material = pinMesh;
                            pinB10.physicsImpostor = new BABYLON.PhysicsImpostor(pinB10, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin10 = newMeshes[0];
                            pin10.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin10.parent = pinB10;
                        });
                    break;
            }
        }
    }
};

//Function to remove all pins for next bowl
var cleanupPins = function() {
    isSetup = false;

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

//Add action manager for input
var addController = function() {
    gameScene.actionManager = new BABYLON.ActionManager(gameScene);
    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
};

var addCarMechanics = function() {
    if (map["w"] || map["W"]) {
        carMoved = true;
        speed += accel;
        if (speed > MAXSPEED)
            speed = MAXSPEED;
        if (speed < 0)
            speed = 0;
        var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
        carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition()); //impulse at center of mass;
    } else if (((speed + decel) > 0) && carMoved) {
        speed += decel;
        var ImpulseVector = new BABYLON.Vector3(0, 0, decel);
        carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition());
    }
    if (map["a"] || map["A"]) {
        if (carMesh.getAbsolutePosition().x > -32)
            carMesh.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
    }

    if (map["d"] || map["D"]) {
        if (carMesh.getAbsolutePosition().x < 32)
            carMesh.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
    }

};

var updateGUI = function() {
    if (topFrame) {
        frameGUI.textBlock.text = "Top " + frameNum;
    } else {
        frameGUI.textBlock.text = "Bot " + frameNum;
    }
    scoreGUI.textBlock.text = "Score: " + score;
    speedGUI.textBlock.text = "Speed: " + speed.toFixed(2);
    score2GUI.textBlock.text = "Last Bowl: " + oneThrowAgo;
};

var countStandingPins = function() {
    var pinBArray = [pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10];
    for (var i = 0; i < 10; i = i + 1) {
        if (pinStanding[i]) {
            if (pinBArray[i].getAbsolutePosition().y < 25.0 || pinBArray[i].getAbsolutePosition().y > 27.0) {
                pinStanding[i] = false;
                curRollCount += 1;
            }
        }
    }
};

var manageFrames = function() {
    if (topFrame && curRollCount == 10 && frameNum < 10) { //strike on top of frame
        scorecard.push("-");
        scorecard.push("X");
    } else if (!topFrame && (curRollCount + oneThrowAgo[0] == 10) && frameNum < 10) {
        scorecard.push("/");
    } else if (frameNum < 10) {
        scorecard.push(curRollCount);
    } else if (scorecard.length == 18) { //top of 10th frame
        if (curRollCount == 10) {
            extraFrame = true;
            scorecard.push("X");
        } else {
            scorecard.push(curRollCount);
        }
    } else if (scorecard.length == 19) { //bottom of 10th frame
        if (curRollCount == 10 && oneThrowAgo[0] == 10) {
            scorecard.push("X");
            extraFrame = true;
        } else if ((curRollCount + oneThrowAgo[0]) == 10) {
            scorecard.push("/");
            extraFrame = true;
        } else {
            scorecard.push(curRollCount);
        }
    } else if (scorecard.length == 20) { //extra frame
        if ((oneThrowAgo[0] == "X" || oneThrowAgo[0] == "/") && curRollCount == 10) {
            scorecard.push("X");
            extraFrame = true;
        } else if ((curRollCount + oneThrowAgo[0]) == 10) {
            scorecard.push("/");
            extraFrame = true;
        } else {
            scorecard.push(curRollCount);
        }
    }

    threeThrowAgo = twoThrowAgo;
    twoThrowAgo = oneThrowAgo;
    oneThrowAgo = [curRollCount, (scorecard.length - 1)]; //[count, index]
    curRollCount = 0;

    frameNum = Math.floor(scorecard.length / 2) + 1;
    if (scorecard.length % 2 == 0)
        topFrame = true;
    else
        topFrame = false;
    if (topFrame || scorecard[18] == "X")
        pinStanding = [true, true, true, true, true, true, true, true, true, true];
};

var checkStrike = function() {
    if (scorecard[threeThrowAgo[1]] == "X")
        score += 10 + twoThrowAgo[0] + oneThrowAgo[0];
};

var checkSpare = function() {
    if (scorecard[twoThrowAgo[1]] == "/")
        score += 10 + oneThrowAgo[0];
};

var calculateScore = function() {
    checkStrike();
    if (topFrame && frameNum < 12 && !extraFrame) {
        if ((oneThrowAgo[0] + twoThrowAgo[0] != 10) && oneThrowAgo[0] != 10) { // no spare and no strike
            score += oneThrowAgo[0] + twoThrowAgo[0];
        }
    } else if (!topFrame) {
        checkSpare();
    }
};

var setupForThrow = function() {
    addCar();
    cam.position = new BABYLON.Vector3(0, 40, -250);
    cam.lockedTarget = carMesh.getAbsolutePosition();
    setupPins(pinStanding);
    isSetup = true;
};

var cleanupFrame = function() {
    countStandingPins();
    rmCar();
    cleanupPins();
};

//var x = function(){};
var rmGUI = function() {
    frameGUI.dispose();
    scoreGUI.dispose();
    speedGUI.dispose();
    score2GUI.dispose();
};

var endGameGUI = function() {
    var resetBtn;

    gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("sOUTLINE", "");
    formatBtn(scoreGUI);

    scoreGUI.textBlock.text = "Score: " + score;
    scoreGUI.fontSize = 48;
    scoreGUI.height = "15%";
    scoreGUI.width = "40%";
    gameGUI.addControl(scoreGUI);

    resetBtn = BABYLON.GUI.Button.CreateSimpleButton("reset", "Play Again?");
    formatBtn(resetBtn);
    resetBtn.top = "42%";
    resetBtn.onPointerUpObservable.add(function() {
        currScene = 1;
    });
    gameGUI.addControl(resetBtn);
};

var endGame = function() {
    //DISPLAY SCORE AND RETURN TO MAIN MENU AFTER CONFIRMING
    rmGUI();
    endGameGUI();
};

var resetVariables = function() {
    topFrame = true;
    frameNum = 1;
    scorecard = [];
    score = 0;
    oneThrowAgo = 0;
    twoThrowAgo = 0;
    threeThrowAgo = 0;
    gameOver = false;
    extraFrame = false;
    isSetup = false;
};

var addGameLogic = function() {
    addController();
    if (firstTime && testingBOOL)
        firstTime = false;
    else
        resetVariables();

    gameScene.registerAfterRender(function() {
        updateGUI();

        if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
            gameOver = true;

        if (!isSetup && !gameOver)
            setupForThrow();

        if (carMesh.getAbsolutePosition().z > 25 && !overRamp && isSetup) {
            overRamp = true;
            startTimer = new Date();
        }
        if (!overRamp) {
            addCarMechanics();
        } else if (!gameOver) { // wait till timer is done then count pins
            cam.position = new BABYLON.Vector3(-45, 120, -20);
            cam.lockedTarget = islandMesh.getAbsolutePosition();
            endTimer = new Date();
            if ((endTimer - startTimer) >= 15000) {
                //Count pins knocked over after 15 secs
                cleanupFrame();
                manageFrames();
                calculateScore();
            }
        } else if (gameOver) {
            endGame();
        }
    });
};

var createGameScene = function() {

    gameScene = new BABYLON.Scene(engine);

    //CREATE CAMERA & LIGHTING
    cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), gameScene); //left view
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), gameScene); //behind view
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