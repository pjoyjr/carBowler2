//Physics
var forceVector = new BABYLON.Vector3(0, -60, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
const CAR_PHYSICS = { mass: 10, restitution: 0.0};


//Model Alphas
const LANE_MESH_ALPHA = 0;
const RANK_MESH_ALPHA = 0;
const ISLAND_MESH_ALPHA = 0;
const ISLAND_MAT_ALPHA = 1; //leave at 1
const CAR_IMPOSTER_ALPHA = 0;
const CAR_MESH_ALPHA = 1;

//Controller
var map = {};

//Car Driving
const ACCEL = .2;
const DECEL = -.35;
const MAXSPEED = 12;

//Models
//const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";
const CAR_MODEL_URL = "https://raw.githubusercontent.com/pjoyjr/carBowler2/main/obj/model3.babylon";


const Config = {
    physics: {
        gravity: new BABYLON.Vector3(0, -9.81, 0),
    },
    carSettings: {
        mass: 10,
        restitution: 0.0
    },
    // Other global settings...
};