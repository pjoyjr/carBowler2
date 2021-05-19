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

var cube, cone, pill;

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

    bgLayer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', mainMenuScene, true);

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
    // light.intensity = 0.7;

    cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, carSelectScene);
    cube.position.x = Math.cos(degToRadians(car1Angle)) * radius;
    cube.position.z = Math.sin(degToRadians(car1Angle)) * radius - 1;
    cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop: .25, height: 1, tessellation: 24 }, carSelectScene);
    cone.position.x = Math.cos(degToRadians(car2Angle)) * radius;
    cone.position.z = Math.sin(degToRadians(car2Angle)) * radius - 1;
    cone.rotation.x = 90;
    cone.rotation.z = 90;
    pill = new BABYLON.Mesh.CreateCapsule('pill', { radius: 0.5, height: 2 }, carSelectScene)
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
    var gameGUI, frameGUI, scoreGUI, scoreOUTLINE, frameOUTLINE;

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
}


function addObjects() {
    //Function to add all non moving objects to scene

    //scene and objects
    var skybox, skyboxMaterial, ground, groundMaterial, water, waterMesh;
    var lane, laneMesh, laneMeshMat;
    var rampMesh, rampMeshMat;
    var island, islandMat;
    //var car, carMesh, carMeshMat;
    //var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
    //var pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10, pinMesh;
    //alphas for testing
    var carMeshAlpha = 0;
    var laneMeshAlpha = 0;
    var rampMeshAlpha = 0;
    var islandMeshAlpha = 0;
    var islandMatAlpha = 1; //leave at 1
    //var pinMeshAlpha = 0;


    //CREATE SKYBOX
    skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, gameScene);
    skyboxMaterial = new BABYLON.StandardMaterial("skyBox", gameScene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/TropicalSunnyDay", gameScene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    //CREATE GROUND
    groundMaterial = new BABYLON.StandardMaterial("groundMaterial", gameScene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("img/ground.jpg", gameScene);
    groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;

    ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, gameScene, false);
    ground.position.y = -1;
    ground.material = groundMaterial;

    //CREATE WATER AND MODIFIY PROPERTIES
    waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, gameScene, false);
    water = new BABYLON.WaterMaterial("water", gameScene);
    water.bumpTexture = new BABYLON.Texture("img/waterbump.png", gameScene);
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

    //CREATE LANE W/ RAMP & COLLISON BOXES FOR VEHICLE
    //lane with ramp obj from blender
    /*
    BABYLON.SceneLoader.ImportMesh("Lane", "obj/", "lane.babylon", gameScene,
        function(newMeshes) {
            lane = newMeshes[0];
            lane.position = new BABYLON.Vector3(0, 3, -100);
            lane.scaling = new BABYLON.Vector3(30, 8, 120);
        });
    */

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

    //CREATE ISLAND FOR PINS
    //island for collision and bounce
    islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, gameScene);
    islandMesh.position = new BABYLON.Vector3(0, 0, 170);
    islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", gameScene);
    islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    islandMeshMat.alpha = islandMeshAlpha;

    //island where pins pins sit on
    islandMesh.material = islandMeshMat;
    island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
    island.position = new BABYLON.Vector3(0, 0, 170);
    islandMat = new BABYLON.StandardMaterial("islandMat", gameScene);
    islandMat.alpha = islandMatAlpha;
    islandMat.diffuseTexture = new BABYLON.Texture("planks.jpg", gameScene);
    island.material = islandMat;

    //physics imposters
    /*
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    */
};

var createGameScene = function() {

    gameScene = new BABYLON.Scene(engine);

    //CREATE CAMERA & LIGHTING
    //left view
    //cam =  new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), scene);
    //behind view
    //cam =  new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), scene);
    //top view
    cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -200), gameScene);
    //ARCROTATE Camera
    //cam = new BABYLON.ArcRotateCamera("cam", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
    cam.attachControl(canvas, true);

    light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), gameScene);
    light.intensity = .7;

    //CREATE PHYSICS ENGINE
    /*
    var forceVector = new BABYLON.Vector3(0, -60, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(forceVector, physicsPlugin);
    */


    createGameGUI();
    addObjects(gameScene);



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
                break
            case 1:
                activeScene = createCarSelectScene();
                break
            case 2:
                activeScene = createGameScene();
                break
        }
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});