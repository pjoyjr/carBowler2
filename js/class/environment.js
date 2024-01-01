class Environment{
    constructor(_gameScene){
        this.gameScene = _gameScene;
        this.islandMesh = "";
        this.laneMesh = "";
        this.rampMesh = "";
        this.ground = "";
        this.addStationaryObjects();
    }

    enablePhysics(){
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, this.gameScene);
        this.laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, this.gameScene);
        this.rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, this.gameScene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, this.gameScene);
    }
    addStationaryObjects(){
        //scene and objects
        var rampMeshMat;
        var island, islandMat;
        var planksTexture = new BABYLON.Texture(PLANKS_TEXTURE_URL, this.gameScene);

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1600, this.gameScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.gameScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/TropicalSunnyDay", this.gameScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // Ground
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.gameScene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/ground.jpg", this.gameScene);
        groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
        this.ground = BABYLON.Mesh.CreateGround("ground", 1600, 1600, 32, this.gameScene, false);
        this.ground.position.y = -1;
        this.ground.material = groundMaterial;

        // Water
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1600, 1600, 32, this.gameScene, false);
        var water = new BABYLON.WaterMaterial("water", this.gameScene);
        water.bumpTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/waterbump.png", this.gameScene);
        water.windForce = -45;
        water.waveHeight = .5;
        water.windDirection = new BABYLON.Vector2(0, 1);
        water.waterColor = new BABYLON.Color3(0.6, 0.0, 0.6);
        water.colorBlendFactor = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;

        water.addToRenderList(this.ground);
        waterMesh.material = water;

        //lane mesh for collision
        this.laneMesh = BABYLON.MeshBuilder.CreateBox("laneMesh", { height: 10, width: 56, depth: 230 }, this.gameScene);
        this.laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
        var laneMeshMat = new BABYLON.StandardMaterial(this.gameScene);
        laneMeshMat.alpha = LANE_MESH_ALPHA;
        this.laneMesh.material = laneMeshMat;
        //ramp mesh for collisions
        this.rampMesh = BABYLON.MeshBuilder.CreateBox("rampMesh", { height: 10, width: 56, depth: 70 }, this.gameScene);
        this.rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
        this.rampMesh.rotation.x = 31 * Math.PI / 40;
        var rampMeshMat = new BABYLON.StandardMaterial(this.gameScene);
        rampMeshMat.alpha = RANK_MESH_ALPHA;
        this.rampMesh.material = rampMeshMat;

        //lane with ramp obj from blender
        BABYLON.SceneLoader.ImportMesh("Lane", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/lane.babylon", this.gameScene,
            function(newMeshes) {
                var lane = newMeshes[0];
                lane.position = new BABYLON.Vector3(0, 3, -100);
                lane.scaling = new BABYLON.Vector3(30, 8, 120);
                var copyMat = laneMeshMat;
                copyMat.alpha = 1;
                copyMat.diffuseTexture = planksTexture;
                lane.material = copyMat;
            });

        //CREATE ISLAND FOR PINS
        //island for collision and bounce
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, this.gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 25, 170);
        var islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", this.gameScene);
        islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        islandMeshMat.alpha = ISLAND_MESH_ALPHA;
        this.islandMesh.material = islandMeshMat;

        //island where pins pins sit on
        var island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, this.gameScene);
        island.position = new BABYLON.Vector3(0, 25, 170);
        var islandMat = new BABYLON.StandardMaterial("islandMat", this.gameScene);
        islandMat.alpha = ISLAND_MAT_ALPHA;
        islandMat.diffuseTexture = planksTexture;
        island.material = islandMat;
    }
}