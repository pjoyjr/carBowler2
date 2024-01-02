class GameController {
    constructor(scene, car) {
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

        // Game entities
        this.scene = scene;
        this.environment = new Environment(this.scene);
        this.car = car;
        // this.pins = new Pins(this.scene);
    }

    addController() {
        // Register keyboard input handlers
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            map[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
            map[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));
    }

    setupPhysics() {
        // Enable physics for game objects
        // this.scene.enablePhysics(forceVector, physicsPlugin);
        // this.environment.enablePhysics();
        // this.car.enablePhysics();
        // this.pins.enablePhysics();
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
        // this.curRollCount = this.pins.countStanding();

        // this.manageFrames();
        this.calculateScore();
        // if ((this.scorecard.length == 20 && !this.extraFrame) || (this.scorecard.length == 21 && this.extraFrame))
        //     this.endGame();
        // else {
        //     delete this.car;
        //     this.car = new Car(this.scene, "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon");
        //     this.car.enablePhysics();
        //     this.pins.reset();
        // }
    }

    main() {
        // Main game loop
        this.addController();
        this.car.allowDriving();
        // if (this.pins.isSetup) {
        //     if (!this.car.overRampStatus()) {
        //         this.car.allowDriving();
        //         this.cam.position = this.car.position.add(new BABYLON.Vector3(0, 50, -250));
        //         this.cam.lockedTarget = this.car.position;
        //     } else {
        //         this.cam.position = new BABYLON.Vector3(0, 160, -50);
        //         this.cam.lockedTarget = this.car.position;
        //         if (!this.counting) {
        //             setTimeout(this.countPinsAndReset.bind(this), 7000);
        //             this.counting = true;
        //         }
        //     }
        // } else {
        //     this.pins.setup();
    }

        // this.updateGUI();
        // }

    // Additional methods (endGame, countPinsAndReset, etc.) from your Game class
}
