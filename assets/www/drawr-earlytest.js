// disable touchmove from trying to move the webpage, so that we can use it to draw
/*function preventBehavior(e) {
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);*/

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
window.addEventListener("keydown",keydownEvent,false);
var count = 0;
var gameloop = setInterval(update, FRAME_TIME);

var fps_counter = 0, fps = 0;
var fpsLastUpdate = now();

var updatelock = false;


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



function getMouseX(e){
    var touch = e.touches[0]; //array, for multi-touches
    return touch.pageX - stage.offsetLeft;
}
function getMouseY(e){
    var touch = e.touches[0]; //array, for multi-touches
    return touch.pageY - stage.offsetTop;
}


function mousemoveEvent(e){
    /*var rect = stage.getBoundingClientRect();
    mousex = event.clientX - rect.left;
    mousey = event.clientY - rect.top;*/
    mousex = getMouseX(e);
    mousey = getMouseY(e);
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}

function keydownEvent(e){
    // e.keyCode = 37:left, 38:up, 39:right, 40:down;
    if(String.fromCharCode(e.keyCode) == "A"){
        //blobs.empty();
    }else if(String.fromCharCode(e.keyCode) == "F"){
        //friction = !friction;
    }else if(String.fromCharCode(e.keyCode) == "G"){
        //gravity = !gravity;
    }else if(String.fromCharCode(e.keyCode) == " "){
        //run_physics = !run_physics;
    }
}
function mousedownEvent(e){
    mousedown = true;
    /*var rect = stage.getBoundingClientRect();
    mouselastx = event.clientX - rect.left;
    mouselasty = event.clientY - rect.top;*/
    mouselastx = getMouseX(e);
    mouselasty = getMouseY(e);
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}

function mouseupEvent(e){
    mousedown = false;
    /*var rect = stage.getBoundingClientRect();
    mousex = event.clientX - rect.left;
    mousey = event.clientY - rect.top;*/
    mousex = getMouseX(e);
    mousey = getMouseY(e);
    
    var mousedx = (mousex - mouselastx) / 4 / 3;
    var mousedy = (mousey - mouselasty) / 4 / 3;
    //blobs.add(mousex,mousey,-mousedx,-mousedy);
    
    e.preventDefault(); //prevent mouse drag from trying to drag webpage
}