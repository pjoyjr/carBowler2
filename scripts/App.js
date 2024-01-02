class App {
    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.sceneManager = new SceneManager(this.engine, this.canvas);
        this.bindEvents();
        this.startRenderLoop();
    }

    bindEvents() {
        window.addEventListener("resize", () => this.engine.resize());
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.sceneManager.renderActiveScene();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});