/*
	for Vector3(x,z,y)
	x-axis refers to perpendicular to lane
	z-axis refers to normal to lane
	y-axis refers to parallel to lane
*/
var startTimer;

var addLogic = function() {
    let score = 0, oneThrowAgo = 0, twoThrowAgo = 0, threeThrowAgo = 0, scorecard = [];
    let gameOver = false, extraFrame = false;
    var topFrame = true, frameNum = 1;
    let environment = new Environment(gameScene)
    let pins = new Pins(gameScene)
    let car = new Car(gameScene);
    let isSetup = false;
    var scoreGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    var frameGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    var speedGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    var lastBowlGUI= BABYLON.GUI.Button.CreateSimpleButton("", "");
    var gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, gameScene);
    var overRamp = false;

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
        //update GUI
        if (topFrame) {
            frameGUI.textBlock.text = "Top " + frameNum;
        } else {
            frameGUI.textBlock.text = "Bot " + frameNum;
        }
        scoreGUI.textBlock.text = "Score: " + score;
        speedGUI.textBlock.text = "Speed: " + car.speed.toFixed(2);
        lastBowlGUI.textBlock.text = "Last Bowl: " + oneThrowAgo;

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