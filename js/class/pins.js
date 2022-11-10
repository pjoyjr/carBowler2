class Pins{
    constructor(gameScene){
        this.gameScene = gameScene
        this.meshes = this.createMeshes();
        this.isSetup = true;
    }

    enablePhysics(){
        for(let pin of this.meshes){
            pin.enablePhysic();
        }
    }

    cleanupPins() {
        this.isSetup = false;
        for(let mesh of this.meshes){
            mesh.dispose();
        }
    }

    createMeshes(){
        let meshes = [];
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(this.gameScene, i);
            meshes.push(pin);
        }
        return meshes;
    }    
    
    setup(){
        for(let pin of this.meshes){
            if(pin.wasStanding)
                pin.reset();
            else
                pin.hide();
        }
    }

    reset(){
        for(let pin of this.meshes){
            pin.reset();
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
};