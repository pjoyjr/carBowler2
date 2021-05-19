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

var createGameGUI = function(gameScene) {
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

var createGameScene = function() {

    gameScene = new BABYLON.Scene(engine);
    gameScene.createDefaultCameraOrLight(true, true, true);

    createGameGUI();



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