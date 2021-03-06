'use strict';

function createUsersModule() {

    var Friends = function() {
        this.friendList = [];
    };
    
    _.extend(Friends.prototype, {
        updateFriendsView: function() {
            var list = document.getElementById("select");
            list.options.length=0;
            for(var i=0; i<this.friendList.length; i++) {
                var opt = document.createElement("option");
                opt.value = this.friendList[i];
                opt.innerHTML = this.friendList[i];
                //console.log("adding " +this.friendList[i]);
                list.appendChild(opt);
            }
        },
    
        addFriend: function(friend) {
            var ind = this.friendList.indexOf(friend);
            if(ind != -1) {
                var err = document.getElementById("messages");
                err.innerHTML ="You have already added that friend".fontcolor('red');
            } else {
                this.friendList.push(friend);
                this.updateFriendsView();
            }
        },
        
        removeFriend: function(friend) {
            var ind = this.friendList.indexOf(friend);
            if(ind !=-1) {
                this.friendList.splice(ind,1);
                this.updateFriendsView();
            }
        },
        
        initialize: function(friends) {
            for(var i=0; i<friends.length; i++) {
                this.friendList.push(friends[i].user_id);
            }
            this.updateFriendsView();
        }
        
        
    
    });
    
    var Sups = function() {
        this.supsList = [];
        this.displayedSup = -1;
    };
    
    _.extend(Sups.prototype, {
        updateSups: function(sups) {
            var l = sups.length;
            var mes = document.getElementById("messages");
            mes.innerHTML ="You currently have "+l+" sups";
            if(l == this.supsList.length) {
            
            } else {
            this.supsList = []; //clear the array
            for (var i=0; i<l; i++) {
                var curSup = {senderid: sups[i].sender_id, sendername: sups[i].sender_full_name, id: sups[i].sup_id, date: sups[i].date};
                this.supsList.push(curSup);
            }
            this.displayedSup=l-1;
            this.displaySups();
            }
        },
        
        removeSup: function(id) {
            for(var i=0; i<this.supsList.length; i++) {
                if(this.supsList[i].id==id) {
                    //found it
                    console.log("found it");
                    this.supsList.splice(i,1);
                    if(this.displayedSup > i) {
                        console.log("subtracting");
                        this.displayedSup--;
                    } else if(this.displayedSup == this.supsList.length) {
                        console.log("subtracting2");
                        this.displayedSup--;
                    }
                    this.displaySups();
                }
            }
        },
        
        displaySups: function() {
            var l = this.supsList.length;
            var mes = document.getElementById("messages");
            mes.innerHTML ="You currently have "+l+" sups";
            canvasModule.displaySup(this.supsList[this.displayedSup]);
            if(this.displayedSup <=0){
                var backBut = document.getElementById('back');
                backBut.style.opacity = 0.5;
            } else {
                var backBut = document.getElementById('back');
                backBut.style.opacity = 1;
            }
            
            if(this.displayedSup ==this.supsList.length-1){
                var nextBut = document.getElementById('forward');
                nextBut.style.opacity = 0.5;
            } else {
                var nextBut = document.getElementById('forward');
                nextBut.style.opacity = 1;
            }
            
            if(this.displayedSup <0){
                var deleteBut = document.getElementById('delete');
                deleteBut.style.opacity=0.5;
            } else {
                var deleteBut = document.getElementById('delete');
                deleteBut.style.opacity=1;
            }
            
        },
        
        backSup: function() {
            if(this.displayedSup >0){
                this.displayedSup--;
                this.displaySups();
            }
        },
        
        nextSup: function() {
            if(this.displayedSup < this.supsList.length-1){
                this.displayedSup++;
                this.displaySups();
            }
        },
        
        curSupID: function() {
            if(this.displayedSup ==-1) {
                return null;
            }
            var id = this.supsList[this.displayedSup].id;
            return id;
        }
    
    });

    return {
        Friends: Friends,
        Sups: Sups
    };
}
