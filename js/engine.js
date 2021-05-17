const canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
});


var createScene = function() {
    var startScene = null;
    var carSelectScene = null;
    var mainMenuGUI, carSelectGUI;
    var currScene = 0;
    var state = 0;

    var bgLayer;
    var playBtn, nextBtn, prevBtn, selectBtn, backBtn;
    var mainMenuCam, mainMenuLight, carSelectCam, carSelectLight;

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

    var createGUI = function(scene, state) {
        switch (state) {
            case 0:
                mainMenuGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
                bgLayer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/img/bg.png', scene, true);
                playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
                formatBtn(playBtn);
                playBtn.top = "42%";
                playBtn.onPointerUpObservable.add(function() {
                    currScene = 1;
                });
                mainMenuGUI.addControl(playBtn);
                break

            case 1:
                carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
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
                break

        }

    };


    // first scene
    startScene = new BABYLON.Scene(engine);
    mainMenuCam = new BABYLON.FreeCamera("mainMenuCam", new BABYLON.Vector3(0, 5, -10), startScene);
    mainMenuCam.lockedTarget = new BABYLON.Vector3.Zero();
    mainMenuCam.attachControl(canvas, true);
    mainMenuLight = new BABYLON.HemisphericLight("mainMenuLight", new BABYLON.Vector3(0, 1, 0), startScene);
    mainMenuLight.intensity = 0.7;


    // second scene
    carSelectScene = new BABYLON.Scene(engine);
    carSelectCam = new BABYLON.FreeCamera("carSelectCam", new BABYLON.Vector3(0, 5, -10), carSelectScene);
    carSelectCam.lockedTarget = new BABYLON.Vector3.Zero();
    carSelectCam.attachControl(canvas, true);
    carSelectLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), carSelectScene);
    carSelectLight.intensity = 0.7;

    var cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, carSelectScene);
    cube.position.y = 3; // Move the sphere upward 1/2 its width
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, carSelectScene);
    sphere.position.x = 3; // Move the sphere upward 1/2 its width


    createGUI(startScene, state);

    //runRenderLoop inside a setTimeout is neccesary in the Playground
    //to stop the PG's runRenderLoop.
    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function() {
            if (state != currScene) {
                state = currScene;
                switch (currScene) {
                    case 0:
                        carSelectGUI.dispose();
                        createGUI(startScene, state);
                        startScene.render();
                        break
                    case 1:
                        mainMenuGUI.dispose();
                        createGUI(carSelectScene, state);
                        carSelectScene.render();
                        break
                }
            }
        });
    }, 500);

    return startScene;
};


var scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});