import { createServer } from "http";
import { Server, Socket } from "socket.io";
import io from "socket.io"

const server = io();

interface ChatRequest {
  from: string;
  message: string;
}


const socket = io('http://localhost:3000');   ''''''

server.on('connection', (socket) => {
  socket.on('startChat', (data: ChatRequest) => {
    console.log(`Chat request from ${data.from}: ${data.message}`);
    // accept chat request and continue the chat
    socket.emit('chatAccepted', { message: 'Chat accepted' });
  });
});
