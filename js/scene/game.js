/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/
var startTimer;
var score = 0, oneThrowAgo = 0, twoThrowAgo = 0, threeThrowAgo = 0, scorecard = [];
var gameOver = false, extraFrame = false;
var topFrame = true, frameNum = 1;
var isSetup = false;
var scoreGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
var frameGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
var speedGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
var lastBowlGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
var gameGUI;
var overRamp = false;

var guis = [scoreGUI, frameGUI, speedGUI, lastBowlGUI]
var guisName = ["Frame:","Score:","Speed:","Last Bowl:"]
var guisTop = ["-45%","-40%","-35%","-30%"]

var createGameGUI = function() {
    gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);

    scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("scoreGUI", "");
    frameGUI = BABYLON.GUI.Button.CreateSimpleButton("frameGUI", "");
    speedGUI = BABYLON.GUI.Button.CreateSimpleButton("speedGUI", "");
    score2GUI = BABYLON.GUI.Button.CreateSimpleButton("score2GUI", "");

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

var updateGUI = function(car) {
    if (topFrame) {
        frameGUI.textBlock.text = "Top " + frameNum;
    } else {
        frameGUI.textBlock.text = "Bot " + frameNum;
    }
    scoreGUI.textBlock.text = "Score: " + score;
    speedGUI.textBlock.text = "Speed: " + car.speed.toFixed(2);
    lastBowlGUI.textBlock.text = "Last Bowl: " + oneThrowAgo;
}

var addLogic = function() {
    var environment = new Environment(gameScene)
    var pins = new Pins(gameScene)
    var car = new Car(gameScene);
    
    createGameGUI();

    gameScene.registerAfterRender(function() {
        updateGUI(car);

        if ((scorecard.length == 20 && !extraFrame) || (scorecard.length == 21 && extraFrame))
            gameOver = true;

        if (!isSetup && !gameOver){
            car.reset();
            pins.setup();
            isSetup = true;
        }
        

        if (car.imposter.getAbsolutePosition().z > 25 && !overRamp && isSetup) {
            overRamp = true;
            startTimer = new Date();
        }
        if (!overRamp) {
            car.allowDriving();
        } else if (!gameOver) { // wait till timer is done then count pins
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