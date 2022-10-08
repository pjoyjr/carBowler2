//const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";
const CAR_MODEL_URL = "obj/model3.babylon";
const CAR_PHYSICS = { mass: 10, restitution: 0.0 };
const MAXSPEED = 12;
const IMPOSTER_ALPHA = 1;

var map = {};

class Car {
    constructor(_gameScene) {
        //create imposter
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(_gameScene);
        imposterMaterial.alpha = IMPOSTER_ALPHA;
        imposterMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);
        var imposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, _gameScene);
        imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        imposter.material = imposterMaterial;
        
        //create mesh
        let mesh;
        BABYLON.SceneLoader.ImportMesh("Cube", "", CAR_MODEL_URL, gameScene,
        function(newMeshes) {
            mesh = newMeshes[0];
            mesh.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
            mesh.position = imposter.getAbsolutePosition();
        });

        this.mesh = mesh;
        this.imposter = imposter;
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, _gameScene);
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
        this.moved = false;
        this.speed = 0;
        this.accel = .2;
        this.decel = -.35;
        this.maxSpeed = MAXSPEED;
        this.overRamp = false;
        this.addController(_gameScene);
    }

    resetPosition(){
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        this.moved = false;
    }

    addController(gameScene){
        gameScene.actionManager = new BABYLON.ActionManager(gameScene);
        gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
            function(evt) {
                map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
        gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
            function(evt) {
                map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
    }

    allowDriving() {
       // console.log(this.imposter.getAbsolutePosition());
        if(this.imposter.getAbsolutePosition().y > 16 && this.imposter.getAbsolutePosition().z < 25){
            if (map["a"] || map["A"]) {
                if (this.imposter.getAbsolutePosition().x > -28)
                    this.imposter.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
            }else if (map["d"] || map["D"]) {
                if (this.imposter.getAbsolutePosition().x < 28)
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
        }else
            this.overRamp = true;
    }
}