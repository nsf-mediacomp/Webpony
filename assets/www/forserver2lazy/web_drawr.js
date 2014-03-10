
// todo: make this an object

var WIDTH = 300;
var HEIGHT = 400;
var FRAME_TIME = 33;

var debug = document.getElementById("debug");

var stage = document.getElementById("game");
stage.width = WIDTH;
stage.height = HEIGHT;
var ctx = stage.getContext("2d");
ctx.fillStyle = "black";

var count = 0;
var gameloop = setInterval(update, FRAME_TIME);

var fps_counter = 0, fps = 0;
var fpsLastUpdate = now();

var updatelock = false;

// DRAWR CODE
var drawrObjects = []; // disgusting global objects *vomits*


function update(){
    //only allow 1 instance of udpate to run at a time
    if(updatelock) return;
    updatelock = true;

    count++;
    fps_counter++;
    var nowTime = now();
    ////////////////////debug.innerHTML = fps.toFixed(1) + " fps | ";
    if(nowTime - fpsLastUpdate > 1000){
        fps = fps_counter;
        fpsLastUpdate = nowTime;
        fps_counter = 0;
    }
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,stage.width,stage.height);
    
    // DRAWR CODE
    // OPTIMIZE THIS. have it draw to a bitmap, and then just print that, then update the bitmap on changes to drawrObjects
    for(var i=0; i<drawrObjects.length; ++i){
        drawrObjects[i].draw(ctx, stage.width, stage.height);
    }

    updatelock = false; // let a new update() run
}


// DRAWR CODE
function clearScreen(){
    drawrObjects = [];
}