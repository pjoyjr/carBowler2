class Environment {
    constructor(gameScene) {
        this.initStationaryObjects(gameScene).catch(error => {
            console.error('Error initializing stationary objects:', error);
        });
    }

    async initStationaryObjects(gameScene) {
        try {
            await Promise.all([
                this.createSkybox(gameScene),
                this.createGround(gameScene),
                this.createWater(gameScene),
                this.createLane(gameScene),
                this.createRamp(gameScene),
                this.createIsland(gameScene)
            ]);
        } catch (error) {
            // Handle or throw the error
            console.error('Error initializing stationary objects:', error);
            throw error;
        }
    }

    async createSkybox(gameScene) {
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, gameScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", gameScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/TropicalSunnyDay", gameScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }

    async createGround(gameScene) {
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", gameScene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/ground.jpg", gameScene);
        groundMaterial.diffuseTexture.uScale = 6;
        groundMaterial.diffuseTexture.vScale = 6;

        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, gameScene);
        this.ground.material = groundMaterial;
    }

    async createWater(gameScene) {
        var waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { width: 1000, height: 1000 }, gameScene);
        var water = new BABYLON.WaterMaterial("water", gameScene, new BABYLON.Vector2(512, 512));
        water.bumpTexture = new BABYLON.Texture("assets/textures/waterbump.png", gameScene);
        water.addToRenderList(this.ground);
        waterMesh.material = water;
    }

    async createLane(gameScene) {
        this.createLaneCollisionMesh(gameScene);
        this.importLaneMesh(gameScene);
    }

    async createRamp(gameScene) {
        this.createRampCollisionMesh(gameScene);
    }

    async createIsland(gameScene) {
        this.createIslandCollisionMesh(gameScene);
        this.createIslandMesh(gameScene);
    }

    createLaneCollisionMesh(gameScene) {
        this.laneMesh = BABYLON.MeshBuilder.CreateBox("laneCollisionMesh", { height: 10, width: 56, depth: 230 }, gameScene);
        this.laneMesh.position = new BABYLON.Vector3(0, 3, -100);
        this.laneMesh.isVisible = true;
    }

    createRampCollisionMesh(gameScene) {
        this.rampMesh = BABYLON.MeshBuilder.CreateBox("rampCollisionMesh", { height: 10, width: 56, depth: 70 }, gameScene);
        this.rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
        this.rampMesh.rotation.x = 31 * Math.PI / 40;
        this.rampMesh.isVisible = true;
    }

    createIslandCollisionMesh(gameScene) {
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandCollisionMesh", { height: 22, width: 70, depth: 70 }, gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 25, 170);
        this.islandMesh.isVisible = true;
    }

    createIslandMesh(gameScene) {
        var island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
        island.position = new BABYLON.Vector3(0, 25, 170);
        var islandMaterial = new BABYLON.StandardMaterial("islandMaterial", gameScene);
        islandMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/planks.jpg", gameScene);
        island.material = islandMaterial;
    }

    importLaneMesh(gameScene) {
        BABYLON.SceneLoader.ImportMesh("", "", "assets/models/lane.babylon", gameScene, (newMeshes) => {
            this.laneMesh = newMeshes[0];
            this.laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
        });
    }

    enablePhysics(gameScene) {
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
    }
}
