class Car {
    constructor(gameScene) {
        //create bounding box for physics engine
        var randomStartPosition = Math.random() * 46 - 23;
        var meshAlpha = 1;
        this.meshMaterial = new BABYLON.StandardMaterial(gameScene);
        this.meshMaterial.alpha = meshAlpha;
        this.meshMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);
        this.mesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, gameScene);
        this.mesh.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        this.mesh.material = this.carMeshMat;

        var mesh = this.mesh;

        //load in car from blender file
        BABYLON.SceneLoader.ImportMesh("Cube", "", "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon", gameScene,
            function(newMeshes) {
                car = newMeshes[0];
                car.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
                //car.position = new BABYLON.Vector3(0, 16, -180);
                car.position = mesh.getAbsolutePosition();
            });

        
        const carPHYSICS = { mass: 10, restitution: 0.0 };
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, gameScene);
        this.moved = false;
        this.overRamp = false;
    }

    getMesh(){
        return this.mesh;
    }

    setMesh(newMesh){
        {}
    }

    removeCar(){
        this.mesh.dispose();
        this.car.dispose();
    }
}
