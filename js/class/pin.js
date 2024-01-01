const PIN_PHYSICS = { mass: 3, restitution: 0.0 };
const PIN_DIM = { height: 30, diameterTop: 5, diameterBottom: 9, tessellation: 12 };
const PIN_HEIGHT = 49;
const PIN_SCALING = new BABYLON.Vector3(5, 5, 5);
const PIN_URL = "obj/pin.babylon";

class Pin {
    constructor(gameScene, index) {
        this.gameScene = gameScene;
        this.index = index;
        this.imposter = null;
        this.mesh = null;
        this.wasStanding = true;

        this.createPin();
    }

    async loadPinMesh() {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("Pin", "", PIN_URL, this.gameScene,
                (importedMeshes) => {
                    const mesh = importedMeshes[0];
                    mesh.scaling = PIN_SCALING;
                    mesh.parent = this.imposter;
                    this.mesh = mesh;
                    resolve(mesh);
                },
                null,
                (message) => {
                    reject(new Error(`Mesh loading error: ${message}`));
                }
            );
        });
    }

    calculatePinPosition() {
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
    }

    async createPin() {
        try {
            this.imposter = new BABYLON.MeshBuilder.CreateCylinder(`imposter${this.index}`, PIN_DIM, this.gameScene);
            this.imposter.position = this.calculatePinPosition();
            this.imposter.material = new BABYLON.StandardMaterial(this.gameScene);
            this.imposter.isVisible = false;

            await this.loadPinMesh();
        } catch (error) {
            console.error('Error creating pin:', error);
        }
    }

    enablePhysics() {
        this.imposter.physicsImpostor = new BABYLON.PhysicsImpostor(this.imposter, BABYLON.PhysicsImpostor.CylinderImpostor, PIN_PHYSICS, this.gameScene);
    }

    dispose() {
        this.imposter.dispose();
        // Dispose the mesh if needed
    }

    reset() {
        this.dispose();
        this.createPin();
    }

    hide() {
        this.imposter.position.x = 2;
    }

    isKnocked() {
        if (this.imposter.getAbsolutePosition().y < 50.5 || this.imposter.getAbsolutePosition().y > 51.5)
            return true;
        return false;
    }
}