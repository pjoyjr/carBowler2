class Car {
    constructor(gameScene) {
        this.gameScene = gameScene;
        //create imposter
        this.imposter = this.createImposter();
        //create mesh
        this.mesh = this.createMesh();
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
        
        this.overRamp = false;
        this.moved = false;
        this.speed = 0;
        this.accel = ACCEL;
        this.decel = DECEL;
        this.maxSpeed = MAXSPEED;
    }

    checkRampStatus(){
        return (this.imposter.getAbsolutePosition().z > 25 || this.imposter.getAbsolutePosition().y < 15) && !this.overRamp
    }

    createImposter(){
        let carImposter;
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(this.gameScene);
        imposterMaterial.alpha = CAR_IMPOSTER_ALPHA;
        //imposterMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);

        carImposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, this.gameScene);
        carImposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        var colors = carImposter.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if(!colors) {
            colors = [];
            var positions = carImposter.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for(var p = 0; p < positions.length / 3; p++) {
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            }
        }
        carImposter.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        carImposter.physicsImpostor = new BABYLON.PhysicsImpostor(carImposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, this.gameScene);

        return carImposter;
    }

    createMesh(){
        let mesh;
        let imposter = this.imposter
        BABYLON.SceneLoader.ImportMesh("Cube", "", CAR_MODEL_URL, this.gameScene,
            function(newMeshes) {
                mesh = newMeshes[0];
                mesh.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
                mesh.position = imposter.getAbsolutePosition();});
        return mesh;
    }

    reset(){
        //this.imposter.dispose();
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter = this.createImposter(this.gameScene);
        this.mesh = this.createMesh(this.gameScene);
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        this.moved = false;
        this.speed = 0;
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
    }

    allowDriving() {
        if (map["a"] || map["A"]) {
            if (this.imposter.getAbsolutePosition().x > -26)
                this.imposter.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
        }else if (map["d"] || map["D"]) {
            if (this.imposter.getAbsolutePosition().x < 26)
                this.imposter.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
        }
        if (map["w"] || map["W"]) {
            this.moved = true;
            this.speed += this.accel;
            if (this.speed > MAXSPEED)
                this.speed = MAXSPEED;
            if (this.speed < 0)
                this.speed = 0;
            this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, this.speed), this.imposter.getAbsolutePosition()); //impulse at center of mass;
        } else if (((this.speed + this.decel) > 0) && this.moved) {
            this.speed += this.decel;
            this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, this.speed), this.imposter.getAbsolutePosition()); //impulse at center of mass;
        }
    }
}

//Function to add car to scene
// var addCar = function() {
//     var carMeshMat;
//     var carMeshAlpha = 1;
//     var randomStartPosition = Math.random() * 46 - 23;

//     overRamp = false;
//     //create bounding box for physics engine
//     carMesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, gameScene);
//     carMesh.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
//     carMeshMat = new BABYLON.StandardMaterial(gameScene);
//     carMeshMat.alpha = carMeshAlpha;
//     carMeshMat.diffuseColor = new BABYLON.Color3(0, 180, 0);
//     carMesh.material = carMeshMat;


//     //load in car from blender
//     BABYLON.SceneLoader.ImportMesh("Cube", "", "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon", gameScene,
//         function(newMeshes) {
//             car = newMeshes[0];
//             car.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
//             //car.position = new BABYLON.Vector3(0, 16, -180);
//             car.position = carMesh.getAbsolutePosition();
//         });

//     carMesh.physicsImpostor = new BABYLON.PhysicsImpostor(carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, gameScene);
//     carMoved = false;
// };

// //Function to remove car
// var rmCar = function() {
//     carMesh.dispose();
//     car.dispose(); //TODO ENABLE WITH BLENDERIMPORT
// };

// //Add action manager for input
// var addController = function() {
//     gameScene.actionManager = new BABYLON.ActionManager(gameScene);
//     gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
//         function(evt) {
//             map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
//         }));
//     gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
//         function(evt) {
//             map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
//         }));
// };

// var addCarMechanics = function() {
//     if (map["w"] || map["W"]) {
//         carMoved = true;
//         speed += accel;
//         if (speed > MAXSPEED)
//             speed = MAXSPEED;
//         if (speed < 0)
//             speed = 0;
//         var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
//         carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition()); //impulse at center of mass;
//     } else if (((speed + decel) > 0) && carMoved) {
//         speed += decel;
//         var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
//         carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition());
//     }
//     if (map["a"] || map["A"]) {
//         if (carMesh.getAbsolutePosition().x > -32)
//             carMesh.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
//     }

//     if (map["d"] || map["D"]) {
//         if (carMesh.getAbsolutePosition().x < 32)
//             carMesh.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
//     }

// };
