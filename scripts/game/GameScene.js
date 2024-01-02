class GameScene {
    constructor(engine) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        
        // Components
        this.gameController = new GameController(this.scene);
        this.gameGUI = new GameGUI(this.scene);
        this.gameCamera = new GameCamera(this.scene, this.gameController.car);
        this.gamePhysics = new GamePhysics(this.scene);

        // Initialize scene
        this.initializeScene();
    }

    initializeScene() {
        // Initialize each component
        this.gameController.setup();
        this.gameGUI.setup();
        this.gameCamera.setup();
        this.gamePhysics.setup();

        // Register main game loop
        this.scene.registerAfterRender(() => this.gameController.main());
    }

    getScene() {
        return this.scene;
    }

    render() {
        this.scene.render();
    }
}