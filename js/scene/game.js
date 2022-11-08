/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/
var startTimer;
var gameOver = false, extraFrame = false;
var topFrame = true, frameNum = 1;
// var pins.isSetup = false;
var overRamp = false;

var topFrame = true;
var frameNum = 1;
var scorecard = [];
var score = 0;
var oneThrowAgo = 0; //for spare/strike calculation
var twoThrowAgo = 0; //for spare/strike calculation
var threeThrowAgo = 0; //for spare/strike calculation
var curRollCount = 0;

var pins, car;

var updateGUI = function() {
    if (topFrame) {
        frameGUI.textBlock.text = "Top " + frameNum;
    } else {
        frameGUI.textBlock.text = "Bot " + frameNum;
    }
    scoreGUI.textBlock.text = "Score: " + score;
    speedGUI.textBlock.text = "Speed: " + speed.toFixed(2);
    score2GUI.textBlock.text = "Last Bowl: " + oneThrowAgo;
}

var cleanupFrame = function() {
    curRollCount = countStandingPins();
    //gameScene.enablePhysics(forceVector, physicsPlugin);
    car.reset();
    pins.isSetup = false;
    overRamp = false;
};

var manageFrames = function(pins) {
    if (topFrame && curRollCount == 10 && frameNum < 10) { //strike on top of frame
        scorecard.push("-");
        scorecard.push("X");
    } else if (!topFrame && (curRollCount + oneThrowAgo[0] == 10) && frameNum < 10) {
        scorecard.push("/");
    } else if (frameNum < 10) {
        scorecard.push(curRollCount);
    } else if (scorecard.length == 18) { //top of 10th frame
        if (curRollCount == 10) {
            extraFrame = true;
            scorecard.push("X");
        } else {
            scorecard.push(curRollCount);
        }
    } else if (scorecard.length == 19) { //bottom of 10th frame
        if (curRollCount == 10 && oneThrowAgo[0] == 10) {
            scorecard.push("X");
            extraFrame = true;
        } else if ((curRollCount + oneThrowAgo[0]) == 10) {
            scorecard.push("/");
            extraFrame = true;
        } else {
            scorecard.push(curRollCount);
        }
    } else if (scorecard.length == 20) { //extra frame
        if ((oneThrowAgo[0] == "X" || oneThrowAgo[0] == "/") && curRollCount == 10) {
            scorecard.push("X");
            extraFrame = true;
        } else if ((curRollCount + oneThrowAgo[0]) == 10) {
            scorecard.push("/");
            extraFrame = true;
        } else {
            scorecard.push(curRollCount);
        }
    }

    threeThrowAgo = twoThrowAgo;
    twoThrowAgo = oneThrowAgo;
    oneThrowAgo = [curRollCount, (scorecard.length - 1)]; //[count, index]
    curRollCount = 0;

    frameNum = Math.floor(scorecard.length / 2) + 1;
    if (scorecard.length % 2 == 0)
        topFrame = true;
    else
        topFrame = false;
    if (topFrame || scorecard[18] == "X")
        //TODO: CHECK HERE!!!
        pinStanding  = [true, true, true, true, true, true, true, true, true, true];
};

var checkStrike = function() {
    if (scorecard[threeThrowAgo[1]] == "X")
        score += 10 + twoThrowAgo[0] + oneThrowAgo[0];
};

var checkSpare = function() {
    if (scorecard[twoThrowAgo[1]] == "/")
        score += 10 + oneThrowAgo[0];
};

var calculateScore = function() {
    checkStrike();
    if (topFrame && frameNum < 12 && !extraFrame) {
        if ((oneThrowAgo[0] + twoThrowAgo[0] != 10) && oneThrowAgo[0] != 10) { // no spare and no strike
            score += oneThrowAgo[0] + twoThrowAgo[0];
        }
    } else if (!topFrame) {
        checkSpare();
    }
};

var setupForThrow = function() {
    addCar();
    speed = 0;
    cam.position = new BABYLON.Vector3(0, 40, -250);
    cam.lockedTarget = carMesh.getAbsolutePosition();
    setupPins(pinStanding);
};

var cleanupFrame = function() {
    pins.countStanding();
    car.reset();
};


var endGameGUI = function() {
    var resetBtn;

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
};

var endGame = function() {
    //DISPLAY SCORE AND RETURN TO MAIN MENU AFTER CONFIRMING
    frameGUI.dispose();
    scoreGUI.dispose();
    speedGUI.dispose();
    score2GUI.dispose();
    endGameGUI();
};

var resetVariables = function() {
    topFrame = true;
    frameNum = 1;
    scorecard = [];
    score = 0;
    oneThrowAgo = 0;
    twoThrowAgo = 0;
    threeThrowAgo = 0;
    gameOver = false;
    extraFrame = false;
    pins.isSetup = false;
};

var addLogic = function() {
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
    var environment = new Environment(gameScene)
    pins = new Pins(gameScene)
    car = new Car(gameScene);
    
    createGameGUI();
    gameScene.registerAfterRender(function() {
        updateGUI();

        if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
            gameOver = true;

        if (!pins.isSetup && !gameOver){
            car.reset();
            pins.setup();
        }
        

        if ((car.imposter.getAbsolutePosition().z > 25 || car.imposter.getAbsolutePosition().y < 15) && !overRamp && pins.isSetup) {
            overRamp = true;
            startTimer = new Date();
        }
        if (!overRamp) {
            car.allowDriving();
        } else if (!gameOver && overRamp) { // wait till timer is done then count pins
            cam.position = new BABYLON.Vector3(-45, 120, -20);
            cam.lockedTarget = environment.islandMesh.getAbsolutePosition();
            endTimer = new Date();
            if ((endTimer - startTimer) >= 15000) {
                //Count pins knocked over after 15 secs
                cleanupFrame();
                manageFrames();
                calculateScore();
            }
        } else if (gameOver) {
            endGame();
        }
    });
};