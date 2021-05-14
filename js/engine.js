const canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function() {
    var clicks = 0;
    var showScene = 0;
    var mainGUI;
    var carMenuGUI;

    var createGUI = function(scene, showScene) {
        switch (showScene) {
            case 0:
                mainGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

                var playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                var scoresBtn = BABYLON.GUI.Button.CreateSimpleButton("scoresBtn", "Leaderboard");
                var buttons = [playBtn, scoresBtn];

                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].width = "35%";
                    buttons[i].height = "10%";
                    buttons[i].color = "white";
                    buttons[i].alpha = .8;
                    buttons[i].cornerRadius = 20;
                    buttons[i].background = "blue";
                    buttons[i].fontSize = "50px";
                    buttons[i].children[0].color = "white";
                }

                playBtn.top = "20%";
                scoresBtn.top = "35%";

                var layer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', scene, true);

                playBtn.onPointerUpObservable.add(function() {
                    clicks++;
                });
                mainGUI.addControl(playBtn);
                mainGUI.addControl(scoresBtn);

                break
            case 1:
                carMenuGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene1);
                var button2 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Menu");
                button2.width = "150px"
                button2.height = "40px";
                button2.color = "white";
                button2.cornerRadius = 20;
                button2.background = "red";
                button2.onPointerUpObservable.add(function() {
                    clicks++;

                });
                carMenuGUI.addControl(button2);
                break
        }

    }

    //Create Scenes
    var scene = new BABYLON.Scene(engine);
    var scene1 = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    scene.createDefaultCameraOrLight(true, true, true);
    scene1.createDefaultCameraOrLight(true, true, true);

    createGUI(scene, showScene);

    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (showScene != (clicks % 2)) {
                showScene = clicks % 2;
                switch (showScene) {
                    case 0:
                        carMenuGUI.dispose();
                        createGUI(scene, showScene);
                        scene.render();
                        break
                    case 1:
                        mainGUI.dispose();
                        createGUI(scene1, showScene);
                        scene1.render();
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