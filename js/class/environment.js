class Environment {
    constructor(_gameScene) {
        this.gameScene = _gameScene;
        this.addStationaryObjects();
    }

    enablePhysics() {
        // Assuming you have included Babylon.js physics plugin before calling this function
        // Add physics impostors to the static objects for collision detection
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
    }

    addStationaryObjects() {
        // Create all the stationary objects like the skybox, ground, lane, etc.
        this.createSkybox();
        this.createGround();
        this.createWater();
        this.createLaneCollisionMesh();
        this.createRampCollisionMesh();
        this.importLaneMesh();
        this.createIslandCollisionMesh();
        this.createIslandMesh();
    }

    createSkybox() {
        // Code for creating the skybox
        // Note: The URLs provided are for illustration purposes only and must be replaced with the actual paths to your skybox images
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, this.gameScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this.gameScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", this.gameScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }

    createGround() {
        // Code for creating the ground
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.gameScene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", this.gameScene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;
        
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, this.gameScene);
        this.ground.material = groundMaterial;
    }

    createWater() {
        // Code for creating the water
        var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { width: 1000, height: 1000 }, this.gameScene);
        var water = new BABYLON.WaterMaterial("water", this.gameScene, new BABYLON.Vector2(512, 512));
        water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", this.gameScene);
        water.addToRenderList(this.ground);
        waterMesh.material = water;
    }

    createLaneCollisionMesh() {
        // Code for creating the lane collision mesh
        this.laneMesh = BABYLON.MeshBuilder.CreateBox("laneCollisionMesh", { width: 2, depth: 10, height: 0.1 }, this.gameScene);
        this.laneMesh.position = new BABYLON.Vector3(0, 0.05, -5); // Positioned slightly above the ground
        this.laneMesh.isVisible = false; // Make it invisible as this is just for collision
    }

    createRampCollisionMesh() {
        // Code for creating the ramp collision mesh
        this.rampMesh = BABYLON.MeshBuilder.CreateBox("rampCollisionMesh", { width: 2, depth: 5, height: 0.1 }, this.gameScene);
        this.rampMesh.position = new BABYLON.Vector3(0, 0.05, 0); // Positioned at the start of the lane
        this.rampMesh.isVisible = false; // Make it invisible as this is just for collision
    }

    importLaneMesh() {
        // Code for importing the lane mesh from Blender
        BABYLON.SceneLoader.ImportMesh("", "obj/", "lane.babylon", this.gameScene, (newMeshes) => {
            this.laneMesh = newMeshes[0];
            this.laneMesh.position = new BABYLON.Vector3(0, 0, -5); // Adjust position as needed
            // Note: You might want to set the material for the laneMesh here if needed
        });
    }

    createIslandCollisionMesh() {
        // Code for creating the island collision mesh
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandCollisionMesh", { width: 4, depth: 4, height: 0.5 }, this.gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 0.25, 10); // Positioned at the end of the lane
        this.islandMesh.isVisible = false; // Make it invisible as this is just for collision
    }

    createIslandMesh() {
        // Code for creating the island mesh where pins sit on
        var island = BABYLON.MeshBuilder.CreateBox("island", { width: 4, depth: 4, height: 0.5 }, this.gameScene);
        island.position = new BABYLON.Vector3(0, 0.25, 10); // Positioned at the end of the lane
        var islandMaterial = new BABYLON.StandardMaterial("islandMaterial", this.gameScene);
        islandMaterial.diffuseTexture = new BABYLON.Texture("textures/planks.jpg", this.gameScene);
        island.material = islandMaterial;
    }
}