/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/

const canvas = document.getElementById("renderCanvas");
var gameScene, cam, light;
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
var activeScene = createMainMenuScene();
var currScene = 0, state = 0;
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
                activeScene = createGameScene();
                break;
        }
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});