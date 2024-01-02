class Pins {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.meshes = this.createMeshes();
        this.isSetUp = true; // Renamed to isSetUp for consistency
    }

    enablePhysics() {
        for (let pin of this.meshes) {
            pin.enablePhysics();
        }
    }

    cleanupPins() {
        this.isSetUp = false;
        for (let mesh of this.meshes) {
            mesh.dispose();
        }
    }

    createMeshes() {
        const meshes = [];
        for (let i = 0; i < 10; i++) {
            const pin = new Pin(this.gameScene, i);
            meshes.push(pin);
        }
        return meshes;
    }

    setup() {
        for (let pin of this.meshes) {
            if (pin.wasStanding) {
                pin.reset();
            } else {
                pin.hide();
            }
        }
    }

    reset() {
        for (let pin of this.meshes) {
            pin.reset();
        }
    }

    countStanding() {
        console.log("Counting standing pins");
        let currBowlCount = 0;
        for (let pin of this.meshes) {
            if (pin.isKnocked() && pin.wasStanding) {
                pin.wasStanding = false;
                currBowlCount += 1;
            }
        }
        console.log(`Pins standing: ${currBowlCount}`);
        return currBowlCount;
    }
}