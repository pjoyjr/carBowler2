/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/
var addLogic = function() {
    let score = 0, oneThrowAgo = 0, twoThrowAgo = 0, threeThrowAgo = 0, scorecard = [];
    let gameOver = false, extraFrame = false;
    var topFrame = true, frameNum = 1;
    let environment = new Environment(gameScene)
    let pins = new Pins(gameScene)
    let car = new Car(gameScene);
    
    let scoreGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    let frameGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    let speedGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    let lastBowlGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    var gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    let guis = [scoreGUI, frameGUI, speedGUI, lastBowlGUI]
    let guisName = ["Frame:","Score:","Speed:","Last Bowl:"]
    let guisTop = ["-45%","-40%","-35%","-30%"]

    for(var i = 0; i < 4; i++){
        guis[i] = BABYLON.GUI.Button.CreateSimpleButton("", "");
        formatBtn(guis[i]);
        guis[i].textBlock.text= guisName[i];
        guis[i].top = guisTop[i];
        guis[i].left = "40%";
        guis[i].height = "5%";
        guis[i].width = "20%";
        guis[i].textBlock.fontSize = 24;
        gameGUI.addControl(guis[i]);
    }

    gameScene.registerAfterRender(function() {
        // if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
        //     gameOver = true;

        //if (!pins.isSetup && !gameOver){
            // car.resetPosition();
            // speed = 0;
           // pins.cleanupFrame();
            // pins.isSetup = true;
        // }
        if (!gameOver && car.overRamp) { // wait till timer is done then count pins
            let startTimer = new Date();
            cam.position = new BABYLON.Vector3(-45, 120, -20);
            cam.lockedTarget = environment.islandMesh.getAbsolutePosition();
            let endTimer = new Date();
            if ((endTimer - startTimer) >= 7000) {
                //Count pins knocked over after 7w secs
                //pins.cleanupFrame();
                car.reset()
                //MANAGE FRAMES
                if (topFrame && pins.currBowlCount == 10 && frameNum < 10) { //strike on top of frame
                    scorecard.push("-");
                    scorecard.push("X");
                } else if (!topFrame && (pins.currBowlCount + oneThrowAgo[0] == 10) && frameNum < 10) {
                    scorecard.push("/");
                } else if (frameNum < 10) {
                    scorecard.push(pins.currBowlCount);
                } else if (scorecard.length == 18) { //top of 10th frame
                    if (pins.currBowlCount == 10) {
                        extraFrame = true;
                        scorecard.push("X");
                    } else {
                        scorecard.push(pins.currBowlCount);
                    }
                } else if (scorecard.length == 19) { //bottom of 10th frame
                    if (pins.currBowlCount == 10 && oneThrowAgo[0] == 10) {
                        scorecard.push("X");
                        extraFrame = true;
                    } else if ((pins.currBowlCount + oneThrowAgo[0]) == 10) {
                        scorecard.push("/");
                        extraFrame = true;
                    } else {
                        scorecard.push(pins.currBowlCount);
                    }
                } else if (scorecard.length == 20) { //extra frame
                    if ((oneThrowAgo[0] == "X" || oneThrowAgo[0] == "/") && pins.currBowlCount == 10) {
                        scorecard.push("X");
                        extraFrame = true;
                    } else if ((pins.currBowlCount + oneThrowAgo[0]) == 10) {
                        scorecard.push("/");
                        extraFrame = true;
                    } else {
                        scorecard.push(pins.currBowlCount);
                    }
                }
            
                threeThrowAgo = twoThrowAgo;
                twoThrowAgo = oneThrowAgo;
                oneThrowAgo = [pins.currBowlCount, (scorecard.length - 1)]; //[count, index]
                pins.currBowlCount = 0;
                frameNum = Math.floor(scorecard.length / 2) + 1;
                if (scorecard.length % 2 == 0)
                    topFrame = true;
                else
                    topFrame = false;
                if (topFrame || scorecard[18] == "X"){
                    pins.reset()
                }

                //calculate score
                //check for strike
                if (scorecard[threeThrowAgo[1]] == "X")
                    score += 10 + twoThrowAgo[0] + oneThrowAgo[0];
                if (topFrame && frameNum < 12 && !extraFrame) {
                    if ((oneThrowAgo[0] + twoThrowAgo[0] != 10) && oneThrowAgo[0] != 10) { // no spare and no strike
                        score += oneThrowAgo[0] + twoThrowAgo[0];
                    }
                } else if (!topFrame) {
                    //check for spare
                    if (scorecard[twoThrowAgo[1]] == "/")
                        score += 10 + oneThrowAgo[0];
                }
            }
        } else if (gameOver) {
            frameGUI.dispose();
            scoreGUI.dispose();
            speedGUI.dispose();
            score2GUI.dispose();
            
            //end game gui
            let resetBtn;
        
            gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);
            scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("sOUTLINE", "");
            formatBtn(scoreGUI);
            scoreGUI.textBlock.text = "Score: " + score;
            scoreGUI.fontSize = 48;
            scoreGUI.height = "15%";
            scoreGUI.width = "40%";
            gameGUI.addControl(scoreGUI);
        
            resetBtn = BABYLON.GUI.Button.CreateSimpleButton("reset", "Play Again?");
            formatBtn(resetBtn);
            resetBtn.top = "42%";
            resetBtn.onPointerUpObservable.add(function() {
                currScene = 0;
            });
            gameGUI.addControl(resetBtn);
        }
        
        //update GUI
        if (topFrame) {
            frameGUI.textBlock.text = "Top " + frameNum;
        } else {
            frameGUI.textBlock.text = "Bot " + frameNum;
        }
        scoreGUI.textBlock.text = "Score: " + score;
        //speedGUI.textBlock.text = "Speed: " + car.speed.toFixed(2);
        lastBowlGUI.textBlock.text = "Last Bowl: " + oneThrowAgo;
    });
};

var createGameScene = function() {
    gameScene = new BABYLON.Scene(engine);

    //CREATE CAMERA & LIGHTING
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), gameScene); //left view
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), gameScene); //behind view
    cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -200), gameScene); //top view
    //cam = new BABYLON.ArcRotateCamera("cam", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), gameScene); //ARCROTATE Camera
    cam.attachControl(canvas, true);

    light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), gameScene);
    light.intensity = .7;
    
    //CREATE PHYSICS ENGINE
    var forceVector = new BABYLON.Vector3(0, -60, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    gameScene.enablePhysics(forceVector, physicsPlugin);
    addLogic(gameScene);
    
    return gameScene;
};