class Pins{
    constructor(gameScene){
        this.pins = [];
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(gameScene, i);
            this.pins.push(pin);
        }
        this.isSetup = true;
        this.standing = [true, true, true, true, true, true, true, true, true, true];
        this.currBowlCount = this.countStanding()
    }

    resetStanding(){
        this.standing = [true, true, true, true, true, true, true, true, true, true];
    }

    setup(){
        for (var i = 0; i < 10; i = i + 1) {
            if (this.standing[i]) {
                let pin = new Pin(gameScene, i);
                this.pins.push(pin);
            }
        }
    }

    countStanding(){
        this.currBowlCount = 0;
        for (var i = 0; i < 10; i = i + 1) {
            if((this.standing[i] == true) && (this.pins[i].isStanding))
                this.currBowlCount += 1;
        }
    }

    cleanupFrame(){
        this.countStanding();
        for(var pin in this.pins){
            pin.dispose()
        }
    }
}
