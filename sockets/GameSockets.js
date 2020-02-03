const socket = require('socket.io');
const crypto = require('crypto');

let players = {};
let buttons = {
    n: 0,
    spawns: {},
    spawnPoints: {}
};

module.exports = {
    initSocket: function(server) {
        console.log("socket running");

        const io = socket(server);

        const self = this;
        
        this.newButton(Math.random() * 500 + 200);

        io.on('connection', function(socket) {
            socket.on('join', function(data) {
                const color = {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                };

                socket.emit('youJoined', {id: socket.id, existingPlayers: players, color, buttons: buttons.spawns});
                socket.broadcast.emit('playerJoined', {id: socket.id, x: data.x, color});

                self.newPlayer(socket.id, data.x, 0, color);
            });

            socket.on('positionUpdate', function(data) {
                self.updatePlayer(socket.id, data.x, data.y); 
                socket.broadcast.emit('playerPosition', {id: socket.id, x: data.x, y: data.y});
            });

            socket.on('velocityUpdate', function(data) {
                socket.broadcast.emit('playerVelocity', {id: socket.id, right: data.right, left: data.left});
            });

            socket.on('jumpUpdate', function(data) {
                socket.broadcast.emit('playerJump', {id: socket.id});
            });


            socket.on('buttonHit', function(data) {
                const hitPoints = self.buttons.spawnPoints[data.id];

                socket.broadcast.emit('buttonClicked', {id: data.id});
            });

            socket.on('leave', function(data) {
                socket.broadcast.emit('playerLeft', {id: socket.id});
                self.removePlayer(socket.id);
            }); 

            socket.on('disconnect', function(data) {
                socket.broadcast.emit('playerLeft', {id: socket.id});
                self.removePlayer(socket.id);
            });
        });

    },
    newPlayer: function(socketId, x, y, color) {
        players[socketId] = {x, y, color};
    },
    removePlayer: function(socketId) {
        delete players[socketId];
    },
    updatePlayer: function(socketId, x, y) {
        if(players[socketId]) {
            players[socketId].x = x;
            players[socketId].y = y;
        }
       
    },
    newButton: function(x) {
        const id = crypto.randomBytes(10).toString('hex');
        buttons.n++;
        buttons.spawns[id] = {x, id};
        buttons.spawnPoints[id] = n;
    }
};