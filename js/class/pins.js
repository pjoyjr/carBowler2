class Pins{
    constructor(gameScene){
        this.meshes = [];
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(gameScene, i);
            this.meshes.push(pin);
        }
        this.standing = [true,true,true,true,true,true,true,true,true,true];
        this.currBowlCount = 10
    }
    
    setup(){
        for(var i = 0; i < 10; i++){
            if(this.standing[i])
                this.meshes[i].reset();
        }
    }

    reset(){
        this.currBowlCount = 0;
        for(let pin of this.meshes)
            pin.reset();
    }

    countStanding(){
        for (let pin of this.meshes) {
            if(pin.isStanding())
                this.currBowlCount += 1;
        }
    }

}
