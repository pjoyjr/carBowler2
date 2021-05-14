const canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var getScene = function() {
    var state = 0;
    var showScene = 0;
    var mainGUI, carSelectGUI;

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

    var createGUI = function(showScene) {
        switch (showScene) {
            case 0: //MAIN MENU
                mainGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, mainMenuScene);
                var layer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', mainMenuScene, true);
                var playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                formatBtn(playBtn);
                playBtn.top = "30%";
                playBtn.onPointerUpObservable.add(function() {
                    state = 1;
                });
                mainGUI.addControl(playBtn);
                break

            case 1: //CAR SELECT MENU
                carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, carSelectScene);
                var selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select Car");
                var backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "Go To Menu");
                formatBtn(selectBtn);
                formatBtn(backBtn);
                selectBtn.top = "20%";
                backBtn.top = "35%";
                selectBtn.onPointerUpObservable.add(function() {
                    state = 2;
                });
                backBtn.onPointerUpObservable.add(function() {
                    state = 0;
                });
                carSelectGUI.addControl(selectBtn);
                carSelectGUI.addControl(backBtn);
                break
            case 2: //PLAY GAME
                break
        }

    }

    //Create Scenes
    var mainMenuScene = new BABYLON.Scene(engine);
    var carSelectScene = new BABYLON.Scene(engine);
    var gameScene = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    mainMenuScene.createDefaultCameraOrLight(true, true, true);
    carSelectScene.createDefaultCameraOrLight(true, true, true);
    gameScene.createDefaultCameraOrLight(true, true, true);

    createGUI(showScene);

    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (showScene != state) {
                showScene = state;
                switch (showScene) {
                    case 0:
                        carSelectGUI.dispose();
                        createGUI(showScene);
                        mainMenuScene.render();
                        break
                    case 1:
                        mainGUI.dispose();
                        createGUI(showScene);
                        carSelectScene.render();
                        break
                    case 2:
                        carSelectGUI.dispose();
                        createGUI(showScene);
                        gameScene.render();
                        break
                }
            }
        });
    }, 500);

    return mainMenuScene;
};

var scene = getScene();

engine.runRenderLoop(function() {
    scene.render();
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});