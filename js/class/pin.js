const pinPHYSICS = { mass: 60, restitution: 0.0 };
const PIN_PHYSICS = { mass: 3, restitution: 0.0 };
const PIN_DIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };
const PIN_HEIGHT = 49;
const PIN_SCALING = new BABYLON.Vector3(5, 5, 5);
//const PIN_URL = "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon";
const PIN_URL = "obj/pin.babylon";

class Pin{
    constructor(gameScene, index){
        this.gameScene = gameScene
        this.index = index;

        let imposter = new BABYLON.MeshBuilder.CreateCylinder(`imposter${this.index}`, PIN_DIM, this.gameScene);
        switch (this.index) {
            case 0:
                imposter.position = new BABYLON.Vector3(0, PIN_HEIGHT, 148);
                break;
            case 1:
                imposter.position = new BABYLON.Vector3(-7.5, PIN_HEIGHT, 163);
                break;
            case 2:
                imposter.position = new BABYLON.Vector3(7.5, PIN_HEIGHT, 163);
                break;
            case 3:
                imposter.position = new BABYLON.Vector3(-15, PIN_HEIGHT, 178);
                break;
            case 4:
                imposter.position = new BABYLON.Vector3(0, PIN_HEIGHT, 178);
                break;
            case 5:
                imposter.position = new BABYLON.Vector3(15, PIN_HEIGHT, 178);
                break;
            case 6:
                imposter.position = new BABYLON.Vector3(-22.5, PIN_HEIGHT, 193);
                break;
            case 7:
                imposter.position = new BABYLON.Vector3(-7.5, PIN_HEIGHT, 193);
                break;
            case 8:
                imposter.position = new BABYLON.Vector3(7.5, PIN_HEIGHT, 193);
                break;
            case 9:
                imposter.position = new BABYLON.Vector3(22.5, PIN_HEIGHT, 193);
                break;
        }
        imposter.material = new BABYLON.StandardMaterial(this.gameScene);
        imposter.isVisible = false;this.imposter = imposter;
        
        let mesh;
        BABYLON.SceneLoader.ImportMesh("Pin", "", PIN_URL, this.gameScene,
            function(newMeshes) {
                mesh = newMeshes[0];
                mesh.scaling = PIN_SCALING;
                mesh.parent = imposter;
            }
        );
        this.mesh = mesh;
        this.wasStanding = true;
    }

    enablePhysic(){
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.CylinderImpostor, PIN_PHYSICS, this.gameScene);
    }


    dispose(){
        this.imposter.dispose();
        //this.mesh.dispose();
    }

    reset(){
        this.dispose();
        // this.imposter = this.createImposter(this.gameScene);
        // this.mesh = this.createMesh(this.gameScene);
    }

    hide(){
        this.imposter.position.x = 2;
    }

    isKnocked(){
        if(this.imposter.getAbsolutePosition().y < 50.5 || this.imposter.getAbsolutePosition().y > 51.5)
            return true;
        return false;
    }
}