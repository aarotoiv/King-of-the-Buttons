const socket = require('socket.io');
const crypto = require('crypto');

let players = {};
let buttons = {
    n: 0,
    spawns: {},
    spawnPoints: {}
};

module.exports = {
    initSocket: function(server, session) {
        console.log("socket running");

        const io = socket(server);

        io.use(function(socket, next) {
            session(socket.request, {}, next);
        });
        
        const self = this;
        


        io.on('connection', function(socket) {
            if(!socket.request.session.color) {
                socket.request.session.color = {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                }
                socket.request.session.save();
            }
            if(!socket.request.session.points) {
                socket.request.session.points = 20;
                socket.request.session.save();
            }

            socket.on('join', function(data) {
                const color = socket.request.session.color;

                if(Object.keys(buttons.spawns).length == 0) 
                    self.newButton(Math.random() * 500 + 200);

                socket.emit('youJoined', {id: socket.id, existingPlayers: players, color, buttons: buttons.spawns, points: socket.request.session.points});
                socket.broadcast.emit('playerJoined', {id: socket.id, x: data.x, color, points: socket.request.session.points});

                self.newPlayer(socket.id, data.x, 0, color, socket.request.session.points);
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
                if(hitN) {
                    let points = -1;
                    if(hitN % 500 == 0) 
                        points += 250;
                    else if(hitN % 100 == 0)       
                        points += 40;
                    else if(hitN % 10 == 0) 
                        points += 5;
                    socket.emit('youClicked', {points});
                    socket.broadcast.emit('playerClicked', {socketId: socket.id, id: data.id, points});
                    
                    self.deleteButton(data.id);
                    self.playerPoints(socket.id, points);
    
                    const button = self.newButton(Math.random() * 500 + 200);
                    socket.emit('newButton', {button});
                    socket.broadcast.emit('newButton', {button});
                }
            });

            socket.on('leave', function(data) {
                socket.broadcast.emit('playerLeft', {id: socket.id});
                if(players[socket.id]) {
                    socket.request.session.points = players[socket.id].points;
                    socket.request.session.save();
                }
                self.removePlayer(socket.id);
            }); 

            socket.on('disconnect', function(data) {
                socket.broadcast.emit('playerLeft', {id: socket.id});
                if(players[socket.id]) {
                    socket.request.session.points = players[socket.id].points;
                    socket.request.session.save();
                }
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
    playerPoints: function(socketId, amount) {
        players[socketId].points += amount;
    },
    newButton: function(x) {
        const id = crypto.randomBytes(10).toString('hex');
        buttons.n++;
        buttons.spawns[id] = {x, id};
        buttons.spawnPoints[id] = buttons.n;

        return buttons.spawns[id];
    },
    deleteButton: function(id) {
        delete buttons.spawns[id];
        delete buttons.spawnPoints[id];
    }
};