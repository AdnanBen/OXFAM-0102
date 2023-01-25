import http from "http";
import express from "express";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MODERATOR_ROOM_NAME = "moderators";
const USER_REQUEST_CHAT_EVENT = "request chat";
const NEW_SESSION_EVENT = "session";
const MODERATOR_ACCEPT_CHAT_EVENT = "accept chat";
const CHAT_MESSAGE_EVENT = "private message";

io.use((socket, next) => {
  const jwt = socket.handshake.auth.jwt;
  if (jwt) {
    // TODO: check if JWT is valid and for a moderator
    socket.isModerator = true;
  }
  socket.sessionId = randomUUID();
  socket.userId = randomUUID();
  next();
});

io.on("connection", (socket) => {
  console.log("user connected", socket.isModerator);

  // Tell the user what their (temporary) ID is
  socket.emit(NEW_SESSION_EVENT, { userId: socket.userId });

  // When someone sends a chat message...
  socket.on(CHAT_MESSAGE_EVENT, (payload, callback) => {
    const { message, chatWithUserId } = payload;

    // If user is not a moderator, they are only allowed to send messages to their own room
    if (!socket.isModerator && chatWithUserId !== socket.userId) {
      return;
    }

    // Forward message to the room for the end-user
    socket.to(`chat-${chatWithUserId}`).emit(CHAT_MESSAGE_EVENT, {
      message,
      from: socket.userId,
    });
  });

  if (socket.isModerator) {
    // A moderator has connected

    // Join moderators-only room to receive chat request events from users
    socket.join(MODERATOR_ROOM_NAME);

    // When a moderator accepts a chat request, join them to the user's room
    socket.on(MODERATOR_ACCEPT_CHAT_EVENT, (payload, callback) => {
      socket.join(`chat-${payload.userId}`);
    });
  } else {
    // A user has connected

    // Join the user to their room on connection: they will receive any future messages here
    socket.join(`chat-${payload.userId}`);

    // Send a chat request to all moderators
    io.to(MODERATOR_ROOM_NAME).emit(USER_REQUEST_CHAT_EVENT, {
      userId: socket.userId,
    });
  }
});
