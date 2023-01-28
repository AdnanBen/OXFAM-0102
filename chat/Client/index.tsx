import { createServer } from "http";
import { Server, Socket } from "socket.io";
import io from "socket.io-client"
import React from "react";




function startChat() {

  const socket = io('http://localhost:3000');

  socket.emit('startChat', { data: 'Chat request from client' });
}

const Chat = () => {
    return(
        <button onClick={startChat}>Start Chat</button>

    )
    };

export default Chat;