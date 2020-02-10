import {graphicMod as gM } from './util';

export default {
    newWorld() {
        return new this.World();
    },  
    World() {
        this.platform = {
            x: 200 * gM(),
            y: 800 * gM(),
            w: 2160 * gM(),
            h: 5 * gM() 
        };
        this.button = {
            width: 80 * gM(),
            height: 25 * gM(),
            positions: []
        };

        this.draw = function(c) { 
            for(let i = 0; i<this.button.positions.length; i++) {
                if(!this.button.positions[i].inactive) {
                    c.beginPath();
                    c.fillStyle = "red";
                    c.rect(this.button.positions[i].x - this.button.width / 2, this.platform.y, this.button.width, -this.button.height);
                    c.fill();
                }
            }
            c.beginPath();
            c.fillStyle = "#ccc";
            c.rect(this.platform.x, this.platform.y, this.platform.w, this.platform.h);
            c.fill();
        }

        this.newButton = function(button) {
            const newX = button.x * gM();
            this.button.positions.push({x: newX, id: button.id});
        }

        this.getPlatDims = function() {
            return this.platform;
        }

        this.getButtons = function() {
            return this.button;
        }
    }

}