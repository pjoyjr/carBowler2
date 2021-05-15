const canvas = document.getElementById("renderCanvas");
var mainMenuScene, carSelectScene, gameScene;

//SCENE MANAGEMENT and GUI VARIABLES
var state, currScene;
var mainGUI, carSelectGUI;
var bgLayer;
var playBtn, nextBtn, prevBtn, selectBtn, backBtn;


var createScene = function() {
    state = 0;
    currScene = 0;
    mainGUI, carSelectGUI;

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

    var createGUI = function(currScene) {
        switch (currScene) {
            case 0: //MAIN MENU
                mainGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, mainMenuScene);
                bgLayer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', mainMenuScene, true);
                playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                formatBtn(playBtn);
                playBtn.top = "42%";
                playBtn.onPointerUpObservable.add(function() {
                    state = 1;
                });
                mainGUI.addControl(playBtn);
                break

            case 1: //CAR SELECT MENU
                carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, carSelectScene);
                nextBtn = BABYLON.GUI.Button.CreateSimpleButton("nextBtn", ">");
                prevBtn = BABYLON.GUI.Button.CreateSimpleButton("prevBtn", "<");
                formatBtn(nextBtn);
                nextBtn.width = "5%";
                nextBtn.top = "-15%";
                nextBtn.left = "40%";
                formatBtn(prevBtn);
                prevBtn.width = "5%";
                prevBtn.top = "-15%";
                prevBtn.left = "-40%";
                carSelectGUI.addControl(nextBtn);
                carSelectGUI.addControl(prevBtn);
                //ADD ROTATING MODELS OF CARS (SQUARE, SPHERE and PYRAMID FOR NOW)



                selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select Car");
                backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "Go To Menu");
                formatBtn(selectBtn);
                formatBtn(backBtn);
                selectBtn.top = "30%";
                backBtn.top = "42%";
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

    //Initialize Scenes
    mainMenuScene = new BABYLON.Scene(engine);
    carSelectScene = new BABYLON.Scene(engine);
    gameScene = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    mainMenuScene.createDefaultCameraOrLight(true, true, true);
    carSelectScene.createDefaultCameraOrLight(true, true, true);
    gameScene.createDefaultCameraOrLight(true, true, true);

    createGUI(currScene);

    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (currScene != state) {
                currScene = state;
                switch (currScene) {
                    case 0:
                        carSelectGUI.dispose();
                        createGUI(currScene);
                        mainMenuScene.render();
                        break
                    case 1:
                        mainGUI.dispose();
                        createGUI(currScene);
                        carSelectScene.render();
                        break
                    case 2:
                        carSelectGUI.dispose();
                        createGUI(currScene);
                        gameScene.render();
                        break
                }
            }
        });
    }, 500);

    return mainMenuScene;
};



/*
 * Code to run all game logic
 */
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

engine.runRenderLoop(function() {
    if (scene)
        scene.render();
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});