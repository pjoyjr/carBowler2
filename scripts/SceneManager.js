class SceneManager {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.activeScene = this.createMainMenuScene();
    }

    createMainMenuScene() {
        // Pass 'this' as a SceneManager reference to the MainMenuScene
        return new MainMenuScene(this.engine, this);
    }

    createCarSelectScene() {
        // Return a new instance of CarSelectScene
        // Replace with your actual CarSelectScene implementation
        return new CarSelectScene(this.engine, this.canvas, this);
    }

    createGameScene() {
        // Return a new instance of GameScene
        // Replace with your actual GameScene implementation
        return new GameScene(this.engine);
    }
    
    renderActiveScene() {
        if (this.activeScene) {
            this.activeScene.render();
        }
    }
    
    switchToMainMenu() {
        // Assuming createMainMenuScene returns an instance of your MainMenuScene
        this.activeScene = this.createMainMenuScene();
    }

    switchToCarSelectScene() {
        this.activeScene = this.createCarSelectScene();
    }

    switchToGameScene() {
        // Assuming createGameScene returns an instance of your Game scene
        this.activeScene = this.createGameScene();
    }
}