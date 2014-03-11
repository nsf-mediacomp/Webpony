
/*** drawobject.js V1.0 ***/

var loadJsonUniqueUrlId = 0;

function loadJSON(uri_string, handler){
    var http_request = new XMLHttpRequest();
    
    http_request.onreadystatechange = function(){
        if(http_request.readyState == 4){
            if(http_request.status == 200){
                // decodeURI because it's stored on the server as the URI encode that we sent it
                document.getElementById("debug").innerHTML = http_request.responseText;
                var jsonObj = JSON.parse(decodeURI(http_request.responseText));
                //var jsonObj = http_request.responseText; //return plaintext for now (drawobject.js handles deserialize)
                handler(jsonObj);
            }else{
                document.getElementById("debug").innerHTML = "status: " + http_request.status + "#" + loadJsonUniqueUrlId;
            }
        }
    };
    loadJsonUniqueUrlId++;
    if(uri_string.indexOf("?") >= 0){
        uri_string = uri_string.replace(/\?/, "?" + loadJsonUniqueUrlId + "&");
    }else{
        uri_string += "?" + loadJsonUniqueUrlId;
    }
    http_request.open("GET", uri_string, true);
    http_request.send();
    
    /*loadJsonUniqueUrlId++;
    if(uri_string.indexOf("?") >= 0){
        uri_string = uri_string.replace(/\?/, "?" + loadJsonUniqueUrlId + "&");
    }else{
        uri_string += "?" + loadJsonUniqueUrlId;
    }
    
    setTimeout(function(){
        var response = Android.loadJSON(uri_string);
        try{
            var jsonObj = JSON.parse(decodeURI(response));
            handler(jsonObj);
        }catch(err){
            document.getElementById("debug").innerHTML = response + "#" + loadJsonUniqueUrlId;
        }
    }, 0);*/
}

function joinRoom(name){
    
}

function broadcastDrawrObject(drawrObject){
    var s = drawrObject.serialize();
}

function getDrawrObjects(){
    //var newDObject = deserialze(..); //how to make a static method -- GOOGLE THISD<<-----
}