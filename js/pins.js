class Pins{
    constructor(gameScene){
        this.pins = [];
        this.standing = [true, true, true, true, true, true, true, true, true, true];
        this.create();
        this.isSetup = true;
        this.curRollCount = this.countStanding()
    }

    create(){
        for (var i = 0; i < 10; i = i + 1) {
            let pin = new Pin(gameScene, i);
            this.pins.push(pin);
        }
    }

    resetStanding(){
        this.standing = [true, true, true, true, true, true, true, true, true, true];
    }

    cleanup(){
        for(var pin in this.pins){
            pin.dispose()
        }
    }

    setup(){
        for (var i = 0; i < 10; i = i + 1) {
            if (this.standing[i]) {
                let pin = Pin(gameScene, i);
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
}
