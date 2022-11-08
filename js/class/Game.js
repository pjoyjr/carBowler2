class Game{
    constructor(_engine){
        this.engine = _engine;
        this.gameScene = new BABYLON.Scene(engine);
        this.frameGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.speedGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.score2GUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.gameScene);
        this.guis = [this.frameGUI, this.scoreGUI, this.speedGUI, this.score2GUI];

        this.extraFrame = false;
        this.topFrame = true;
        this.frameNum = 1;
        this.scorecard = [,];
        this.score = 0;
        this.oneThrowAgo = 0;
        this.twoThrowAgo = 0;
        this.threeThrowAgo = 0;
        this.curRollCount = 0;
        this.gameOver = false;

        this.environment = null;
        this.car = null;
        this.pins = null;
        this.startTimer = null;
        this.endTimer = null;
        this.startTimer = null;
        this.setup();

        //addLogic functions
    }

    getScene(){
        return this.gameScene;
    }

    updateGUI(){
        let guisText = ["", `Score: ${this.score}`, `Speed: 0`,`Last Bowl: ${this.oneThrowAgo}`]
        // let guisText = ["", `Score: ${this.score}`, `Speed: ${this.car.speed}`,`Last Bowl: ${this.oneThrowAgo}`]
        if (this.topFrame) {
            guisText[0] = [`Top ${this.frameNum}`]
        } else {
            // this.guis[0].textBlock.text = ;
            guisText[0] = [`Bot ${this.frameNum}`]
        }
        let guisTop = ["-45%","-40%","-35%","-30%"]
        let guisName = ["frameGUI", "scoreGUI", "speedGUI", "score2GUI"]
        for (let i = 0; i < this.guis.length; i++){
            this.guis[i] = BABYLON.GUI.Button.CreateSimpleButton(guisName[i], "");
            formatBtn(this.guis[i]);
            this.guis[i].textBlock.text = guisText[i];
            this.guis[i].top = guisTop[i];
            this.guis[i].left = "40%";
            this.guis[i].height = "5%";
            this.guis[i].width = "20%";
            this.guis[i].fontSize = 24;
            this.gameGUI.addControl(this.guis[i]);
        }
    }

    addController(){
        this.gameScene.actionManager = new BABYLON.ActionManager(this.gameScene);
        this.gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        this.gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
    }

    addLogic(){
        this.addController();
        this.updateGUI();
        if ((this.scorecard.length == 20 && !this.extraFrame) || (this.scorecard.length == 21 && this.extraFrame))
            this.gameOver = true;
        if (!this.pins.isSetup && !this.gameOver){
            this.car.reset();
            this.pins.setup();
        }
        if (this.car.checkRampStatus() && this.pins.isSetup) {
            this.car.overRamp = true;
            this.startTimer = new Date();
        }
        // if (!this.car.overRamp) {
        //     this.car.allowDriving();
        // } else 
        // if (!this.gameOver && this.car.overRamp) { // wait till timer is done then count pins
        // cam.position = new BABYLON.Vector3(-45, 120, -20);
        // cam.lockedTarget = this.environment.islandMesh.getAbsolutePosition();
        this.endTimer = new Date();
        if ((this.endTimer - this.startTimer) >= 15000000) {
            //Count pins knocked over after 15 secs
            
            //cleanupFrame
            this.curRollCount = this.pins.countStanding();
            //gameScene.enablePhysics(forceVector, physicsPlugin);
            //this.car.reset();
            //this.pins.isSetup = false;
            //this.car.overRamp = false;

            //manageFrames
            // manageFrames(); // this is where the scorecard is updated TODO: make this a function from game.js
            // calculateScore(); // this is where the score is calculated TODO: make this a function from game.js
        }
        // } else if (this.gameOver) {
        //     endGame();
        // }
        //try 1
        



        //TRY 2
        // addController();
        // resetVariables();

        // gameScene.registerAfterRender(function() {
        //     if (!gameOver)
        //         updateGUI();

        //     if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
        //         gameOver = true;

        //     if (!isSetup && !gameOver)
        //         setupForThrow();

        //     if (carMesh.getAbsolutePosition().z > 25 && !overRamp && isSetup) {
        //         overRamp = true;
        //         startTimer = new Date();
        //     }
        //     if (!overRamp) {
        //         addCarMechanics();
        //     } else if (!gameOver) { // wait till timer is done then count pins
        //         cam.position = new BABYLON.Vector3(-45, 120, -20);
        //         cam.lockedTarget = islandMesh.getAbsolutePosition();
        //         endTimer = new Date();
        //         if ((endTimer - startTimer) >= 10000) {
        //             //Count pins knocked over after 15 secs
        //             cleanupFrame();
        //             manageFrames();
        //             calculateScore();
        //         }
        //     } else if (gameOver) {
        //         endGame();
        //     }
        // });
    }

    setup(){
        cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -200), this.gameScene); //top view
        //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), gameScene); //left view
        //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), gameScene); //behind view
        //cam = new BABYLON.ArcRotateCamera("cam", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), gameScene); //ARCROTATE Camera
        cam.attachControl(canvas, true);
        light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), this.gameScene);
        light.intensity = .7;
        this.gameScene.enablePhysics(forceVector, physicsPlugin);
        
        this.environment = new Environment(this.gameScene);        
        this.car = new Car(this.gameScene);
        this.pins = new Pins(this.gameScene);
        this.gameScene.registerAfterRender(this.addLogic());
    }
}