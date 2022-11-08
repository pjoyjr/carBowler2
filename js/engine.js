
const canvas = document.getElementById("renderCanvas");
var cam, light;
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
var activeScene = createMainMenuScene();
var currScene = 0, state = 0;
var game;
engine.runRenderLoop(function() {
    activeScene.render();
    if (state != currScene) {
        state = currScene;
        switch (currScene) {
            case 0:
                activeScene = createMainMenuScene();
                break;
            case 1:
                activeScene = createCarSelectScene();
                break;
            case 2:
                game = new Game(engine);
                activeScene = game.getScene();
                break;
        }
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});