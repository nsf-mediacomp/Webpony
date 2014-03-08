
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

var mousex = 0, mousey = 0;
var mouselastx = 0, mouselasty = 0;
var mousedown = false;
stage.addEventListener("mousemove",mousemoveEvent,false);
stage.addEventListener("touchmove",mousemoveEvent,false);
stage.addEventListener("mousedown",mousedownEvent,false);
stage.addEventListener("touchstart",mousedownEvent,false);
stage.addEventListener("mouseup",mouseupEvent,false);
stage.addEventListener("touchend",mouseupEvent,false);
var count = 0;
var gameloop = setInterval(update, FRAME_TIME);

var fps_counter = 0, fps = 0;
var fpsLastUpdate = now();

var updatelock = false;

// DRAWR CODE
var drawrObjects = [];
var tempDrawrObject = 0;


function update(){
    //only allow 1 instance of udpate to run at a time
    if(updatelock) return;
    updatelock = true;

    count++;
    fps_counter++;
    var nowTime = now();
    debug.innerHTML = fps.toFixed(1) + " fps | " + mousex + ", " + mousey;
    if(nowTime - fpsLastUpdate > 1000){
        fps = fps_counter;
        fpsLastUpdate = nowTime;
        fps_counter = 0;
    }
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,stage.width,stage.height);
    
    fillCircle(ctx, "blue", 100+50*Math.cos(count/180*Math.PI), 100+50*Math.sin(count/180*Math.PI), 30);
    
    // DRAWR CODE
    // OPTIMIZE THIS. have it draw to a bitmap, and then just print that, then update the bitmap on changes to drawrObjects
    for(var i=0; i<drawrObjects.length; ++i){
        drawrObjects[i].draw(ctx, stage.width, stage.height);
    }
    
    if(mousedown){
        fillCircle(ctx, "red", mousex, mousey, 25);
        var lx = mouselastx, ly = mouselasty;
        var dx = mousex - lx, dy = mousey - ly;
        var thickness = 7 * (1-hypot(dx,dy)/hypot(stage.width,stage.height));
        drawLine(ctx, "black", lx, ly, mousex, mousey, thickness);
        drawLine(ctx, "white", lx-10, ly-10, lx+10, ly+10, 5);
        drawLine(ctx, "white", lx-10, ly+10, lx+10, ly-10, 5);
        drawLine(ctx, "black", lx-10, ly-10, lx+10, ly+10, 3);
        drawLine(ctx, "black", lx-10, ly+10, lx+10, ly-10, 3);
    }

    updatelock = false; // let a new update() run
}


// DRAWR CODE
function clearScreen(){
    drawrObjects = [];
    tempDrawrObject = 0;
}


function getMouseX(e){
    if(!e.touches) return;
    var touch = e.touches[0]; //array, for multi-touches
    if(!touch) return;
    return touch.pageX - stage.offsetLeft;
}
function getMouseY(e){
    if(!e.touches) return;
    var touch = e.touches[0]; //array, for multi-touches
    if(!touch) return;
    return touch.pageY - stage.offsetTop;
}


function mousemoveEvent(e){
    mousex = getMouseX(e);
    mousey = getMouseY(e);
    
    // DRAWR CODE
    tempDrawrObject.addPoint(mousex,mousey,stage.width,stage.height);
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}

function mousedownEvent(e){
    mousedown = true;
    mouselastx = getMouseX(e);
    mouselasty = getMouseY(e);
    
    // DRAWR CODE
    tempDrawrObject = new DrawrPath([],[]);
    tempDrawrObject.addPoint(mouselastx,mouselasty,stage.width,stage.height);
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}

function mouseupEvent(e){
    mousedown = false;
    // getMouseX(e) may be undefined for a "touchend" event. if so, use previous value
    mousex = getMouseX(e) || mousex;
    mousey = getMouseY(e) || mousey;
    
    var mousedx = (mousex - mouselastx) / 4 / 3; // THIS DOES NOTHING RIGHT NOW
    var mousedy = (mousey - mouselasty) / 4 / 3;
    
    // DRAWR CODE
    tempDrawrObject.addPoint(mousex,mousey,stage.width,stage.height);
    drawrObjects.push(tempDrawrObject);
    tempDrawrObject = 0;
    
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}