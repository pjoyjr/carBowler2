class MainMenuScene {
    constructor(engine, sceneManager) {
        this.engine = engine;
        this.sceneManager = sceneManager;
        this.scene = new BABYLON.Scene(engine);
        this.createDefaultEnvironment();
        this.setupGUI();
    }

    createDefaultEnvironment() {
        // Setup camera and light defaults (if needed)
        this.scene.createDefaultCameraOrLight(true, true, true);

        // Background layer
        new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/bg.png', this.scene, true);
    }

    setupGUI() {
        let mainMenuGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        let playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
        formatBtn(playBtn);
        playBtn.top = "42%";
        playBtn.onPointerUpObservable.add(() => {
            this.sceneManager.switchToCarSelectScene(); // Switch to Car Select Scene
        });
        mainMenuGUI.addControl(playBtn);
    }

    render() {
        this.scene.render();
    }
}