class CarSelectScene {
    constructor(engine, canvas, sceneManager) {
        this.engine = engine;
        this.sceneManager = sceneManager;
        this.scene = new BABYLON.Scene(engine);
        this.createEnvironment(canvas);
        this.setupGUI();
    }

    createEnvironment(canvas) {
        // Scene setup logic
        this.scene.clearColor = new BABYLON.Color3.Purple();

        this.cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 10, 2), this.scene);
        this.cam.lockedTarget = new BABYLON.Vector3.Zero();
        this.cam.attachControl(canvas, true);

        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);

        // Create objects and their animations
        this.createObjectsAndAnimations();
    }

    createObjectsAndAnimations() {
        this.car1Angle = 210;
        this.car2Angle = 330;
        this.car3Angle = 90;

        this.cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, this.scene);
        this.cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop: .25, height: 1, tessellation: 24 }, this.scene);
        this.pill = new BABYLON.Mesh.CreateCapsule('pill', { 2.5: 0.5, height: 2 }, this.scene);

        // Set initial positions
        this.updateObjectPositions();

        this.scene.registerBeforeRender(() => {
            this.cube.rotation.y += .005;
            this.cone.rotation.y += .005;
            this.pill.rotation.y += .005;
        });
    }

    updateObjectPositions() {
        var degToRadians = function(degrees) {
            return degrees * Math.PI / 180;
        };

        this.cube.position.x = Math.cos(degToRadians(this.car1Angle)) * 2.5;
        this.cube.position.z = Math.sin(degToRadians(this.car1Angle)) * 2.5 - 1;
        this.cone.position.x = Math.cos(degToRadians(this.car2Angle)) * 2.5;
        this.cone.position.z = Math.sin(degToRadians(this.car2Angle)) * 2.5 - 1;
        this.pill.position.x = Math.cos(degToRadians(this.car3Angle)) * 2.5;
        this.pill.position.z = Math.sin(degToRadians(this.car3Angle)) * 2.5 - 1;
    }

    setupGUI() {
        var carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        // Buttons setup
        this.setupButtons(carSelectGUI);
    }

    setupButtons(gui) {
        var nextBtn = BABYLON.GUI.Button.CreateSimpleButton("nextBtn", ">");
        var prevBtn = BABYLON.GUI.Button.CreateSimpleButton("prevBtn", "<");
        var selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select");
        var backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "<");

        // Assuming formatBtn is a global function for styling
        formatBtn(nextBtn);
        formatBtn(prevBtn);
        formatBtn(selectBtn);
        formatBtn(backBtn);

        // Positioning and event bindings
        this.setupButtonPropertiesAndEvents(nextBtn, prevBtn, selectBtn, backBtn);

        gui.addControl(nextBtn);
        gui.addControl(prevBtn);
        gui.addControl(selectBtn);
        gui.addControl(backBtn);
    }

    setupButtonPropertiesAndEvents(nextBtn, prevBtn, selectBtn, backBtn) {
        // Button properties
        nextBtn.width = "10%";
        nextBtn.top = "20%";
        nextBtn.left = "30%";
        prevBtn.width = "10%";
        prevBtn.top = "20%";
        prevBtn.left = "-30%";
        selectBtn.top = "42%";
        backBtn.top = "-42%";
        backBtn.left = "-42%";
        backBtn.width = "15%";

        // Button events
        prevBtn.onPointerUpObservable.add(() => {
            this.rotateObjects(-120);
        });

        

        nextBtn.onPointerUpObservable.add(() => {
            this.rotateObjects(120);
        });


        // Implement the logic for these buttons
        // Add event listener to the "Back" button
        backBtn.onPointerUpObservable.add(() => {
            this.sceneManager.switchToMainMenu(); // Call a method in SceneManager to switch back to the main menu
        });
        // Add event listener to the "Select" button
        selectBtn.onPointerUpObservable.add(() => {
            this.sceneManager.switchToGameScene(); // Call a method in SceneManager to switch back to the main menu
            //TODO: Add logic to send the selected car to the game scene so the user can play with it
        });
    }

    rotateObjects(angleDelta) {
        this.car1Angle += angleDelta;
        this.car2Angle += angleDelta;
        this.car3Angle += angleDelta;
        this.updateObjectPositions();
    }

    render() {
        this.scene.render();
    }
}
