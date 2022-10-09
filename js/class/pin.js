const PIN_PHYSICS = { mass: .5, restitution: 0.0 };
const PIN_DIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };
const PIN_HEIGHT = 49;
const PIN_SCALING = new BABYLON.Vector3(5, 5, 5);
//const PIN_URL = "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon";
const PIN_URL = "obj/pin.babylon";

class Pin{
    constructor(gameScene, index){
        this.index = index;
        this.imposter = this.createImposter(gameScene);
        this.mesh = this.createMesh(gameScene);
        this.wasStanding = true;
    }

    dispose(){
        this.imposter.dispose();
        this.mesh.dispose();
    }
    
    createMesh(gameScene){
        let mesh;
        let imposter = this.imposter;
        BABYLON.SceneLoader.ImportMesh("Pin", "", PIN_URL, gameScene,
            function(newMeshes) {
                mesh = newMeshes[0];
                mesh.scaling = PIN_SCALING;
                mesh.parent = imposter;
            }
        );
        return mesh;
    }

    createImposter(gameScene){
        let imposter = new BABYLON.MeshBuilder.CreateCylinder(`imposter${this.index}`, PIN_DIM, gameScene);
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
        imposter.material = new BABYLON.StandardMaterial(gameScene);
        imposter.isVisible = false;
        imposter.physicsImpostor = new BABYLON.PhysicsImpostor(imposter, BABYLON.PhysicsImpostor.CylinderImpostor, PIN_PHYSICS, gameScene);
        return imposter;
    }

    //old
    resetPosition(){
        if (this.wasStanding){
            switch (this.index) {
                case 0:
                    this.imposter.position = new BABYLON.Vector3(0, PIN_HEIGHT, 148);
                    break;
                case 1:
                    this.imposter.position = new BABYLON.Vector3(-7.5, PIN_HEIGHT, 163);
                    break;
                case 2:
                    this.imposter.position = new BABYLON.Vector3(7.5, PIN_HEIGHT, 163);
                    break;
                case 3:
                    this.imposter.position = new BABYLON.Vector3(-15, PIN_HEIGHT, 178);
                    break;
                case 4:
                    this.imposter.position = new BABYLON.Vector3(0, PIN_HEIGHT, 178);
                    break;
                case 5:
                    this.imposter.position = new BABYLON.Vector3(15, PIN_HEIGHT, 178);
                    break;
                case 6:
                    this.imposter.position = new BABYLON.Vector3(-22.5, PIN_HEIGHT, 193);
                    break;
                case 7:
                    this.imposter.position = new BABYLON.Vector3(-7.5, PIN_HEIGHT, 193);
                    break;
                case 8:
                    this.imposter.position = new BABYLON.Vector3(7.5, PIN_HEIGHT, 193);
                    break;
                case 9:
                    this.imposter.position = new BABYLON.Vector3(22.5, PIN_HEIGHT, 193);
                    break;
            }
        }else{
            this.dispose();
        }
        
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