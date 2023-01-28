import http from "http";
import express from "express";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// TODO get rid of CORS config when deployed with reverse proxy on same URL
const io = new Server(server, { cors: { origin: "http://localhost:1234" } });

const MODERATOR_ROOM_NAME = "moderators";
const USER_ROOM_NAME = "users";

const MODERATOR_AVAILABILITY_EVENT = "moderator availability";
const USER_REQUEST_CHAT_EVENT = "request chat";
const NEW_SESSION_EVENT = "session";
const MODERATOR_ACCEPT_CHAT_EVENT = "accept chat";
const CHAT_MESSAGE_EVENT = "private message";

const sessions = {};
let numModeratorsConnected = 0;

io.use((socket, next) => {
  const jwt = socket.handshake.auth.jwt;
  // socket.request.
  // TODO remove isAdmin flag when JWT Auth is set up
  if (jwt || socket.handshake.auth.isAdmin) {
    // TODO: check if JWT is valid and for a moderator
    socket.isModerator = true;
  }

  console.log("client thinks its session ID is ", socket.handshake.auth);
  const sessionUserId = sessions[socket.handshake.auth.sessionId];
  if (sessionUserId) {
    socket.sessionId = socket.handshake.auth.sessionId;
    socket.userId = sessionUserId;
    return next();
  }

  const sessionId = randomUUID();
  const userId = randomUUID();
  sessions[sessionId] = userId;
  socket.sessionId = sessionId;
  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  console.log(
    `user connected (${socket.isModerator ? "moderator" : "not moderator"})`,
    socket.userId,
    socket.sessionId
  );

  // Tell the user what their Session ID is
  socket.emit(NEW_SESSION_EVENT, { sessionId: socket.sessionId });

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

  socket.on("disconnect", () => {
    console.log("disconnected  ", socket.userId);
  });

  if (socket.isModerator) {
    // A moderator has connected
    numModeratorsConnected++;

    // Update all users on moderator availability
    io.to(USER_ROOM_NAME).emit(MODERATOR_AVAILABILITY_EVENT, {
      areModeratorsAvailable: numModeratorsConnected > 0,
    });

    // Join moderators-only room to receive chat request events from users
    socket.join(MODERATOR_ROOM_NAME);

    // When a moderator accepts a chat request, join them to the user's room
    socket.on(MODERATOR_ACCEPT_CHAT_EVENT, (payload, callback) => {
      socket.join(`chat-${payload.userId}`);
    });

    socket.on("disconnect", () => {
      numModeratorsConnected--;

      // Update all users on moderator availability
      io.to(USER_ROOM_NAME).emit(MODERATOR_AVAILABILITY_EVENT, {
        areModeratorsAvailable: numModeratorsConnected > 0,
      });
    });
  } else {
    // A user has connected

    // Join users-only room to receive general information e.g., if moderators are available
    socket.join(USER_ROOM_NAME);

    // Join the user to their room on connection: they will receive any future chat messages here
    socket.join(`chat-${socket.userId}`);

    // Update this new user on current moderator availability
    socket.emit(MODERATOR_AVAILABILITY_EVENT, {
      areModeratorsAvailable: numModeratorsConnected > 0,
    });

    socket.on(USER_REQUEST_CHAT_EVENT, () => {
      console.log("Sending chat request event to moderator room");
      // Send a chat request to all moderators
      io.to(MODERATOR_ROOM_NAME).emit(USER_REQUEST_CHAT_EVENT, {
        userId: socket.userId,
      });
    });
  }
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`⚡️[chat]: Server is running at http://localhost:${port}`);
});
