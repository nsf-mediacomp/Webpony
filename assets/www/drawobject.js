
/*** drawobject.js V1.01 ***/


function DrawrPath(xs,ys){
    this.xs = xs || [];
    this.ys = ys || [];
}

DrawrPath.fromJSON = function(json_obj){
    return new DrawrPath(json_obj.xs, json_obj.ys);
}

DrawrPath.prototype.addPoint = function(x,y,width,height){
    this.xs.push(1.0*x/width);
    this.ys.push(1.0*y/height);
}

DrawrPath.prototype.draw = function(ctx,width,height,color){
    color = color || "black";
    if(this.xs.length < 1) return;
    var lastx = this.xs[0]*width;
    var lasty = this.ys[0]*height;
    for(var i=1; i<this.xs.length; ++i){
        var x = this.xs[i]*width;
        var y = this.ys[i]*height;
        drawLine(ctx, color, lastx, lasty, x, y, 3);
        lastx = x;
        lasty = y;
    }
}

DrawrPath.prototype.serialize = function(){
    return JSON.stringify(this);
}

DrawrPath.deserialize = function(json_str){
    json_obj = JSON.parse(decodeURI(json_str));
    return new DrawrPath(json_obj.xs, json_obj.ys);
}