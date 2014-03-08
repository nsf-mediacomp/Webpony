
/*** drawobject.js V1.0 ***/

var loadJsonUniqueUrlId = 0;

function loadJSON(uri_string, handler){
    var http_request = new XMLHttpRequest();
    
    http_request.onreadystatechange = function(){
        if(http_request.readyState == 4){
            // decodeURI because it's stored on the server as the URI encode that we sent it
            var jsonObj = JSON.parse(decodeURI(http_request.responseText));
            //var jsonObj = http_request.responseText; //return plaintext for now (drawobject.js handles deserialize)
            handler(jsonObj);
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
    
    /*'
    function(){
      if (http_request.readyState == 4  )
      {
        // Javascript function JSON.parse to parse JSON data
        var jsonObj = JSON.parse(http_request.responseText);

        // jsonObj variable now contains the data structure and can
        // be accessed as jsonObj.name and jsonObj.country.
        document.getElementById("Name").innerHTML =  jsonObj.name;
        document.getElementById("Country").innerHTML = jsonObj.country;
      }
    */
}

function joinRoom(name){
    
}

function broadcastDrawrObject(drawrObject){
    var s = drawrObject.serialize();
}

function getDrawrObjects(){
    //var newDObject = deserialze(..); //how to make a static method -- GOOGLE THISD<<-----
}