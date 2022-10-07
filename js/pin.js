const PIN_PHYSICS = { mass: 3, restitution: 0.0 };
const PIN_DIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };
const PIN_HEIGHT = 50;
const PIN_SCALING = new BABYLON.Vector3(5, 5, 5);
//const PIN_URL = "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon";
const PIN_URL = "obj/pin.babylon";

class Pin{
    constructor(gameScene, index){
        var pin = this.createMesh(gameScene, index);
        console.log(pin);
        this.mesh = pin[0];
        this.imposter = pin[1];
    }
    
    createMesh(gameScene, index){
        var imposter = "";
        var mesh = "";
        BABYLON.SceneLoader.ImportMesh("Pin", "", PIN_URL, gameScene,
            function(newMeshes) {
                imposter = new BABYLON.MeshBuilder.CreateCylinder("imposter", PIN_DIM, gameScene);
                switch (index) {
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
                mesh = newMeshes[0];
                mesh.scaling = PIN_SCALING;
                mesh.parent = imposter;
                
            }
        );
        return [mesh, imposter];
    }
            
    dispose(){
        this.imposter.dispose();
        this.mesh.dispose();
    }
            
    isStanding(){
        if (this.imposter.getAbsolutePosition().y < 50.5 || this.imposter.getAbsolutePosition().y > 51.5)
            return false;
        return true;
    }
}