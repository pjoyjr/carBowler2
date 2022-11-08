var forceVector = new BABYLON.Vector3(0, -60, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();

class Game{
    constructor(_engine){
        this.engine = _engine;
        this.gameScene = new BABYLON.Scene(engine);
        this.guis = [BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", ""), BABYLON.GUI.Button.CreateSimpleButton("", "")]
        this.setup();
        this.addStationaryObjects();
        this.addLogic();
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
        //addStationaryObjects();
        //addLogic();
    }
}