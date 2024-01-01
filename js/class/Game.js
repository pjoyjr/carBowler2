class Game {
    constructor(engine) {
        // Bowling game specific properties
        this.extraFrame = false;
        this.topFrame = true;
        this.frameNum = 1;
        this.scorecard = [];
        this.score = 0;
        this.oneThrowAgo = 0;
        this.twoThrowAgo = 0;
        this.threeThrowAgo = 0;
        this.curRollCount = 0;
        this.gameOver = false;
        this.counting = false;

        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        this.setupGUI();
        // Setting up the environment and game objects
        this.environment = new Environment(this.scene);
        this.car = new Car(this.scene, "model3.babylon");
        this.pins = new Pins(this.scene);
        // this.setupPhysics();
        this.cam = this.setupCamera();

        // Main game loop
        this.scene.registerAfterRender(
            () => this.main()
        );
    }

    getScene() {
        // Return the created scene
        return this.scene;
    }

    setupGUI() {
        // Initialize GUI elements
        this.frameGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.scoreGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.speedGUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.score2GUI = BABYLON.GUI.Button.CreateSimpleButton("", "");
        this.gameGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        this.guis = [this.frameGUI, this.scoreGUI, this.speedGUI, this.score2GUI];
    }

    setupCamera() {
        // Initialize camera
        let cam = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 45, -300), this.scene);
        cam.lockedTarget = this.car.position;
        return cam;
    }

    setupPhysics() {
        // Enable physics for game objects
        this.environment.enablePhysics();
        this.car.enablePhysics();
        this.pins.enablePhysics();
        this.scene.enablePhysics(forceVector, physicsPlugin);
    }

    updateGUI() {
        // Update GUI elements
        let guisText = ["", `Score: ${this.score}`, `Speed: ${this.car.speed}`, `Last Bowl: ${this.oneThrowAgo}`];
        if (this.topFrame) {
            guisText[0] = [`Top ${this.frameNum}`];
        } else {
            guisText[0] = [`Bot ${this.frameNum}`];
        }
        let guisTop = ["-45%", "-40%", "-35%", "-30%"];
        let guisName = ["frameGUI", "scoreGUI", "speedGUI", "score2GUI"];
        for (let i = 0; i < this.guis.length; i++) {
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

    addController() {
        // Register keyboard input handlers
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
    }

    manageFrames() {
        // Manage frames and scoring logic
        if (this.topFrame && this.curRollCount == 10 && this.frameNum < 10) {
            // Handle strike on top frame
            this.scorecard.push("-");
            this.scorecard.push("X");
        } else if (!this.topFrame && this.curRollCount + this.oneThrowAgo[0] == 10 && this.frameNum < 10) {
            // Handle spare on bottom frame
            this.scorecard.push("/");
        } else if (this.frameNum < 10) {
            // Handle regular frame
            this.scorecard.push(this.curRollCount);
        } else if (this.scorecard.length == 18) {
            // Handle top of the 10th frame
            if (this.curRollCount == 10) {
                this.extraFrame = true;
                this.scorecard.push("X");
            } else {
                this.scorecard.push(this.curRollCount);
            }
        } else if (this.scorecard.length == 19) {
            // Handle bottom of the 10th frame
            if (this.curRollCount == 10 && this.oneThrowAgo[0] == 10) {
                this.scorecard.push("X");
                this.extraFrame = true;
            } else if ((this.curRollCount + this.oneThrowAgo[0]) == 10) {
                this.scorecard.push("/");
                this.extraFrame = true;
            } else {
                this.scorecard.push(this.curRollCount);
            }
        } else if (this.scorecard.length == 20) {
            // Handle extra frame
            if ((this.oneThrowAgo[0] == "X" || this.oneThrowAgo[0] == "/") && this.curRollCount == 10) {
                this.scorecard.push("X");
                this.extraFrame = true;
            } else if (this.curRollCount + this.oneThrowAgo[0] == 10) {
                this.scorecard.push("/");
                this.extraFrame = true;
            } else {
                this.scorecard.push(this.curRollCount);
            }
        }

        this.threeThrowAgo = this.twoThrowAgo;
        this.twoThrowAgo = this.oneThrowAgo;
        this.oneThrowAgo = [this.curRollCount, (this.scorecard.length - 1)];
        this.curRollCount = 0;

        this.frameNum = Math.floor(this.scorecard.length / 2) + 1;
        if (this.scorecard.length % 2 == 0)
            this.topFrame = true;
        else
            this.topFrame = false;
        if (this.topFrame || this.scorecard[18] == "X") {
            // Handle frame transitions
            console.log(this.scorecard);
        }
    }

    checkStrike() {
        // Check for strikes and update the score
        if (this.scorecard[this.threeThrowAgo[1]] == "X")
            this.score += 10 + this.twoThrowAgo[0] + this.oneThrowAgo[0];
    }

    checkSpare() {
        // Check for spares and update the score
        if (this.scorecard[this.twoThrowAgo[1]] == "/")
            this.score += 10 + this.oneThrowAgo[0];
    }

    calculateScore() {
        // Calculate the player's score based on the scorecard
        this.checkStrike();
        if (this.topFrame && this.frameNum < 12 && !this.extraFrame) {
            if ((this.oneThrowAgo[0] + this.twoThrowAgo[0] != 10) && this.oneThrowAgo[0] != 10) {
                // No spare and no strike
                this.score += this.oneThrowAgo[0] + this.twoThrowAgo[0];
            }
        } else if (!this.topFrame) {
            this.checkSpare();
        }
    }

    endGameGUI() {
        // Display end-of-game GUI elements
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
        resetBtn.onPointerUpObservable.add(function () {
            currScene = 0;
        });
        gameGUI.addControl(resetBtn);
    }

    endGame() {
        // Handle end of the game, including GUI cleanup
        frameGUI.dispose();
        scoreGUI.dispose();
        speedGUI.dispose();
        score2GUI.dispose();
        endGameGUI();
    }

    countPinsAndReset = () => {
        // Count standing pins, manage frames, and reset game state
        this.curRollCount = this.pins.countStanding();

        this.manageFrames();
        this.calculateScore();
        if ((this.scorecard.length == 20 && !this.extraFrame) || (this.scorecard.length == 21 && this.extraFrame))
            this.endGame();
        else {
            delete this.car;
            this.car = new Car(this.scene, "model3.babylon");
            this.car.enablePhysics();
            this.pins.reset();
            this.scene.enablePhysics(forceVector, physicsPlugin);
        }
    }

    main() {
        // Main game loop
        this.addController();

        if (this.pins.isSetup) {
            if (!this.car.overRampStatus()) {
                this.car.allowDriving();
                this.cam.position = this.car.position.add(new BABYLON.Vector3(0, 50, -250));
                this.cam.lockedTarget = this.car.position;
            } else {
                this.cam.position = new BABYLON.Vector3(0, 160, -50);
                this.cam.lockedTarget = this.car.position;
                if (!this.counting) {
                    setTimeout(this.countPinsAndReset.bind(this), 7000);
                    this.counting = true;
                }
            }
        } else {
            this.pins.setup();
        }

        this.updateGUI();
    }

    setup() {
        // Initialize the game's initial setup, cameras, and physics
        this.cam.attachControl(canvas, true);
        light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), this.scene);
        light.intensity = 0.7;
        this.scene.enablePhysics(forceVector, physicsPlugin);
    }
}