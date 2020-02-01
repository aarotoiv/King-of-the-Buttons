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

        this.draw = function(c) {
            c.beginPath();
            c.fillStyle = "#ccc";
            c.rect(this.platform.x, this.platform.y, this.platform.w, this.platform.h);
            c.fill();
        }
        this.update = function() {

        }

        this.getPlatDims = function() {
            return this.platform;
        }
    }

}