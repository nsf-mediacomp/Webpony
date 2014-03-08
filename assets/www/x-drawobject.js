
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance

function DrawrPath(xs,ys){
    this.xs = xs || [];
    this.ys = ys || [];
}

DrawrPath.prototype.addPoint = function(x,y,width,height){
    this.xs.push(1.0*x/width);
    this.ys.push(1.0*y/height);
}

DrawrPath.prototype.draw = function(ctx,width,height){
    if(this.xs.length < 1) return;
    var lastx = this.xs[0]*width;
    var lasty = this.ys[0]*height;
    for(var i=1; i<this.xs.length; ++i){
        var x = this.xs[i]*width;
        var y = this.ys[i]*height;
        drawLine(ctx, "black", lastx, lasty, x, y, 3);
        lastx = x;
        lasty = y;
    }
}

DrawrPath.prototype.serialize = function(){
    // how to javascript object to JSON
}

DrawrPath.prototype.deserialize = function(str){

}