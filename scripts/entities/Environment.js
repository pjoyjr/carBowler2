class Environment {
    constructor(gameScene) {
        this.gameScene = gameScene;

        // Initialize stationary objects
        this.initStationaryObjects();
    }

    initStationaryObjects() {
        this.createSkybox();
        this.createGround();
        this.createWater();
        this.createLane();
        this.createRamp();
        this.createIsland();
    }

    createSkybox() {
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, this.gameScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this.gameScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/TropicalSunnyDay", this.gameScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }

    createGround() {
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.gameScene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/ground.jpg", this.gameScene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;

        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, this.gameScene);
        this.ground.material = groundMaterial;
    }

    createWater() {
        var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { width: 1000, height: 1000 }, this.gameScene);
        var water = new BABYLON.WaterMaterial("water", this.gameScene, new BABYLON.Vector2(512, 512));
        water.bumpTexture = new BABYLON.Texture("assets/textures/waterbump.png", this.gameScene);
        water.addToRenderList(this.ground);
        waterMesh.material = water;
    }

    createLane() {
        this.createLaneCollisionMesh();
        this.importLaneMesh();
    }

    createRamp() {
        this.createRampCollisionMesh();
    }

    createIsland() {
        this.createIslandCollisionMesh();
        this.createIslandMesh();
    }

    createLaneCollisionMesh() {
        this.laneMesh = BABYLON.MeshBuilder.CreateBox("laneCollisionMesh", { width: 2, depth: 10, height: 0.1 }, this.gameScene);
        this.laneMesh.position = new BABYLON.Vector3(0, 0.05, -5);
        this.laneMesh.isVisible = false;
    }

    createRampCollisionMesh() {
        this.rampMesh = BABYLON.MeshBuilder.CreateBox("rampCollisionMesh", { width: 2, depth: 5, height: 0.1 }, this.gameScene);
        this.rampMesh.position = new BABYLON.Vector3(0, 0.05, 0);
        this.rampMesh.isVisible = false;
    }

    createIslandCollisionMesh() {
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandCollisionMesh", { width: 4, depth: 4, height: 0.5 }, this.gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 0.25, 10);
        this.islandMesh.isVisible = false;
    }

    createIslandMesh() {
        var island = BABYLON.MeshBuilder.CreateBox("island", { width: 4, depth: 4, height: 0.5 }, this.gameScene);
        island.position = new BABYLON.Vector3(0, 0.25, 10);
        var islandMaterial = new BABYLON.StandardMaterial("islandMaterial", this.gameScene);
        islandMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/planks.jpg", this.gameScene);
        island.material = islandMaterial;
    }

    importLaneMesh() {
        BABYLON.SceneLoader.ImportMesh("", "assets/models/", "lane.babylon", this.gameScene, (newMeshes) => {
            this.laneMesh = newMeshes[0];
            this.laneMesh.position = new BABYLON.Vector3(0, 0, -5);
        });
    }

    enablePhysics() {
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.gameScene);
    }
}
