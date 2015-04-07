'use strict';


var canvasModule;
var canvasDiv;
var curUser;
var curFullName;
var waiting;
var userExists;
var loadCount;
var loadVar;
var loadSups;
var friendsModule;
var supsModule;
var uid;
var pubPriv; //0 for private, 1 for public
window.addEventListener('load', function() {

    getUser();
    console.log(curUser);
    uid=5;
    var viewModule = createViewModule();
    var usersModule = createUsersModule();
    friendsModule = new usersModule.Friends();
    supsModule = new usersModule.Sups();
    
    var messagesDiv = document.getElementById("messages");
    var useraddDiv = document.getElementById("useradd");
    var usersendDiv = document.getElementById("usersend");
    canvasDiv = document.getElementById("canvas");
    var canvas = document.createElement('canvas');
    canvas.id = "mainCanvas";
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvasModule = new viewModule.CanvasView();
    h=h*0.5;
    w=w*0.75;
    canvasModule.initCanvas(canvas, w, h);
    var addBut = document.getElementById('addBut');
    var addText = document.getElementById('addText');
    var removeBut = document.getElementById('removeBut');
    var sendBut = document.getElementById('sendBut');
    var sendSelect = document.getElementById('select');
    var backBut = document.getElementById('back');
    var nextBut = document.getElementById('forward');
    var deleteBut = document.getElementById('delete');
    
    var private1 = document.getElementById('private1');
    var private2 = document.getElementById('private2');
    var public1 = document.getElementById('public1');
    var public2 = document.getElementById('public2');
    if(pubPriv==0) {
        private1.className="active";
        private2.className="active";
    } else if(pubPriv==1) {
        public1.className="active";
        public2.className="active";
    }
    
    //-------initialize with server and grab data ---------//
    //make sure user exists, if not add them to server
    userExists=false;
    loadCount=0;
    loadVar = setInterval(loading,1000,"Checking Account");
    var jsonString = {protocol_version: 1.2, message_id: 0, command:"user_exists",user_id:curUser, command_data:{user_id:curUser}};
    handleAjaxRequest(jsonString, userExistsCall, null);
    
    addBut.addEventListener('click', function() {
        var addName = addText.value;
        var jsonString = {protocol_version: 1.2, message_id: uid, command:"add_friend",user_id:curUser, command_data:{user_id:addName}};
        uid++;
        handleAjaxRequest(jsonString, addNewFriend, addName);
        addText.value= "";
    });
    
    removeBut.addEventListener('click', function() {
        var ind = sendSelect.selectedIndex;
        var curOpt = sendSelect[ind].value;
        var jsonString ={protocol_version: 1.2, message_id: uid, command:"remove_friend",user_id:curUser, command_data:{user_id:curOpt}};
        uid++;
        console.log(curOpt);
        handleAjaxRequest(jsonString, removeFriend, curOpt);
    });
    
    sendBut.addEventListener('click', function() {
        var ind = sendSelect.selectedIndex;
        var curOpt = sendSelect[ind].value;
        var uuid = generateUUID();
        var date = new Date();
        var jsonString ={protocol_version: 1.2, message_id: uid, command:"send_sup",user_id:curUser, command_data:{user_id:curOpt, sup_id: uuid, date: date}};
        handleAjaxRequest(jsonString, sendSup, uuid);
    });
    
    backBut.addEventListener('click', function() {
        supsModule.backSup();
    });
    
    nextBut.addEventListener('click', function() {
        supsModule.nextSup();
    });
    
    deleteBut.addEventListener('click', function() {
        var id =supsModule.curSupID();
        if(id!=null){
        var jsonString ={protocol_version: 1.2, message_id: uid, command:"remove_sup",user_id:curUser, command_data:{sup_id: id}}
        uid++;
        handleAjaxRequest(jsonString, deleteSup, id);
        }
    });
    
    private1.addEventListener('click', function() {
        privateJump();
    });
    
    private2.addEventListener('click', function() {
        privateJump();
    });
    
    public1.addEventListener('click', function() {
        publicJump();
    });
    
    public2.addEventListener('click', function() {
        publicJump();
    });
    
});

// Example derived from: https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
function handleAjaxRequest(jsonText, callback, options) {

    // Create the request object
    var httpRequest = new XMLHttpRequest();

    // Set the function to call when the state changes
    httpRequest.addEventListener('readystatechange', function() {

        // These readyState 4 means the call is complete, and status
        // 200 means we got an OK response from the server
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            // Parse the response text as a JSON object
            var responseObj = JSON.parse(httpRequest.responseText);

            // TODO: Actually do something with the data returned
            console.log(responseObj);
            callback(responseObj, options);
        }
    });

    // This opens a POST connection with the server at the given URL
    if(pubPriv==0) {
        httpRequest.open('POST', 'http://localhost:8080/post');
    } else if( pubPriv==1) {
        httpRequest.open('POST', 'http://104.197.3.113/post');
    }

    // Set the data type being sent as JSON
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    // Send the JSON object, serialized as a string
    var objectToSend = jsonText;
    httpRequest.send(JSON.stringify(objectToSend));
}

window.addEventListener('resize', function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    h=h*0.5;
    w=w*0.75;
    canvasModule.resizeCanvas(w,h);
});

//grabs the stored user from cookies
function getUser() {
    var cookie = document.cookie.split(';');
    
    for(var i=0; i< cookie.length; i++) {
        var splitEq = cookie[i].split("=");
        if(splitEq[0]=="username") {
            curUser =splitEq[1];
        } else if(splitEq[0]==" fullname") { //space needed because of how its split
            curFullName = splitEq[1];
        } else if(splitEq[0]==" server") {
            if(splitEq[1]=="public") {
                console.log("starting public");
                pubPriv=1;
            } else if(splitEq[1]=="private") {
                console.log("starting private");
                pubPriv=0;
            }
        }
    }
}

function loading(message) {
    loadCount++;
    if(loadCount>5) {
        loadCount=1;
    }
    var loadMes = document.getElementById("messages");
    var dots = "";
    for(var i=0; i<loadCount; i++) {
        dots =dots+".";
    }
    loadMes.innerHTML = (message +dots).fontcolor('blue');
    console.log("loading");
}

/*=============================All the callback functions! ====================================== */
function userExistsCall(json, opt) {
    //decipher the return string and determine if user exists
    if(json.reply_data.exists == true) {
        userExists=true;
        //can begin grabbing initial data points
        clearInterval(loadVar);
        //get friends
        loadVar = setInterval(loading,1000,"Retrieving Friends");
        var jsonString = {protocol_version: 1.2, message_id: 2, command:"get_friends",user_id:curUser, command_data:{user_id:curUser}};
        handleAjaxRequest(jsonString, initFriends, null);
    } else {
        userExists=false;
        //create the user
        var jsonString = {protocol_version: 1.2, message_id: 1, command:"create_user",user_id:curUser, command_data:{user_id:curUser, full_name:curFullName}};
        handleAjaxRequest(jsonString, createUserCall, null);//send the request to actually create the user
    }
    
    
}

function createUserCall(json, opt) {
    //user created
    clearInterval(loadVar);
        loadVar = setInterval(loading,1000,"Retrieving Friends");
        var jsonString = {protocol_version: 1.2, message_id: 2, command:"get_friends",user_id:curUser, command_data:{user_id:curUser}};
        handleAjaxRequest(jsonString, initFriends, null);
}

function initFriends(json, opt) {
    var friendArray = json.reply_data;
    friendsModule.initialize(friendArray);
    clearInterval(loadVar);
    loadVar = setInterval(loading,1000,"Retrieving Sups");
    var jsonString = {protocol_version: 1.2, message_id: 4, command:"get_sups",user_id:curUser, command_data:{user_id:curUser}};
    //uid++;
    handleAjaxRequest(jsonString, getSups, null);
}

function getSups(json, opt) {
    //getting sups
    clearInterval(loadVar);
    if(json.error == "") {
        var supsArray = json.reply_data;
        supsModule.updateSups(supsArray);
    }
    clearInterval(loadSups);
    loadSups = setInterval(pollSups, 30000);
}

function addNewFriend(json, opt) {
    //this will be called asynchronously several times at once potentially
    if(json.reply_data == "Added friend") {
        //now update our data on this end
        friendsModule.addFriend(opt);
    } else {
        var errMes = document.getElementById("messages");
        errMes.innerHTML ="Could not add friend".fontcolor('red')
    }
}

function removeFriend(json, opt) {
    if(json.reply_data == "Removed friend") {
        friendsModule.removeFriend(opt);
    } else {
        var errMes = document.getElementById("messages");
        errMes.innerHTML ="Could not remove friend".fontcolor('red')
    }
}

function sendSup(json, opt) {
    if(json.reply_data == "Sent sup") {
    
    } else {
        var errMes = document.getElementById("messages");
        errMes.innerHTML ="Could not send sup".fontcolor('red')
        console.log(json.error);
    }
}

function deleteSup(json, opt) {
    if(json.reply_data =="Removed sup") {
        //now remove it from our view
        supsModule.removeSup(opt);
    } else{
        var errMes = document.getElementById("messages");
        errMes.innerHTML ="Could not remove sup".fontcolor('red')
        console.log(json.error);
    }
}

function pollSups() {
    loadVar = setInterval(loading,1000,"Checking For Sups");
    var jsonString = {protocol_version: 1.2, message_id: uid, command:"get_sups",user_id:curUser, command_data:{user_id:curUser}};
    uid++;
    handleAjaxRequest(jsonString, getSups, null);
}

function publicJump() {
    if(pubPriv==0 || pubPriv==null){
        document.cookie="server=public";
        window.location.reload();
    }//else already public
}

function privateJump() {
    if(pubPriv==1 || pubPriv==null){
        document.cookie="server=private";
        window.location.reload();
    }//else already private
}

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


