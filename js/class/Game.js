var score =0;
oneThrowAgo = 0;

class Game{
    constructor(_engine){
        this.engine = _engine;
        this.gameScene = new BABYLON.Scene(engine);
        this.frameGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.speedGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.score2GUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.guis = [this.frameGUI, this.scoreGUI, this.speedGUI, this.score2GUI];
        this.topFrame = true;
        this.frameNum = 1;
        this.car = null;
        this.pins = null;
        this.setup();

        //addLogic functions
    }

    getScene(){
        return this.gameScene;
    }

    updateGUI(){
        let guisText = ["", `Score: ${score}`, `Speed: ${speed.toFixed(2)}`,`Last Bowl: ${oneThrowAgo}`]
        if (this.topFrame) {
            guisText[0] = [`Top ${this.frameNum}`]
        } else {
            // this.guis[0].textBlock.text = ;
            guisText[0] = [`Bot ${this.frameNum}`]
        }
        let guisTop = ["-45%","-40%","-35%","-30%"]
        let guisName = ["frameGUI", "scoreGUI", "speedGUI", "score2GUI"]
        var gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.gameScene);
        for (let i = 0; i < this.guis.length; i++){
            this.guis[i] = BABYLON.GUI.Button.CreateSimpleButton(guisName[i], "");
            formatBtn(this.guis[i]);
            this.guis[i].textBlock.text = guisText[i];
            this.guis[i].top = guisTop[i];
            this.guis[i].left = "40%";
            this.guis[i].height = "5%";
            this.guis[i].width = "20%";
            this.guis[i].fontSize = 24;
            gameGUI.addControl(this.guis[i]);
        }
    }

    addLogic(){
        

        //try 1
        // if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
        //     gameOver = true;

        // if (!pins.isSetup && !gameOver){
        //     car.reset();
        //     pins.setup();
        // }
        

        // if ((car.imposter.getAbsolutePosition().z > 25 || car.imposter.getAbsolutePosition().y < 15) && !overRamp && pins.isSetup) {
        //     overRamp = true;
        //     startTimer = new Date();
        // }
        // if (!overRamp) {
        //     car.allowDriving();
        // } else if (!gameOver && overRamp) { // wait till timer is done then count pins
        //     cam.position = new BABYLON.Vector3(-45, 120, -20);
        //     cam.lockedTarget = environment.islandMesh.getAbsolutePosition();
        //     endTimer = new Date();
        //     if ((endTimer - startTimer) >= 15000) {
        //         //Count pins knocked over after 15 secs
        //         cleanupFrame();
        //         manageFrames();
        //         calculateScore();
        //     }
        // } else if (gameOver) {
        //     endGame();
        // }


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
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), gameScene);
        light.intensity = .7;
        this.gameScene.enablePhysics(forceVector, physicsPlugin);
        
        this.updateGUI();
        let environment = new Environment(this.gameScene);        
        this.car = new Car(this.gameScene);
        this.pins = new Pins(this.gameScene);
        this.gameScene.registerAfterRender(function() {
            //Update GUI
            
        });
    }
}