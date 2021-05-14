const canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function() {
    var state = 0;
    var showScene = 0;
    var mainGUI;
    var carSelectGUI;

    var createGUI = function(scene, showScene) {
        switch (showScene) {
            case 0: //MAIN MENU
                mainGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
                var layer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', scene, true);

                var playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                playBtn.width = "35%";
                playBtn.height = "10%";
                playBtn.color = "white";
                playBtn.alpha = .8;
                playBtn.cornerRadius = 20;
                playBtn.background = "blue";
                playBtn.fontSize = "50px";
                playBtn.children[0].color = "white";
                playBtn.top = "30%";
                playBtn.onPointerUpObservable.add(function() {
                    state = 1;
                });
                mainGUI.addControl(playBtn);
                break

            case 1: //CAR SELECT MENU
                carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
                var selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select Car");
                var backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "Go To Menu");
                var button = [selectBtn, backBtn];
                for (var i = 0; i < button.length; i = i + 1) {
                    button[i].width = "35%";
                    button[i].height = "10%";
                    button[i].color = "white";
                    button[i].alpha = .8;
                    button[i].cornerRadius = 20;
                    button[i].background = "blue";
                    button[i].fontSize = "50px";
                    button[i].children[0].color = "white";
                }
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
    var scene = new BABYLON.Scene(engine);
    var scene1 = new BABYLON.Scene(engine);
    var scene2 = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    scene.createDefaultCameraOrLight(true, true, true);
    scene1.createDefaultCameraOrLight(true, true, true);
    scene2.createDefaultCameraOrLight(true, true, true);

    createGUI(scene, showScene);

    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (showScene != state) {
                showScene = state;
                switch (showScene) {
                    case 0:
                        carSelectGUI.dispose();
                        createGUI(scene, showScene);
                        scene.render();
                        break
                    case 1:
                        mainGUI.dispose();
                        createGUI(scene1, showScene);
                        scene1.render();
                        break
                    case 2:
                        carSelectGUI.dispose();
                        createGUI(scene2, showScene);
                        scene2.render();
                        break
                }
            }
        });
    }, 500);

    return scene;
};


/*
CODE NEEDED TO RUN BABYLON.JS ENGINE AND SCENES
*/
var scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});