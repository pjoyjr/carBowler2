// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");

// Loaders for camera and light to be used in different scenes
var cam, light;

// Create the Babylon.js engine
var engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
});

// Function declarations for createMainMenuScene and createCarSelectScene are assumed to be defined elsewhere

// Initialize the main menu as the starting scene
var activeScene = createMainMenuScene();

// Variables to track the current and previous scene states
var currScene = 0, state = 0;

// Placeholder for the game instance
var game;

// Engine's render loop
engine.runRenderLoop(function() {
    // Render the active scene
    activeScene.render();

    // Check if the scene state has changed
    if (state !== currScene) {
        state = currScene;
        // Switch the active scene based on the current state
        switch (currScene) {
            case 0:
                activeScene.dispose(); // Dispose the old scene if there was one
                activeScene = createMainMenuScene();
                break;
            case 1:
                activeScene.dispose(); // Dispose the old scene if there was one
                activeScene = createCarSelectScene();
                break;
            case 2:
                // Start the game and set its scene as the active scene
                game = new Game(engine);
                activeScene = game.getScene();
                break;
            default:
                console.error("Invalid scene index: " + currScene);
                break;
        }
    }
});

// Event listener for browser window resize event
window.addEventListener("resize", function() {
    // Resize the engine
    engine.resize();
});
