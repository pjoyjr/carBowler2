class Car {
    constructor(gameScene, carModelURL) {
        this.gameScene = gameScene;
        this.carModelURL = carModelURL;
        this.mesh = null;
        this.imposter = null;
        this.moved = false;
        this.speed = 0;
        this.accel = ACCEL;
        this.decel = DECEL;
        this.maxSpeed = MAXSPEED;
        this.createCar();
    }

    async createCar() {
        try {
            this.imposter = this.createImposter();
            const importedMeshes = await this.loadCarMesh();
            if (importedMeshes.length > 0) {
                this.mesh = importedMeshes[0];
                this.mesh.scaling = new BABYLON.Vector3(5.96, 5.96, 5.96);
                this.mesh.position = this.imposter.getAbsolutePosition();
                // this.enablePhysics(); // Uncomment if physics should be enabled here
            } else {
                throw new Error(`No meshes were imported. Tried to load in meshes for: ${this.carModelURL}`);
            }
        } catch (error) {
            console.error('Error creating car:', error);
        }
    }

    async loadCarMesh() {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("Car", "", this.carModelURL, this.gameScene,
                (importedMeshes) => {
                    resolve(importedMeshes);
                },
                null,
                (message) => {
                    reject(new Error(`Mesh loading error: ${message}`));
                }
            );
        });
    }

    createImposter() {
        let imposter;
        let randomStartPosition = Math.random() * 46 - 23;
        let imposterMaterial = new BABYLON.StandardMaterial(this.gameScene);
        imposterMaterial.alpha = CAR_IMPOSTER_ALPHA;

        imposter = BABYLON.MeshBuilder.CreateSphere("carMesh", { diameter: 12.0 }, this.gameScene);
        imposter.position = new BABYLON.Vector3(randomStartPosition, 22, -180);
        var colors = imposter.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if (!colors) {
            colors = [];
            var positions = imposter.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (var p = 0; p < positions.length / 3; p++) {
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            }
        }
        imposter.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        return imposter;
    }

    enablePhysics() {
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.SphereImpostor, CAR_PHYSICS, this.gameScene);
    }

    reset() {
        let randomStartPosition = Math.random() * 46 - 23;
        this.imposter = this.createImposter(this.gameScene);
        this.mesh = this.createMesh(this.gameScene);
        this.imposter.position = new BABYLON.Vector3(randomStartPosition, 22, -180);
        this.moved = false;
        this.speed = 0;
    }

    allowDriving() {
        if (map["a"] || map["A"]) {
            if (this.imposter.getAbsolutePosition().x > -26)
                this.imposter.translate(BABYLON.Axis.X, -1, BABYLON.Space.WORLD);
        } else if (map["d"] || map["D"]) {
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

    // Getter for car position
    get position() {
        return this.imposter.getAbsolutePosition();
    }

    // Setter for car position
    set position(position) {
        if (position instanceof BABYLON.Vector3) {
            this.imposter.position = position.clone();
        }
    }

    overRampStatus() {
        if (this.imposter.getAbsolutePosition().z > 25 || this.imposter.getAbsolutePosition().y < 15) {
            return true;
        }
        return false;
    }
}