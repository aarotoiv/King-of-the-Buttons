<template>
    <div class="room">
        <PlayerList :players=this.listData></PlayerList>
        <!--<h1>{{$route.params.roomId}}</h1>-->
        <canvas id="game-canvas"></canvas>
    </div>
</template>

<script>
import PlayerList from './PlayerList';
import SocketHandler from '../game/SocketHandler';
import Player from '../game/Player';
import World from '../game/World';

export default {
    components: {
        PlayerList
    },
    data() {
        return {
            you: {
                socketId: null,
                points: 0,
                spawnX: 0,
                spawnY: 0
            },
            roomId: this.$route.params.roomId,
            players: {},
            listData: {},
            world: null,
            keys: {
                left: false,
                right: false
            },
            socket: null
        }
    },
    created() {
        this.world = World.newWorld();
        this.you.spawnX = Math.random() * 500 + 200;

        let self = this;
        SocketHandler.initialize()
        .then(function(res) {
            self.socket = res;
            SocketHandler.listeners(
                self.socket,
                self.youJoined,
                self.playerJoined,
                self.playerLeft,
                self.playerPositionUpdate,
                self.playerVelocityUpdate,
                self.playerJumpUpdate,
                self.youClicked,
                self.playerClicked,
                self.newButton
            );
            SocketHandler.join(self.socket, self.you.spawnX);
        });

    },
    mounted() {
        let self = this;
        window.addEventListener('keydown', event => {
            if(event.keyCode === 68) 
                self.keys.right = true;
            else if(event.keyCode === 65) 
                self.keys.left = true; 
            
            if(self.you.socketId && self.players[self.you.socketId])
                self.players[self.you.socketId].velocityUpdate(self.keys.right, self.keys.left);
            SocketHandler.velUpdate(self.socket, self.keys.right, self.keys.left);
            
            if(event.keyCode === 32) {
                self.players[self.you.socketId].jump();
                SocketHandler.jumpUpdate(self.socket);
            }
        }); 
        window.addEventListener('keyup', event => {
            if(event.keyCode === 68)
                self.keys.right = false;
            else if(event.keyCode === 65)
                self.keys.left = false;
            if(self.you.socketId && self.players[self.you.socketId])
                self.players[self.you.socketId].velocityUpdate(self.keys.right, self.keys.left);
            SocketHandler.velUpdate(self.socket, self.keys.right, self.keys.left);
        });
        window.addEventListener('resize', () => {
            let canvas = document.getElementById("game-canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        let canvas = document.getElementById("game-canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.gameCanvas = canvas.getContext("2d");

        this.canvasLoop = setInterval(() => {
            self.updateFrame();
        }, 16.666);

        this.updateLoop = setInterval(() => {
            if(self.players[self.you.socketId]) 
                SocketHandler.posUpdate(self.socket, self.players[self.you.socketId].x, self.players[self.you.socketId].y);
        }, 1000); 
    },
    methods: {
        updateFrame() {
            this.gameCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const player_keys = Object.keys(this.players);
            const player_arr = Object.values(this.players);
            let self = this;
            player_arr.forEach(function(player, index) {
                const buttonHit = player.checkCollisions(self.world.getPlatDims(), self.world.getButtons());
                if(buttonHit && player_keys[index] === self.you.socketId) {
                    SocketHandler.buttonHit(self.socket, buttonHit);
                }
                player.update();
                player.draw(self.gameCanvas);
            });
            this.world.draw(this.gameCanvas);
        },
        youJoined(socketId, existingPlayers, color, buttons, points) {
            //create your player
            this.you.socketId = socketId;
            this.players[socketId] = Player.newPlayer(this.you.spawnX, this.you.spawnY, color);

            this.$set(this.you, 'points', points);
            this.$set(this.listData, socketId, {color, socketId, exists:true, points});

            const keys = Object.keys(existingPlayers);
            const values = Object.values(existingPlayers);
            for(let i = 0; i<keys.length; i++) {
                this.players[keys[i]] = Player.newPlayer(values[i].x, values[i].y, values[i].color);
                this.$set(this.listData, keys[i], {color: values[i].color, socketId: keys[i], exists: true, points: values[i].points});
            }
            let self = this;
            Object.values(buttons).forEach(function(button) {
                self.world.newButton(button);
            });
        },
        playerJoined(socketId, x, color, points) {
            this.players[socketId] = Player.newPlayer(x, 0, color);
            this.$set(this.listData, socketId, {color, socketId, exists: true, points});
        },
        playerLeft(socketId) {
            delete this.players[socketId];
            this.$set(this.listData[socketId], 'exists', false);
            let self = this;
            setTimeout(function() {
                self.$delete(self.listData, socketId);
            }, 500);
        },
        playerPositionUpdate(socketId, x, y) {
            if(this.players[socketId]) {
                this.players[socketId].x = x;
                this.players[socketId].y = y;
            }
        },
        playerVelocityUpdate(socketId, right, left) {
            if(this.players[socketId])
                this.players[socketId].velocityUpdate(right, left);
        },
        playerJumpUpdate(socketId) {
            if(this.players[socketId]) {
                this.players[socketId].jump();
            }
        },
        youClicked(points) {
            this.players[this.you.socketId].gainedPoints(points, true);
            this.$set(this.you, 'points', this.you.points + points);
            this.$set(this.listData[this.you.socketId], 'points', this.listData[this.you.socketId].points + points);
            console.log(this.you.points);
        },
        playerClicked(socketId, buttonId, points) {
            this.players[socketId].gainedPoints(points, false);
            this.$set(this.listData[socketId], 'points', this.listData[socketId].points + points);
        },
        newButton(button) {
            this.world.newButton(button);
        }
    },
    beforeDestroy() {
        clearInterval(this.canvasLoop);
        clearInterval(this.updateLoop);
        window.removeEventListener('keydown');
        window.removeEventListener('keyup');
        window.removeEventListener('resize');

        SocketHandler.leave(this.socket);
    }
    
}
</script>
<style scoped>
    h1 {
        margin: 0;
        position:absolute;
        left:0;
        top:0;
        color: #fff;
        z-index: 9999;
    }
    #game-canvas {
        position:absolute;
        background: #000;
        left: 0;
        top: 0;
    }
</style>

