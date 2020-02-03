import io from 'socket.io-client';

export default {
    initialize() {
        const socket = io('http://localhost:5000');
        return socket;
    },
    listeners(socket, youJoined, playerJoined, playerLeft, playerPositionUpdate, playerVelocityUpdate, playerJumpUpdate, youClicked, playerClicked, newButton) {
        socket.on('youJoined', function(data) {
            youJoined(data.id, data.existingPlayers, data.color, data.buttons, data.points);
        });
        socket.on('playerJoined', function(data) {
            playerJoined(data.id, data.x, data.color, data.points);
        });
        socket.on('youLeft', function() {
            console.log("YOU HAVE LEFT");
        });
        socket.on('playerLeft', function(data) {
            playerLeft(data.id);
        });
        socket.on('playerPosition', function(data) {
            playerPositionUpdate(data.id, data.x, data.y);
        });
        socket.on('playerVelocity', function(data) {
            playerVelocityUpdate(data.id, data.right, data.left);
        });
        socket.on('playerJump', function(data) {
            playerJumpUpdate(data.id);
        });
        socket.on('youClicked', function(data) {
            youClicked(data.points);
        });
        socket.on('playerClicked', function(data) {
            playerClicked(data.socketId, data.id, data.points);
        });
        socket.on('newButton', function(data) {
            newButton(data.button);
        });
    },
    join(socket, spawnX) {
        socket.emit('join', {x: spawnX});
    },
    leave(socket) {
        socket.emit('leave', {});
    },
    posUpdate(socket, x, y) {
        socket.emit('positionUpdate', {x, y});
    },
    velUpdate(socket, right, left) {
        socket.emit('velocityUpdate', {right, left});
    },
    jumpUpdate(socket) {
        socket.emit('jumpUpdate', {});
    },
    buttonHit(socket, id) {
        socket.emit('buttonHit', {id});
    }
}