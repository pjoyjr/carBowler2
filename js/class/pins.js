
var pinStanding = [true, true, true, true, true, true, true, true, true, true];
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10;
var pinMesh, pinMeshAlpha = 0;

//Function to add all pins for next bowl
var setupPins = function(pinsStanding) {
    //CREATE FAKE PIN COLLISION BOUNDS
    pinMesh = new BABYLON.StandardMaterial(gameScene);
    pinMesh.alpha = pinMeshAlpha;
    var pinDIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };
    var pinHeight = 50;

    for (var i = 0; i < 10; i = i + 1) {
        if (pinsStanding[i]) {
            switch (i) {
                case 0:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB1 = BABYLON.MeshBuilder.CreateCylinder("pinB1", pinDIM, gameScene);
                            pinB1.position = new BABYLON.Vector3(0, pinHeight, 148);
                            pinB1.material = pinMesh;
                            pinB1.physicsImpostor = new BABYLON.PhysicsImpostor(pinB1, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin1 = newMeshes[0];
                            pin1.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin1.parent = pinB1;
                        });
                    break;
                case 1:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB2 = BABYLON.MeshBuilder.CreateCylinder("pinB2", pinDIM, gameScene);
                            pinB2.position = new BABYLON.Vector3(-7.5, pinHeight, 163);
                            pinB2.material = pinMesh;
                            pinB2.physicsImpostor = new BABYLON.PhysicsImpostor(pinB2, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin2 = newMeshes[0];
                            pin2.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin2.parent = pinB2;
                        });
                    break;
                case 2:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB3 = BABYLON.MeshBuilder.CreateCylinder("pinB3", pinDIM, gameScene);
                            pinB3.position = new BABYLON.Vector3(7.5, pinHeight, 163);
                            pinB3.material = pinMesh;
                            pinB3.physicsImpostor = new BABYLON.PhysicsImpostor(pinB3, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin3 = newMeshes[0];
                            pin3.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin3.parent = pinB3;
                        });
                    break;
                case 3:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB4 = BABYLON.MeshBuilder.CreateCylinder("pinB4", pinDIM, gameScene);
                            pinB4.position = new BABYLON.Vector3(-15, pinHeight, 178);
                            pinB4.material = pinMesh;
                            pinB4.physicsImpostor = new BABYLON.PhysicsImpostor(pinB4, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin4 = newMeshes[0];
                            pin4.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin4.parent = pinB4;
                        });
                    break;
                case 4:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB5 = BABYLON.MeshBuilder.CreateCylinder("pinB5", pinDIM, gameScene);
                            pinB5.position = new BABYLON.Vector3(0, pinHeight, 178);
                            pinB5.material = pinMesh;
                            pinB5.physicsImpostor = new BABYLON.PhysicsImpostor(pinB5, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin5 = newMeshes[0];
                            pin5.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin5.parent = pinB5;
                        });
                    break;
                case 5:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB6 = BABYLON.MeshBuilder.CreateCylinder("pinB6", pinDIM, gameScene);
                            pinB6.position = new BABYLON.Vector3(15, pinHeight, 178);
                            pinB6.material = pinMesh;
                            pinB6.physicsImpostor = new BABYLON.PhysicsImpostor(pinB6, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin6 = newMeshes[0];
                            pin6.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin6.parent = pinB6;
                        });
                    break;
                case 6:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB7 = BABYLON.MeshBuilder.CreateCylinder("pinB7", pinDIM, gameScene);
                            pinB7.position = new BABYLON.Vector3(-22.5, pinHeight, 193);
                            pinB7.material = pinMesh;
                            pinB7.physicsImpostor = new BABYLON.PhysicsImpostor(pinB7, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin7 = newMeshes[0];
                            pin7.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin7.parent = pinB7;
                        });
                    break;
                case 7:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB8 = BABYLON.MeshBuilder.CreateCylinder("pinB8", pinDIM, gameScene);
                            pinB8.position = new BABYLON.Vector3(-7.5, pinHeight, 193);
                            pinB8.material = pinMesh;
                            pinB8.physicsImpostor = new BABYLON.PhysicsImpostor(pinB8, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin8 = newMeshes[0];
                            pin8.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin8.parent = pinB8;
                        });
                    break;
                case 8:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB9 = BABYLON.MeshBuilder.CreateCylinder("pinB9", pinDIM, gameScene);
                            pinB9.position = new BABYLON.Vector3(7.5, pinHeight, 193);
                            pinB9.material = pinMesh;
                            pinB9.physicsImpostor = new BABYLON.PhysicsImpostor(pinB9, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin9 = newMeshes[0];
                            pin9.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin9.parent = pinB9;
                        });
                    break;
                case 9:
                    BABYLON.SceneLoader.ImportMesh("Pin", "", "https://raw.githubusercontent.com/pjoyjr/carBowling/master/obj/pin.babylon", gameScene,
                        function(newMeshes) {
                            pinB10 = BABYLON.MeshBuilder.CreateCylinder("pinB10", pinDIM, gameScene);
                            pinB10.position = new BABYLON.Vector3(22.5, pinHeight, 193);
                            pinB10.material = pinMesh;
                            pinB10.physicsImpostor = new BABYLON.PhysicsImpostor(pinB10, BABYLON.PhysicsImpostor.CylinderImpostor, pinPHYSICS, gameScene);
                            pin10 = newMeshes[0];
                            pin10.scaling = new BABYLON.Vector3(5, 5, 5);
                            pin10.parent = pinB10;
                        });
                    break;
            }
        }
    }
};

//Function to remove all pins for next bowl
var cleanupPins = function() {
    isSetup = false;

    pinB1.dispose();
    pin1.dispose();
    pinB2.dispose();
    pin2.dispose();
    pinB3.dispose();
    pin3.dispose();
    pinB4.dispose();
    pin4.dispose();
    pinB5.dispose();
    pin5.dispose();
    pinB6.dispose();
    pin6.dispose();
    pinB7.dispose();
    pin7.dispose();
    pinB8.dispose();
    pin8.dispose();
    pinB9.dispose();
    pin9.dispose();
    pinB10.dispose();
    pin10.dispose();
};

var countStandingPins = function() {
    var pinBArray = [pinB1, pinB2, pinB3, pinB4, pinB5, pinB6, pinB7, pinB8, pinB9, pinB10];
    for (var i = 0; i < 10; i = i + 1) {
        if (pinStanding[i]) {
            if (pinBArray[i].getAbsolutePosition().y < 50.5 || pinBArray[i].getAbsolutePosition().y > 51.5) {
                pinStanding[i] = false;
                curRollCount += 1;
            }
        }
    }
};
// class Pins{
//     constructor(gameScene){
//         this.meshes = this.createMeshes(gameScene);
//         this.isSetup = true;
//     }

//     cleanupPins() {
//         this.isSetup = false;
//         for(let mesh of this.meshes){
//             mesh.dispose();
//         }
//     };

//     //old
//     createMeshes(){
//         let meshes = [];
//         for (var i = 0; i < 10; i = i + 1) {
//             let pin = new Pin(gameScene, i);
//             meshes.push(pin);
//         }
//         return meshes;
//     }    

//     setup(){
//         for(let pin of this.meshes){
//             if(pin.wasStanding)
//                 pin.reset();
//             else
//                 pin.hide();
//         }
//     }

//     reset(){
//         for(let pin of this.meshes){
//             pin.reset();
//         }
//     }

//     countStanding(){
//         let currBowlCount = 0;
//         for (let pin of this.meshes) {
//             if(pin.isKnocked() && pin.wasStanding){
//                 pin.wasStanding = false;
//                 currBowlCount += 1;
//             }
//         }
//         return currBowlCount;
//     }
// }
