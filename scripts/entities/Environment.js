ENVIRONMENT_ALPHAS = 1;

class Environment {
    constructor(gameScene) {
        this.water = null;
        this.waterMesh = null;
        this.ground = null;
        this.laneMesh = null;
        this.rampMesh = null;
        this.island = null;
        this.islandMesh = null;
        this.skybox = null;

        this.skyboxMaterial = null;
        this.groundMaterial = null;
        this.laneMeshMaterial = null;
        this.waterMaterial = null;
        this.islandMaterial = null;

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
                this.createRamp(gameScene),
                this.createIsland(gameScene),
                this.createLane(gameScene)
            ]);
        } catch (error) {
            // Handle or throw the error
            console.error('Error initializing stationary objects:', error);
            throw error;
        }
    }

    async createSkybox(gameScene) {
        this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, gameScene);
        this.skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", gameScene);
        this.skyboxMaterial.backFaceCulling = false;
        this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/TropicalSunnyDay", gameScene);
        this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.disableLighting = true;
        this.skybox.material = this.skyboxMaterial;
        this.skybox.infiniteDistance = true;
    }

    async createGround(gameScene) {
        this.groundMaterial = new BABYLON.StandardMaterial("groundMaterial", gameScene);
        this.groundMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/ground.jpg", gameScene);
        this.groundMaterial.diffuseTexture.uScale = 6;
        this.groundMaterial.diffuseTexture.vScale = 6;

        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, gameScene);
        this.ground.material = this.groundMaterial;
    }

    async createWater(gameScene) {
        this.waterMesh = BABYLON.MeshBuilder.CreateGround("waterMesh", { width: 1000, height: 1000 }, gameScene);
        this.water = new BABYLON.WaterMaterial("water", gameScene, new BABYLON.Vector2(512, 512));
        this.water.bumpTexture = new BABYLON.Texture("assets/textures/waterbump.png", gameScene);
        this.water.addToRenderList(this.ground);
        this.waterMesh.material = this.water;
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
        this.laneMesh.isVisible = ENVIRONMENT_ALPHAS;
    }

    createRampCollisionMesh(gameScene) {
        this.rampMesh = BABYLON.MeshBuilder.CreateBox("rampCollisionMesh", { height: 10, width: 56, depth: 70 }, gameScene);
        this.rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
        this.rampMesh.rotation.x = 31 * Math.PI / 40;
        this.rampMesh.isVisible = ENVIRONMENT_ALPHAS;
    }

    createIslandCollisionMesh(gameScene) {
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandCollisionMesh", { height: 22, width: 70, depth: 70 }, gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 25, 170);
        this.islandMesh.isVisible = ENVIRONMENT_ALPHAS;
    }

    createIslandMesh(gameScene) {
        this.island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
        this.island.position = new BABYLON.Vector3(0, 25, 170);
        this.islandMaterial = new BABYLON.StandardMaterial("islandMaterial", gameScene);
        this.islandMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/planks.jpg", gameScene);
        this.islandMaterial.alpha = 1;
        this.island.material = this.islandMaterial;
        this.island.isVisible = ENVIRONMENT_ALPHAS;
    }

    importLaneMesh(gameScene) {
        BABYLON.SceneLoader.ImportMesh("", "", "assets/models/lane.babylon", gameScene, (newMeshes) => {
            this.laneMesh = newMeshes[0];
            this.laneMesh.position = new BABYLON.Vector3(0, 3, -100);
            this.laneMesh.scaling = new BABYLON.Vector3(30, 8, 120);
            this.laneMesh.isVisible = ENVIRONMENT_ALPHAS;
        });
    }

    enablePhysics(gameScene) {
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, gameScene);
    }
}
