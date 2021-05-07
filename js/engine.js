const canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function() {

    var clicks = 0;
    var showScene = 0;
    var goToCarSelect;
    var goToMenu;

    var createGUI = function(scene, showScene) {
        switch (showScene) {
            case 0:
                goToCarSelect = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

                var playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                var scoresBtn = BABYLON.GUI.Button.CreateSimpleButton("scoresBtn", "Leaderboard");
                var quitBtn = BABYLON.GUI.Button.CreateSimpleButton("quitBtn", "Quit");
                var buttons = [playBtn, scoresBtn, quitBtn];

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

                playBtn.top = "5%";
                scoresBtn.top = "20%";
                quitBtn.top = "35%";

                playBtn.onPointerUpObservable.add(function() {
                    clicks++;
                });

                quitBtn.onPointerUpObservable.add(function() {
                    window.close();
                });

                goToCarSelect.addControl(playBtn);
                goToCarSelect.addControl(scoresBtn);
                goToCarSelect.addControl(quitBtn);

                break
            case 1:
                goToMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene1);
                var button2 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Menu");
                button2.width = "150px"
                button2.height = "40px";
                button2.color = "white";
                button2.cornerRadius = 20;
                button2.background = "red";
                button2.onPointerUpObservable.add(function() {
                    clicks++;

                });
                goToMenu.addControl(button2);
                break
        }

    }

    //Create Scenes
    var scene = new BABYLON.Scene(engine);
    var scene1 = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var camera1 = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene1);
    camera1.setTarget(BABYLON.Vector3.Zero());
    camera1.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene1);
    light1.intensity = 0.7;

    // Built in Meshes
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1; // Move the sphere upward 1/2 its height
    var cube = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene1)

    createGUI(scene, showScene);

    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (showScene != (clicks % 2)) {
                showScene = clicks % 2;
                switch (showScene) {
                    case 0:
                        goToMenu.dispose();
                        createGUI(scene, showScene);
                        scene.render();
                        break
                    case 1:
                        goToCarSelect.dispose();
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