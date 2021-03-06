'use strict';

function createViewModule() {
    
    var CanvasView = function () {
        this.w =0;
        this.h=0;
        this.canvas;
        this.ctx;
    };
    
    _.extend(CanvasView.prototype, {
        initCanvas: function(canvas, width, height) {
            this.w=width;
            this.h=height;
            this.canvas=canvas;
            this.placeCanvas();
        },
        
        placeCanvas: function(){
            var curCanvas = document.getElementById("mainCanvas");
            if(curCanvas != null) {
                curCanvas.parentNode.removeChild(curCanvas);
            }
            var newCanvas = document.createElement('canvas');
            newCanvas.id= "mainCanvas";
            newCanvas.width=this.w;
            newCanvas.height=this.h;
            this.canvas=newCanvas;
            canvasDiv.appendChild(newCanvas);//global div to hold canvas
            this.ctx=newCanvas.getContext('2d');
        },
    
        resizeCanvas: function(w, h) {
            //console.log("resizing");
            this.w=w;
            this.h=h;
            this.placeCanvas();
            supsModule.displaySups();
        },
        
        displaySup: function(givSup) {
            //generate the sup based on the uuid. That way it is unique but will be consistent
            if(givSup ==null) {
                this.ctx.clearRect(0,0,this.w, this.h);
            } else {
            var id = givSup.id;
            this.ctx.clearRect(0,0,this.w, this.h);
            this.ctx.save();
            //Translation
            var uXTrans = parseInt(id.substr(3,1));
            if(isNaN(uXTrans) || uXTrans==0|| uXTrans==1) {
                uXTrans=1.3;
            }
            var uYTrans = parseInt(id.substr(4,1));
            if(isNaN(uYTrans) || uYTrans==0|| uYTrans==1) {
                uYTrans=1.3;
            }
            this.ctx.translate(this.w/uXTrans,this.h/uYTrans);
            
            //sizing
            this.ctx.textAlign="center";
            var fontSize = parseInt(id.substr(5,1))
            if(isNaN(fontSize)||fontSize==0) {
                fontSize=3;
            }
            this.ctx.font=15+fontSize*5 + "px Arial";
            
            //rotation
            var uRotate = parseInt(id.substr(0,3));
            if(isNaN(uRotate)){
                uRotate=0;
            }
            this.ctx.rotate(Math.PI *uRotate/180, 0,0);
            
            //fillcolour
            var fillNum = parseInt(id.substr(6,1));
            if(isNaN(fillNum)){
                fillNum=0;
            }
            this.ctx.fillStyle = randColor(fillNum);
            this.ctx.fillText("Sup?", 0,0);
            //strokecolour
            var strokeNum = parseInt(id.substr(7,1));
            if(isNaN(strokeNum)){
                strokeNum=0;
            }
            this.ctx.strokeStyle = randColor(strokeNum);
            this.ctx.strokeText("Sup?", 0,0);
            this.ctx.restore();
            //console.log("rotate: "+uRotate+" xT: "+uXTrans+" yT: "+uYTrans+" xSpot "+this.w/uXTrans+" ySpot "+this.h/uYTrans);
            
            //other info
            this.ctx.save();
            this.ctx.textAlign="right";
            this.ctx.font="12px Arial";
            this.ctx.translate(this.w-2, this.h-5);
            var dateStr = givSup.date.replace("T", " ");
            dateStr = dateStr.replace("Z", "");
            dateStr = dateStr.substring(0, dateStr.length-4);
            this.ctx.fillText(dateStr,0,0);
            this.ctx.translate(0, -17);
            var userStr = "From "+givSup.senderid;
            this.ctx.fillText(userStr,0,0);
            this.ctx.restore();
            }
        }
    
    });
    
    return {
        CanvasView: CanvasView
    };
}

function randColor(num) {
    if(num==0) {
        return "black";
    }else if(num ==1) {
        return "blue";
    }else if(num ==2) {
        return "red";
    }else if(num ==3) {
        return "yellow";
    }else if(num ==4) {
        return "darkblue";
    }else if(num ==5) {
        return "pink";
    }else if(num ==6) {
        return "green";
    }else if(num ==7) {
        return "indigo";
    }else if(num ==8) {
        return "orange";
    }else if(num ==9) {
        return "brown";
    }
}


