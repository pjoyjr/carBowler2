class Pins{
    constructor(gameScene){
        this.meshes = this.createMeshes(gameScene);
        this.isSetup = true;
    }

    cleanupPins() {
        this.isSetup = false;
        for(let mesh of this.meshes){
            mesh.dispose();
        }
    };

    //old
    createMeshes(){
        let meshes = [];
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(gameScene, i);
            meshes.push(pin);
        }
        return meshes;
    }    

    setup(){
        for(let pin of this.meshes){
            if(pin.wasStanding)
                pin.resetPosition();
            else
                pin.hide();
        }
    }

    reset(){
        for(let pin of this.meshes){
            pin.resetPosition();
        }
    }

    countStanding(){
        let currBowlCount = 0;
        for (let pin of this.meshes) {
            if(pin.isKnocked() && pin.wasStanding){
                pin.wasStanding = false;
                currBowlCount += 1;
            }
        }
        return currBowlCount;
    }
}
