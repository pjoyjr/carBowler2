const canvas = document.getElementById("renderCanvas");

var currScene = 0;
var state = 0;
var mainMenuScene, carSelectScene;

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

var createMainMenu = function() {
    var cam, light, bgLayer, playBtn;

    mainMenuScene = new BABYLON.Scene(engine);
    cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 5, -10), mainMenuScene);
    cam.lockedTarget = new BABYLON.Vector3.Zero();
    cam.attachControl(canvas, true);
    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), mainMenuScene);
    light.intensity = 0.7;

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

var createCarSelect = function() {
    var nextBtn, prevBtn, selectBtn, backBtn, cam, light;

    carSelectScene = new BABYLON.Scene(engine);
    carSelectScene.clearColor = new BABYLON.Color3.Purple();
    cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 5, -10), carSelectScene);
    cam.lockedTarget = new BABYLON.Vector3.Zero();
    cam.attachControl(canvas, true);
    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), carSelectScene);
    light.intensity = 0.7;

    var cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, carSelectScene);
    cube.position.y = 3; // Move the sphere upward 1/2 its width
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, carSelectScene);
    sphere.position.x = 3; // Move the sphere upward 1/2 its width

    carSelectScene.registerBeforeRender(function() {

        cube.rotation.z += .005;
        cube.rotation.y += 0.01;
    });

    carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, carSelectScene);
    nextBtn = BABYLON.GUI.Button.CreateSimpleButton("nextBtn", ">");
    prevBtn = BABYLON.GUI.Button.CreateSimpleButton("prevBtn", "<");
    selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select Car");
    backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "Go To Menu");
    formatBtn(nextBtn);
    formatBtn(prevBtn);
    nextBtn.width = "5%";
    nextBtn.top = "-15%";
    nextBtn.left = "40%";
    prevBtn.width = "5%";
    prevBtn.top = "-15%";
    prevBtn.left = "-40%";
    formatBtn(selectBtn);
    formatBtn(backBtn);
    selectBtn.top = "30%";
    backBtn.top = "42%";

    /*
    selectBtn.onPointerUpObservable.add(function() {
        currScene = 2;
    });
    */
    backBtn.onPointerUpObservable.add(function() {
        currScene = 0;
    });

    carSelectGUI.addControl(nextBtn);
    carSelectGUI.addControl(prevBtn);
    carSelectGUI.addControl(selectBtn);
    carSelectGUI.addControl(backBtn);

    return carSelectScene
}

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });

var activeScene = createMainMenu();

engine.runRenderLoop(function() {
    activeScene.render();
    if (state != currScene) {
        state = currScene;
        switch (currScene) {
            case 0:
                activeScene = createMainMenu();
                break
            case 1:
                activeScene = createCarSelect();
                break
        }
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});