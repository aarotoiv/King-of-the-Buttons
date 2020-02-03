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
        


        io.on('connection', function(socket) {
            socket.on('join', function(data) {
                const color = {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                };
                self.newButton(Math.random() * 500 + 200);
                const points = 20;

                socket.emit('youJoined', {id: socket.id, existingPlayers: players, color, buttons: buttons.spawns, points});
                socket.broadcast.emit('playerJoined', {id: socket.id, x: data.x, color, points});

                self.newPlayer(socket.id, data.x, 0, color, points);
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
                const hitN = buttons.spawnPoints[data.id];
                let points = -1;
                if(hitN % 500 == 0) 
                    points += 250;
                else if(hitN % 100 == 0)       
                    points += 40;
                else if(hitN % 10 == 0) 
                    points += 5;
                socket.emit('youClicked', {points});
                socket.broadcast.emit('playerClicked', {socketId: socket.id, id: data.id, points});
                
                const button = self.newButton(Math.random() * 500 + 200);
                socket.emit('newButton', {button});
                socket.broadcast.emit('newButton', {button});
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
    newPlayer: function(socketId, x, y, color, points) {
        players[socketId] = {x, y, color, points};
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
        buttons.spawnPoints[id] = buttons.n;

        return buttons.spawns[id];
    }
};