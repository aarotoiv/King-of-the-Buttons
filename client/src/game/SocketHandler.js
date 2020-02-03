import io from 'socket.io-client';

export default {
    initialize() {
        const socket = io('http://localhost:5000');
        return socket;
    },
    listeners(socket, youJoined, playerJoined, playerLeft, playerPositionUpdate, playerVelocityUpdate, playerJumpUpdate) {
        socket.on('youJoined', function(data) {
            youJoined(data.id, data.existingPlayers, data.color, data.buttons);
        });
        socket.on('playerJoined', function(data) {
            playerJoined(data.id, data.x, data.color);
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
    }
}