
var degToRadians = function(degrees) {
    var radians = degrees * Math.PI / 180;
    return radians;
};

var createCarSelectScene = function() {
    var carSelectScene = new BABYLON.Scene(engine);
    var car1Angle = 210,
        car2Angle = 330,
        car3Angle = 90,
        carSelectNum = 0;

    carSelectScene.clearColor = new BABYLON.Color3.Purple();
    cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 10, 2), carSelectScene);
    cam.lockedTarget = new BABYLON.Vector3.Zero();
    cam.attachControl(canvas, true);
    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), carSelectScene);

    var cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, carSelectScene);
    var cone = BABYLON.MeshBuilder.CreateCylinder("cone", { diameterTop: .25, height: 1, tessellation: 24 }, carSelectScene);
    var pill = new BABYLON.Mesh.CreateCapsule('pill', { 2.5: 0.5, height: 2 }, carSelectScene)
    cube.position.x = Math.cos(degToRadians(car1Angle)) * 2.5;
    cube.position.z = Math.sin(degToRadians(car1Angle)) * 2.5 - 1;
    cone.position.x = Math.cos(degToRadians(car2Angle)) * 2.5;
    cone.position.z = Math.sin(degToRadians(car2Angle)) * 2.5 - 1;
    cone.rotation.x = 90;
    cone.rotation.z = 90;
    pill.position.x = Math.cos(degToRadians(car3Angle)) * 2.5;
    pill.position.z = Math.sin(degToRadians(car3Angle)) * 2.5 - 1;
    pill.rotation.x = 90;
    pill.rotation.z = -90;

    carSelectScene.registerBeforeRender(function() {
        cube.rotation.y += .005;
        cone.rotation.y += .005;
        pill.rotation.y += .005;
    });

    var carSelectGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, carSelectScene);
    var nextBtn = BABYLON.GUI.Button.CreateSimpleButton("nextBtn", ">");
    var prevBtn = BABYLON.GUI.Button.CreateSimpleButton("prevBtn", "<");
    var selectBtn = BABYLON.GUI.Button.CreateSimpleButton("selectBtn", "Select");
    var backBtn = BABYLON.GUI.Button.CreateSimpleButton("backBtn", "<");
    formatBtn(nextBtn);
    formatBtn(prevBtn);
    nextBtn.width = "10%";
    nextBtn.top = "20%";
    nextBtn.left = "30%";
    prevBtn.width = "10%";
    prevBtn.top = "20%";
    prevBtn.left = "-30%";
    formatBtn(selectBtn);
    selectBtn.top = "42%";
    formatBtn(backBtn);
    backBtn.top = "-42%";
    backBtn.left = "-42%";
    backBtn.width = "15%";

    prevBtn.onPointerUpObservable.add(function() {
        car1Angle += 120;
        car2Angle += 120;
        car3Angle += 120;
        carSelectNum = (carSelectNum - 1) % 3;
    
        cube.position.x = Math.cos(degToRadians(car1Angle)) * 2.5;
        cube.position.z = Math.sin(degToRadians(car1Angle)) * 2.5 - 1;
        cone.position.x = Math.cos(degToRadians(car2Angle)) * 2.5;
        cone.position.z = Math.sin(degToRadians(car2Angle)) * 2.5 - 1;
        pill.position.x = Math.cos(degToRadians(car3Angle)) * 2.5;
        pill.position.z = Math.sin(degToRadians(car3Angle)) * 2.5 - 1;
    });

    nextBtn.onPointerUpObservable.add(function() {
        car1Angle -= 120;
        car2Angle -= 120;
        car3Angle -= 120;
        carSelectNum = (carSelectNum + 1) % 3;
    
        cube.position.x = Math.cos(degToRadians(car1Angle)) * 2.5;
        cube.position.z = Math.sin(degToRadians(car1Angle)) * 2.5 - 1;
        cone.position.x = Math.cos(degToRadians(car2Angle)) * 2.5;
        cone.position.z = Math.sin(degToRadians(car2Angle)) * 2.5 - 1;
        pill.position.x = Math.cos(degToRadians(car3Angle)) * 2.5;
        pill.position.z = Math.sin(degToRadians(car3Angle)) * 2.5 - 1;
    });

    backBtn.onPointerUpObservable.add(function() {
        currScene = 0;
    });

    selectBtn.onPointerUpObservable.add(function() {
        currScene = 2;
    });

    carSelectGUI.addControl(nextBtn);
    carSelectGUI.addControl(prevBtn);
    carSelectGUI.addControl(selectBtn);
    carSelectGUI.addControl(backBtn);

    return carSelectScene;
};