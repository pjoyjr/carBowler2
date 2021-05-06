var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false
    })
};
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
                playBtn.width = "40%";
                playBtn.height = "10%";
                playBtn.color = "white";
                playBtn.alpha = .6;
                playBtn.cornerRadius = 20;
                playBtn.background = "green";
                playBtn.top = "5%";
                playBtn.fontSizeInPixels = "50px";
                playBtn.onPointerUpObservable.add(function() {
                    clicks++;
                });

                var scoresBtn = BABYLON.GUI.Button.CreateSimpleButton("scoresBtn", "Leaderboard");
                scoresBtn.width = "35%";
                scoresBtn.height = "10%";
                scoresBtn.color = "white";
                scoresBtn.alpha = .6;
                scoresBtn.cornerRadius = 20;
                scoresBtn.top = "20%";
                scoresBtn.background = "green";

                var quitBtn = BABYLON.GUI.Button.CreateSimpleButton("quitBtn", "Quit");
                quitBtn.width = "20%";
                quitBtn.height = "10%";
                quitBtn.color = "white";
                quitBtn.alpha = .6;
                quitBtn.cornerRadius = 20;
                quitBtn.top = "35%";
                quitBtn.background = "red";
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


    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;


    // second scene
    scene1 = new BABYLON.Scene(engine);

    //Setup Camera and lighting
    var camera1 = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene1);
    camera1.setTarget(BABYLON.Vector3.Zero());
    camera1.attachControl(canvas, true);

    var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene1);
    light1.intensity = 0.7;

    var cube = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene1)


    createGUI(scene, showScene);

    //runRenderLoop inside a setTimeout is neccesary in the Playground
    //to stop the PG's runRenderLoop.
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
var engine;
var scene;
initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
    engine.runRenderLoop(function() {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});