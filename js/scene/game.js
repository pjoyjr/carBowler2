var createGameGUI = function() {
    var gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    var scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("scoreGUI", "");
    var frameGUI = BABYLON.GUI.Button.CreateSimpleButton("frameGUI", "");
    var speedGUI = BABYLON.GUI.Button.CreateSimpleButton("speedGUI", "");
    var score2GUI = BABYLON.GUI.Button.CreateSimpleButton("score2GUI", "");

    formatBtn(scoreGUI);
    formatBtn(frameGUI);
    formatBtn(speedGUI);
    formatBtn(score2GUI);

    frameGUI.textBlock.text = "Frame:";
    frameGUI.top = "-45%";
    frameGUI.left = "40%";
    frameGUI.height = "5%";
    frameGUI.width = "20%";
    frameGUI.textBlock.fontSize = 24;

    scoreGUI.textBlock.text = "Score:";
    scoreGUI.top = "-40%";
    scoreGUI.left = "40%";
    scoreGUI.height = "5%";
    scoreGUI.width = "20%";
    scoreGUI.textBlock.fontSize = 24;

    speedGUI.textBlock.text = "Speed:";
    speedGUI.top = "-35%";
    speedGUI.left = "40%";
    speedGUI.height = "5%";
    speedGUI.width = "20%";
    speedGUI.textBlock.fontSize = 24;

    score2GUI.textBlock.text = "Last Bowl:";
    score2GUI.top = "-30%";
    score2GUI.left = "40%";
    score2GUI.height = "5%";
    score2GUI.width = "20%";
    score2GUI.textBlock.fontSize = 24;

    gameGUI.addControl(frameGUI);
    gameGUI.addControl(scoreGUI);
    gameGUI.addControl(speedGUI);
    gameGUI.addControl(score2GUI);
};

//Add action manager for input
var addController = function() {
    gameScene.actionManager = new BABYLON.ActionManager(gameScene);
    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
    gameScene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
        function(evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
};

var addGameLogic = function(pins, car, environment) {
    addController();
    //reset variables
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

    // gameScene.registerAfterRender(function() {
        // if (topFrame) {
        //     frameGUI.textBlock.text = "Top " + frameNum;
        // } else {
        //     frameGUI.textBlock.text = "Bot " + frameNum;
        // }
        // scoreGUI.textBlock.text = "Score: " + score;
        // speedGUI.textBlock.text = "Speed: " + car.speed.toFixed(2);
        // score2GUI.textBlock.text = "Last Bowl: " + oneThrowAgo;
        
    //     if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
    //         gameOver = true;

    //     if (!pins.isSetup && !gameOver){
        //     car = new Car(gameScene)
        //     speed = 0;
        //     cam.position = new BABYLON.Vector3(0, 40, -250);
        //     cam.lockedTarget = car.getMeshPosition();
        //     pins.setup();
        //     pins.isSetup = true;
        // }

    //     if ((car.getMeshPosition().y < 16.5 || car.getMeshPosition().z > 25) && !car.overRamp && pins.isSetup) {
    //         car.overRamp = true;
    //         startTimer = new Date();
    //     }
    //     if(!car.overRamp){
    //         //car.allowDriving();
    //         console.log(car.getMeshPosition());
    //     }
    //     else if (!gameOver) { // wait till timer is done then count pins
    //         cam.position = new BABYLON.Vector3(-45, 120, -20);
    //         cam.lockedTarget = environment.islandMesh.getAbsolutePosition();
    //         endTimer = new Date();
    //         if ((endTimer - startTimer) >= 15000) {
    //             //Count pins knocked over after 15 secs
    //             pins.cleanupFrame();
    //             car.reset()
    //             manageFrames();
    //             calculateScore();
    //         }
    //     } else if (gameOver) {
    //         endGame();
    //     }
    // });
};


//game and score variables
var map = {}; //object for multiple key presses

var gameOver = false;
var extraFrame = false;
var startTimer, endTimer;

var topFrame = true;
var frameNum = 1;
var scorecard = [];
var score = 0;
var oneThrowAgo = 0; //for spare/strike calculation
var twoThrowAgo = 0; //for spare/strike calculation
var threeThrowAgo = 0; //for spare/strike calculation

var manageFrames = function() {
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

var endGame = function() {
    //DISPLAY SCORE AND RETURN TO MAIN MENU AFTER CONFIRMING
    frameGUI.dispose();
    scoreGUI.dispose();
    speedGUI.dispose();
    score2GUI.dispose();
    
    //end game gui
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

var createGameScene = function() {
    gameScene = new BABYLON.Scene(engine);

    //CREATE CAMERA & LIGHTING
    cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(-125, 50, -125), gameScene); //left view
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 50, -250), gameScene); //behind view
    //cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -200), gameScene); //top view
    //cam = new BABYLON.ArcRotateCamera("cam", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), gameScene); //ARCROTATE Camera
    cam.attachControl(canvas, true);

    light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), gameScene);
    light.intensity = .7;
    
    //CREATE PHYSICS ENGINE
    var forceVector = new BABYLON.Vector3(0, -60, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    gameScene.enablePhysics(forceVector, physicsPlugin);
    var environment = new Environment(gameScene);
    var pins = new Pins(gameScene);
    var car = new Car(gameScene);
    createGameGUI();
    addGameLogic(pins, car, environment);
    
    return gameScene;
};