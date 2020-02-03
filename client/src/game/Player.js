export default {
    newPlayer(x, y, color) {
        return new this.Player(x, y, color);
    },  
    Player(x, y, color) {
        //some initializer values for the player
        this.x = x;
        this.y = y;
        this.prevX = 0;
        this.prevY = 0;
        this.scale = 70;
        this.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this.baseVel = 10;
        this.xVel = 0;
        this.yVel = 0;
        this.baseYAccel = 2;
        this.yVelCap = 16;
        this.touches = {
            bottom: false,
            right: false,
            top: false,
            left: false
        };
        //very simple drawing of a rectangle
        //x and y positions produce the center point, healthier for the brain this way(when doing calcs)
        this.draw = function(c) {
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
        };
        //checking collisions here. Only need to check bottom collision, because if the player falls down, theres nothing they can do anyway.
        //pretty much just checking if player is on top of the platform and its bottom part clips through the platform.
        //if the clip happens -> move the player back above the platform, set y-velocity to 0
        this.checkCollisions = function(platDims) {
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
                this.yVel = -30;
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
        };
    }
}