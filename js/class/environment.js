
//const PLANKS_TEXTURE_URL = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/planks.jpg", gameScene);
const PLANKS_TEXTURE_URL = "texture/planks.jpg" 

//alphas for testing
var LANE_MESH_ALPHA = 0;
var RANK_MESH_ALPHA = 0;
var ISLAND_MESH_ALPHA = 0;
var ISLAND_MAT_ALPHA = 1; //leave at 1

class Environment{
    constructor(gameScene){
        this.islandMesh = ""
        this.addStationaryObjects(gameScene);
    }

    addStationaryObjects(gameScene){
        //scene and objects
        var rampMesh, rampMeshMat;
        var island, islandMat;
        var planksTexture = new BABYLON.Texture(PLANKS_TEXTURE_URL, gameScene);

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 2560, gameScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", gameScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/TropicalSunnyDay", gameScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // Ground
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", gameScene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/ground.jpg", gameScene);
        groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
        var ground = BABYLON.Mesh.CreateGround("ground", 2560, 2560, 32, gameScene, false);
        ground.position.y = -1;
        ground.material = groundMaterial;

        // Water
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2560, 2560, 32, gameScene, false);
        var water = new BABYLON.WaterMaterial("water", gameScene);
        water.bumpTexture = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/waterbump.png", gameScene);
        water.windForce = -45;
        water.waveHeight = .5;
        water.windDirection = new BABYLON.Vector2(0, 1);
        water.waterColor = new BABYLON.Color3(0.6, 0.0, 0.6);
        water.colorBlendFactor = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;

        water.addToRenderList(ground);
        waterMesh.material = water;

        //lane mesh for collision
        var laneMesh = BABYLON.MeshBuilder.CreateBox("laneMesh", { height: 10, width: 56, depth: 230 }, gameScene);
        laneMesh.position = new BABYLON.Vector3(0, 5.75, -105);
        var laneMeshMat = new BABYLON.StandardMaterial(gameScene);
        laneMeshMat.alpha = LANE_MESH_ALPHA;
        laneMesh.material = laneMeshMat;
        //ramp mesh for collisions
        var rampMesh = BABYLON.MeshBuilder.CreateBox("rampMesh", { height: 10, width: 56, depth: 70 }, gameScene);
        rampMesh.position = new BABYLON.Vector3(0, 7.5, -11);
        rampMesh.rotation.x = 31 * Math.PI / 40;
        var rampMeshMat = new BABYLON.StandardMaterial(gameScene);
        rampMeshMat.alpha = RANK_MESH_ALPHA;
        rampMesh.material = rampMeshMat;

        //lane with ramp obj from blender
        BABYLON.SceneLoader.ImportMesh("Lane", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/lane.babylon", gameScene,
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
        this.islandMesh = BABYLON.MeshBuilder.CreateBox("islandMesh", { height: 22, width: 70, depth: 70 }, gameScene);
        this.islandMesh.position = new BABYLON.Vector3(0, 25, 170);
        var islandMeshMat = new BABYLON.StandardMaterial("islandMeshMat", gameScene);
        islandMeshMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        islandMeshMat.alpha = ISLAND_MESH_ALPHA;
        this.islandMesh.material = islandMeshMat;

        //island where pins pins sit on
        var island = BABYLON.MeshBuilder.CreateBox("island", { height: 14, width: 70, depth: 70 }, gameScene);
        island.position = new BABYLON.Vector3(0, 25, 170);
        var islandMat = new BABYLON.StandardMaterial("islandMat", gameScene);
        islandMat.alpha = ISLAND_MAT_ALPHA;
        islandMat.diffuseTexture = planksTexture;
        island.material = islandMat;

        //physics imposters
        //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
        this.islandMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.islandMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
        laneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(laneMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
        rampMesh.physicsImpostor = new BABYLON.PhysicsImpostor(rampMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.0 }, gameScene);
    }
}