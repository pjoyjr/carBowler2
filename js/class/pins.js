class Pins{
    constructor(gameScene){
        this.meshes = [];
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(gameScene, i);
            this.meshes.push(pin);
        }
        this.isSetup = true;
        this.currBowlCount = 10
    }

    reset(){
        this.currBowlCount = 0;
        for(let pin of this.meshes)
            pin.standing = true;
    }

    countStanding(){
        for (let pin of this.meshes) {
            if(pin.isStanding() == true)
                this.currBowlCount += 1;
        }
    }

}
