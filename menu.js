var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function() {

    var clicks = 0;
    var showScene = 0;
    var goToGame;
    var goToMenu;

    var createGUI = function(scene, showScene) {
        switch (showScene) {
            case 0:
                goToGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
                var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Game");
                button1.width = "150px"
                button1.height = "40px";
                button1.color = "white";
                button1.alpha = .6;

                button1.cornerRadius = 20;
                button1.background = "green";
                button1.onPointerUpObservable.add(function() {
                    clicks++;

                });
                goToGame.addControl(button1);

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

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);



    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;


    // second scene
    scene1 = new BABYLON.Scene(engine);
    var camera1 = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene1);

    // This targets the camera to scene origin
    camera1.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera1.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene1);

    // Default intensity is 1. Let's dim the light a small amount
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
                        goToGame.dispose();
                        createGUI(scene1, showScene);
                        scene1.render();
                        break
                }
            }
        });
    }, 500);

    return scene;
};
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