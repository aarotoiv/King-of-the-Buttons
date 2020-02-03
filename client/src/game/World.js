export default {
    newWorld() {
        return new this.World();
    },  
    World() {
        this.platform = {
            x: 200,
            y: 800,
            w: 1800,
            h: 5 
        };
        this.button = {
            width: 80,
            height: 25,
            positions: []
        };

        this.draw = function(c) {
            c.beginPath();
            for(let i = 0; i<this.button.positions.length; i++) {
                if(!this.button.positions[i].inactive) {
                    c.beginPath();
                    c.fillStyle = "red";
                    c.rect(this.button.positions[i].x - this.button.width / 2, this.platform.y, this.button.width, -this.button.height);
                }
            }
            c.fill();
            c.beginPath();
            c.fillStyle = "#ccc";
            c.rect(this.platform.x, this.platform.y, this.platform.w, this.platform.h);
            c.fill();
        }

        this.newButton = function(button) {
            this.button.positions.push(button);
        }

        this.getPlatDims = function() {
            return this.platform;
        }

        this.getButtons = function() {
            return this.button;
        }
    }

}