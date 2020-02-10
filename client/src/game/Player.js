import {graphicMod as gM } from './util';

export default {
    newPlayer(x, y, color) {
        return new this.Player(x, y, color);
    },  
    Player(x, y, color) {
        //some initializer values for the player
        this.x = x * gM();
        this.y = y * gM();
        this.prevX = 0;
        this.prevY = 0;
        this.scale = 70 * gM();
        this.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this.baseVel = 10 * gM();
        this.xVel = 0;
        this.yVel = 0;
        this.baseYAccel = 2 * gM();
        this.yVelCap = 16 * gM();
        this.touches = {
            bottom: false,
            right: false,
            top: false,
            left: false
        };
        this.texts = [];
        //very simple drawing of a rectangle
        //x and y positions produce the center point, healthier for the brain this way(when doing calcs)
        this.draw = function(c) {
            c.globalAlpha = 1;
            c.beginPath();
            c.fillStyle = this.color;
            c.rect(this.x - this.scale / 2, this.y - this.scale / 2, this.scale, this.scale);
            c.fill();
            c.beginPath();
            c.fillStyle = "#fff";
            const eyeScale = 20 * this.scale / 150;
            c.rect(this.x - this.scale / 5 - eyeScale / 2, this.y - this.scale / 5 - eyeScale / 2, eyeScale, eyeScale);
            c.rect(this.x + this.scale / 5 - eyeScale / 2, this.y - this.scale / 5 - eyeScale / 2, eyeScale, eyeScale);
            c.fill();

            this.texts.forEach(function(text) {
                c.globalAlpha = 1 - text.timeActive / 1000;
                c.font = `${text.fontSize}px Arial`;
                c.fillText(text.text, text.x, text.y - text.timeActive / 20 * gM());
                if(text.subText) {
                    c.font = `${text.subText.fontSize}px Arial`;
                    c.fillText(text.subText.text, text.x - 40 * gM(), text.y + 20 * gM() - text.timeActive / 20 * gM());
                }
            });
            c.globalAlpha = 1;
        };
        //checking collisions here. Only need to check bottom collision, because if the player falls down, theres nothing they can do anyway.
        //pretty much just checking if player is on top of the platform and its bottom part clips through the platform.
        //if the clip happens -> move the player back above the platform, set y-velocity to 0
        this.checkCollisions = function(platDims, buttons) {
            if(this.y + this.scale / 2 >= platDims.y
            && this.x + this.scale / 2 >= platDims.x 
            && this.x - this.scale / 2 <= platDims.x + platDims.w
            && this.prevY + this.scale / 2 <= platDims.y) 
            {
                this.y -= (this.y + this.scale / 2) - platDims.y; 
                this.touches.bottom = true;
                if(this.yVel > 0)
                    this.yVel = 0;
            }
            else 
                this.touches.bottom = false;

            for(let i = 0; i<buttons.positions.length; i++) {
                if(!buttons.positions[i].inactive) {
                    if(this.x + this.scale / 2 >= buttons.positions[i].x - buttons.width / 2
                    && this.x - this.scale / 2 <= buttons.positions[i].x + buttons.width / 2
                    && this.y + this.scale / 2 >= platDims.y - buttons.height
                    && this.prevY + this.scale / 2 <= platDims.y - buttons.height) {
                        buttons.positions[i].inactive = true;
                        return buttons.positions[i].id;
                    }
                }
            }
            return false;
        }

        //using temp value here because we want the velocity to be exactly 50, -50 or 0
        //eg. if player pressed both a and d keys down, the velocity ends up at 0
        this.velocityUpdate = function(right, left) {   
            let xVel = 0;
            if(right)
                xVel += this.baseVel;
            if(left)
                xVel -= this.baseVel;
            this.xVel = xVel;
        }
        //ran when player hits spacebar
        this.jump = function() {
            if(this.touches.bottom)
                this.yVel = -30 * gM();
        }
        this.update = function() { 
            //update prevX and prevY
            //prevX is pretty much useless because we don't use it anywhere in this game
            //these are used to see if it's even possible for the collision to happen
            this.prevX = this.x;
            this.prevY = this.y;

            //if not touching the platform and y-velocity is below the allowed threshold -> we need to accelerate
            if(this.yVel < this.yVelCap && !this.touches.bottom)
                this.yVel += this.baseYAccel;

            //update positions by incrementing the velocities
            this.y += this.yVel;
            this.x += this.xVel;

            for(let i = 0; i<this.texts.length; i++) {
                this.texts[i].timeActive = Date.now() - this.texts[i].time;
                if(this.texts[i].timeActive > 1000) 
                    this.texts.splice(i, 1);
            }

        }
        this.gainedPoints = function(points, sub) {
            this.texts.push({
                text: points > 0 ? `+${points}` : points,
                fontSize: 40 * gM(),
                time: Date.now(),
                timeActive: 0.0,
                x:this.x,
                y: this.y,
                subText: sub ? {
                    text: `Prize in ${sub} hits.`,
                    fontSize: 20 * gM()
                } : null
            });
        }
        this.getX = function() {
            return this.x / gM();
        }
        this.getY = function() {
            return this.y / gM();
        }
        this.syncPos = function(x, y) {
            this.x = x * gM();
            this.y = y * gM();
        }
        this.onResize = function() {
            this.x = window.innerWidth / 2;
            this.y = 0;
            this.scale = 70 * gM();
            this.baseVel = 10 * gM();
            this.baseYAccel = 2 * gM();
            this.yVelCap = 16 * gM();
        }
    }
}