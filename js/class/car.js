//const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";
const CAR_MODEL_URL = "obj/model3.babylon";
const CAR_PHYSICS = { mass: 1, restitution: 0.0, friction: 1 };

const ACCEL = .02;
const DECEL = -.00035;
const MAXSPEED = 1;
const CAR_IMPOSTER_ALPHA = 1;
const CAR_MESH_ALPHA = 0;
var map = {};

class Car {
    constructor(_gameScene) {
        //create imposter
        this.gameScene = _gameScene;
        let imposter;
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(_gameScene);
        imposterMaterial.alpha = CAR_IMPOSTER_ALPHA;
        //imposterMaterial.diffuseColor = new BABYLON.Color3(0, 180, 0);

        imposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, _gameScene);
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

        //imposter.material = imposterMaterial;
        this.imposter = imposter;
        
        //create mesh
        let mesh;
        let meshMaterial = new BABYLON.StandardMaterial(_gameScene);
        meshMaterial.alpha = CAR_MESH_ALPHA;
        BABYLON.SceneLoader.ImportMesh("Cube", "", CAR_MODEL_URL, _gameScene,
        function(newMeshes) {
            mesh = newMeshes[0];
            mesh.material = meshMaterial;
            mesh.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
            mesh.position = imposter.getAbsolutePosition();});
        this.mesh = mesh;

        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, _gameScene);
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
        
        this.moved = false;
        this.speed = 0;
        this.accel = ACCEL;
        this.decel = DECEL;
        this.maxSpeed = MAXSPEED;
        this.addController(_gameScene);
    }

    reset(){
        // this.imposter.dispose();
        // this.mesh.dispose();
        // this.imposter = this.createImposter();
        // this.mesh = this.createMesh();
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
        //this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS,this.gameScene);
        this.moved = false;
        this.speed = 0;
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
    }

    addController(_gameScene){
        _gameScene.actionManager = new BABYLON.ActionManager(_gameScene);
        _gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
            function(evt) {
                map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
        _gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
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