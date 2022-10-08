createMainMenuScene = function() {
    let mainMenuScene = new BABYLON.Scene(engine);
    mainMenuScene.createDefaultCameraOrLight(true, true, true);

    let bgLayer = new BABYLON.Layer('', 'https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/bg.png', mainMenuScene, true);

    let mainMenuGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, mainMenuScene);
    let playBtn = BABYLON.GUI.Button.CreateSimpleButton("playBtn", "Play!");
    formatBtn(playBtn);
    playBtn.top = "42%";
    playBtn.onPointerUpObservable.add(function() {
        currScene = 1;
    });
    mainMenuGUI.addControl(playBtn);

    return mainMenuScene;
};