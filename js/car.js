class Car {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  }

var addCar = function() {
    var carMeshMat;
    var carMeshAlpha = 1;
    var randomStartPosition = Math.random() * 46 - 23;

    overRamp = false;
    //create bounding box for physics engine
    carMesh = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, gameScene);
    carMesh.position = new BABYLON.Vector3(randomStartPosition, 18, -180);
    carMeshMat = new BABYLON.StandardMaterial(gameScene);
    carMeshMat.alpha = carMeshAlpha;
    carMeshMat.diffuseColor = new BABYLON.Color3(0, 180, 0);
    carMesh.material = carMeshMat;


    //load in car from blender
    BABYLON.SceneLoader.ImportMesh("Cube", "", "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon", gameScene,
        function(newMeshes) {
            car = newMeshes[0];
            car.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
            //car.position = new BABYLON.Vector3(0, 16, -180);
            car.position = carMesh.getAbsolutePosition();
        });

    carMesh.physicsImpostor = new BABYLON.PhysicsImpostor(carMesh, BABYLON.PhysicsImpostor.SphereImpostor, carPHYSICS, gameScene);
    carMoved = false;
};

var rmCar = function() {
    carMesh.dispose();
    car.dispose(); //TODO ENABLE WITH BLENDERIMPORT
};


var addCarMechanics = function() {
    if (map["w"] || map["W"]) {
        carMoved = true;
        speed += accel;
        if (speed > MAXSPEED)
            speed = MAXSPEED;
        if (speed < 0)
            speed = 0;
        var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
        carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition()); //impulse at center of mass;
    } else if (((speed + decel) > 0) && carMoved) {
        speed += decel;
        var ImpulseVector = new BABYLON.Vector3(0, 0, speed);
        carMesh.applyImpulse(ImpulseVector, carMesh.getAbsolutePosition());
    }
    if (map["a"] || map["A"]) {
        if (carMesh.getAbsolutePosition().x > -32)
            carMesh.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
    }

    if (map["d"] || map["D"]) {
        if (carMesh.getAbsolutePosition().x < 32)
            carMesh.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
    }

};