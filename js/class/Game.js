class Game{
    constructor(_engine){
        this.engine = _engine;
        this.gameScene = new BABYLON.Scene(engine);
        this.guis = [BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", "")]
        this.topFrame = true;
        
        this.setup();


        //addLogic functions
        this.pins = new Pins(this.gameScene)
        this.car = new Car(this.gameScene)
    }

    getScene(){
        return this.gameScene;
    }

    createGUI(){
        let guisName = ["frameGUI", "scoreGUI", "speedGUI", "score2GUI"]
        let guisText = ["Frame:","Score:","Speed:","Last Bowl:"]
        let guisTop = ["-45%","-40%","-35%","-30%"]
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
        this.gameScene.registerAfterRender(function() {
            //Update GUI
            if (this.topFrame) {
                this.guis[0].textBlock.text = `Top ${this.frameNum}`;
            } else {
                this.guis[0].textBlock.text = `Bot ${this.frameNum}`;
            }
            this.guis[1].textBlock.text = `Score: ${score}`;
            this.guis[2].textBlock.text = `Speed: ${speed.toFixed(2)}`;
            this.guis[3].textBlock.text = `Last Bowl: ${oneThrowAgo}`;
        });

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
        
        this.createGUI();
        let environment = new Environment(this.gameScene);
        //this.addLogic();
    }
}