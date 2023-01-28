import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.on('startChat', (data: ChatRequest) => {
        io.emit('startChat', data);
    });
    socket.on('chatAccepted', (data: { message: string }) => {
        socket.emit('chatAccepted', data);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
