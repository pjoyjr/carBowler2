class Car {
    constructor(gameScene) {
        this.gameScene = gameScene;
        //create imposter
        
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
        this.imposter = imposter;
        //create mesh
        let mesh;
        BABYLON.SceneLoader.ImportMesh("Cube", "", CAR_MODEL_URL, this.gameScene,
            function(newMeshes) {
                mesh = newMeshes[0];
                mesh.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
                mesh.position = imposter.getAbsolutePosition();});
        this.mesh = mesh;
        cam.position = new BABYLON.Vector3(0, 40, -250);
        cam.lockedTarget = this.imposter.getAbsolutePosition();
        
        this.overRamp = false;
        this.moved = false;
        this.speed = 0;
        this.accel = ACCEL;
        this.decel = DECEL;
        this.maxSpeed = MAXSPEED;
    }

    getMeshAbsolutePosition(){
        this.imposter.getAbsolutePosition();
    }

    checkRampStatus(){
        return (this.imposter.getAbsolutePosition().z > 25 || this.imposter.getAbsolutePosition().y < 15) && !this.overRamp
    }

    enablePhysics(){
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, this.gameScene);
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
        if(map["a"] || map["A"]) {
            if (this.imposter.getAbsolutePosition().x > -26)
                this.imposter.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
        }else if(map["d"] || map["D"]) {
            if (this.imposter.getAbsolutePosition().x < 26)
                this.imposter.translate(BABYLON.Axis.X, 1, BABYLON.Space.WORLD);
        }
        if(map["w"] || map["W"]) {
            this.moved = true;
            this.speed += this.accel;
            if (this.speed > MAXSPEED)
                this.speed = MAXSPEED;
            if (this.speed < 0)
                this.speed = 0;
            this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, this.speed), this.imposter.getAbsolutePosition()); //impulse at center of mass;
        }else if(((this.speed + this.decel) > 0) && this.moved) {
            this.speed += this.decel;
            this.imposter.applyImpulse(new BABYLON.Vector3(0, 0, this.speed), this.imposter.getAbsolutePosition()); //impulse at center of mass;
        }
    }
}