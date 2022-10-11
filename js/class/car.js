//const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";
const CAR_MODEL_URL = "obj/model3.babylon";
const CAR_PHYSICS = { mass: 10, restitution: 0.0};

const ACCEL = .2;
const DECEL = -.35;
const MAXSPEED = 12;
const CAR_IMPOSTER_ALPHA = 0;
const CAR_MESH_ALPHA = 1;
var map = {};

class Car {
    constructor(_gameScene) {
        //create imposter
        this.gameScene = _gameScene;
        this.imposter = this.createImposter();
        //create mesh
        this.mesh = this.createMesh();
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
        
        this.moved = false;
        this.speed = 0;
        this.accel = ACCEL;
        this.decel = DECEL;
        this.maxSpeed = MAXSPEED;
        this.addController(_gameScene);
    }

    createImposter(){
        let imposter;
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(this.gameScene);
        imposterMaterial.alpha = CAR_IMPOSTER_ALPHA;
        //imposterMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);

        imposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, this.gameScene);
        imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        var colors = imposter.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if(!colors) {
            colors = [];
            var positions = imposter.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for(var p = 0; p < positions.length / 3; p++) {
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            }
        }
        imposter.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        imposter.physicsImpostor = new BABYLON.PhysicsImpostor(imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, this.gameScene);

        return imposter;
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
        this.imposter.dispose();
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter = this.createImposter();
        this.mesh = this.createMesh();
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        this.moved = false;
        this.speed = 0;
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
    }

    addController(){
        this.gameScene.actionManager = new BABYLON.ActionManager(this.gameScene);
        this.gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
            function(evt) {
                map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
        this.gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
            function(evt) {
                map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
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