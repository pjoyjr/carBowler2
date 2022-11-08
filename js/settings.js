//Physics settings
var forceVector = new BABYLON.Vector3(0, -60, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();

const PLANKS_TEXTURE_URL = "texture/planks.jpg" 
//const PLANKS_TEXTURE_URL = new BABYLON.Texture("https://raw.githubusercontent.com/pjoyjr/carBowler2/main/texture/planks.jpg", gameScene);

//alphas for testing
var LANE_MESH_ALPHA = 0;
var RANK_MESH_ALPHA = 0;
var ISLAND_MESH_ALPHA = 0;
var ISLAND_MAT_ALPHA = 1; //leave at 1
