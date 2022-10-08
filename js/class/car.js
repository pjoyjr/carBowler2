//const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";
const CAR_MODEL_URL = "obj/model3.babylon";
const CAR_PHYSICS = { mass: 10, restitution: 0.0 };
const MAXSPEED = 12;
const IMPOSTER_ALPHA = 0;

var keysPressed = {};

class Car {
    constructor(gameScene) {
        this.imposter = this.createImposter(gameScene);
        this.mesh = this.createMesh(gameScene);
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, gameScene);
        this.moved = false;
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.getMeshPosition();
        //car variables
        this.speed = 0;
        this.accel = .2;
        this.decel = -.35;
        this.maxSpeed = MAXSPEED;
        this.overRamp = false;
        this.addController(gameScene);
        this.allowDriving();
    }

    resetPosition(){
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
    }

    createImposter(){
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(gameScene);
        imposterMaterial.alpha = IMPOSTER_ALPHA;
        imposterMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);
        var imposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, gameScene);
        imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        imposter.material = imposterMaterial;
        return imposter;
    }

    createMesh(gameScene){
        var car;
        let imposter = this.imposter;
        BABYLON.SceneLoader.ImportMesh("Cube", "", CAR_MODEL_URL, gameScene,
            function(newMeshes) {
                car = newMeshes[0];
                car.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
                car.position = imposter.getAbsolutePosition();
            });
        return car;
    }

    getMeshPosition(){
        return this.imposter.getAbsolutePosition();
    }

    reset(){
        this.imposter = this.createImposter(gameScene);
        this.mesh = this.createMesh(gameScene);
        this.moved = false;
        
    }

    addController(gameScene){
        gameScene.actionManager = new BABYLON.ActionManager(gameScene);
        gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
            function(evt) {
                keysPressed[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
        gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
            function(evt) {
                keysPressed[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
    }

    allowDriving() {
        if(this.getMeshPosition().y > 16 && this.getMeshPosition().z < 25){
            // if (keysPressed["a"] || keysPressed["A"]) {
            //     if (this.getMeshPosition.x > -32)
            //         this.imposter.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
            // }else if (keysPressed["d"] || keysPressed["D"]) {
            //     if (this.getMeshPosition.x < 32)
            //         this.imposter.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
            // }

            if (keysPressed["w"] || keysPressed["W"]) {
                this.moved = true;
                this.speed += this.accel;
                if (this.speed > MAXSPEED)
                    this.speed = MAXSPEED;
                else if (this.speed < 0)
                    this.speed = 0;
                this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, -this.speed), this.getMeshPosition); //impulse at center of mass;
            } else if (((this.speed + this.decel) > 0) && this.moved) {
                this.speed += this.decel;
                this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, -this.speed), this.getMeshPosition); //impulse at center of mass;
            } else if (this.moved) {
                this.speed = 0;
                var impulse = new BABYLON.Vector3(0, 0, this.speed);
                this.imposter.applyImpulse(impulse, this.getMeshPosition); //impulse at center of mass;
            }
        }else{
            this.overRamp = true
        }
    }
}
