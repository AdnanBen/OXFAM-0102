import * as appInsights from "applicationinsights";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { PeerServer } from "peer";

dotenv.config();
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
.setAutoDependencyCorrelation(true)
.setAutoCollectRequests(true)
.setAutoCollectPerformance(true, true)
.setAutoCollectExceptions(true)
.setAutoCollectDependencies(true)
.setAutoCollectConsole(true, true)
.setUseDiskRetryCaching(true)
.setAutoCollectPreAggregatedMetrics(true)
.setSendLiveMetrics(false)
.setAutoCollectHeartbeat(false)
.setAutoCollectIncomingRequestAzureFunctions(true)
.setInternalLogging(true, true)
.setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
.enableWebInstrumentation(false)
.start();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: "/api/chat",
});

const peerServer = PeerServer({ port: 9000, path: "/api/voiceserver" });

const MODERATOR_ROOM_NAME = "moderators";
const USER_ROOM_NAME = "users";

const MODERATOR_AVAILABILITY_EVENT = "moderator availability";

const USER_CHAT_REQUESTS_EVENT = "chat requests";
const USER_CALL_REQUESTS_EVENT = "call requests";

const USER_REQUEST_CHAT_EVENT = "request chat";
const USER_REQUEST_CALL_EVENT = "request call";

const NEW_SESSION_EVENT = "session";
const MODERATOR_ACCEPT_CHAT_EVENT = "accept chat";
const MODERATOR_ACCEPT_CALL_EVENT = "accept call";
const CHAT_MESSAGE_EVENT = "private message";
const CHAT_DISCONNECT_EVENT = "chat disconnected";

const END_CALL_NOTIFICATION = "call ended notification";

const CHAT_STARTED_EVENT = "chat started";

const sessions = {}; // Session ID => User ID
const chatRequests = {}; // User ID => bool
const callRequests = {}; // Peerjs ID => bool

let numModeratorsConnected = 0;

io.use((socket, next) => {
  const jwt = socket.handshake.auth.jwt;
  // TODO remove isAdmin flag when JWT Auth is set up
  if (jwt || socket.handshake.auth.isAdmin) {
    // TODO: check if JWT is valid and for a moderator
    socket.isModerator = true;
  }

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

const sendLatestModeratorAvailability = () => {
  // Update all users on moderator availability
  console.log("Sending latest mod availability");
  io.to(USER_ROOM_NAME).emit(MODERATOR_AVAILABILITY_EVENT, {
    areModeratorsAvailable: numModeratorsConnected > 0,
  });
};

const sendLatestChatRequests = () => {
  // Send all moderators latest list of chat requests
  io.to(MODERATOR_ROOM_NAME).emit(USER_CHAT_REQUESTS_EVENT, {
    chatRequests,
  });
};

const sendLatestCallRequests = () => {
  // Send all moderators latest list of chat requests
  io.to(MODERATOR_ROOM_NAME).emit(USER_CALL_REQUESTS_EVENT, {
    callRequests,
  });
};

const addChatRequest = (userId) => {
  chatRequests[userId] = true;
  sendLatestChatRequests();
};

const addCallRequest = (userId) => {
  callRequests[userId] = true;
  sendLatestCallRequests();
};

const deleteChatRequestAndSendUpdate = (userId) => {
  delete chatRequests[userId];
  sendLatestChatRequests();
};

const deleteCallRequestAndSendUpdate = (userId) => {
  delete callRequests[userId];
  sendLatestChatRequests();
};

io.on("connection", (socket) => {
  console.log(
    `user connected (${socket.isModerator ? "moderator" : "not moderator"})`,
    socket.userId,
    socket.sessionId
  );

  // Tell the user what their Session ID is
  socket.emit(NEW_SESSION_EVENT, { sessionId: socket.sessionId });

  // When someone sends a chat message...
  socket.on(CHAT_MESSAGE_EVENT, (payload) => {
    const { message, timestamp } = payload;
    const chatWithUserId = socket.isModerator
      ? payload.chatWithUserId
      : socket.userId;

    // If user is not a moderator, they are only allowed to send messages to their own room
    if (!socket.isModerator && chatWithUserId !== socket.userId) {
      return;
    }

    // Forward message to the room for the end-user
    socket.to(`chat-${chatWithUserId}`).emit(CHAT_MESSAGE_EVENT, {
      message,
      timestamp,
    });
  });

  socket.on(END_CALL_NOTIFICATION, async (payload) => {
    console.log("Call ended, sending notification to peer");
    console.log("looking for " + payload.peer_id);

    // return all Socket instances of the main namespace
    const sockets = await io.fetchSockets();
    sockets.forEach((socket) => {
      console.log(socket);
      if (socket.peerjs_id == payload.peer_id) {
        console.log("found peer");
        socket.emit("call ended");
      }
    });

    // io.to(payload.peer_id).emit("call ended");
  });

  socket.on("peerjs-id", (payload) => {
    let peerjs_id = payload.id;
    socket.peerjs_id = peerjs_id;
    console.log("got peerjs id " + socket.peerjs_id);
  });

  if (socket.isModerator) {
    // A moderator has connected
    numModeratorsConnected++;
    sendLatestModeratorAvailability();

    // Join moderators-only room to receive chat request events from users
    socket.join(MODERATOR_ROOM_NAME);

    // When a moderator accepts a chat request, join them to the user's room
    socket.on(MODERATOR_ACCEPT_CHAT_EVENT, (payload) => {
      socket.join(`chat-${payload.userId}`);
      io.to(`chat-${payload.userId}`).emit(CHAT_STARTED_EVENT, {
        userId: payload.userId,
      });
      deleteChatRequestAndSendUpdate(payload.userId);
    });

    // When a moderator accepts a call request, initiate a call
    socket.on(MODERATOR_ACCEPT_CALL_EVENT, (payload) => {
      console.log("sending call accepted msg");
      socket.emit("call accepted", {
        peerjs_id: payload.peerjs_id,
      });

      console.log("should remove " + payload.peerjs_id);

      deleteCallRequestAndSendUpdate(payload.peerjs_id);
    });

    socket.on("disconnect", () => {
      numModeratorsConnected--;
      sendLatestModeratorAvailability();

      // Inform of disconnection to all chat rooms that this moderator was in
      const rooms = [...socket.rooms].filter((s) => s.startsWith("chat-"));
      io.to(rooms).emit(CHAT_DISCONNECT_EVENT);
    });
  } else {
    // A user has connected

    // Join users-only room to receive general information e.g., if moderators are available
    socket.join(USER_ROOM_NAME);

    // Join the user to their room on connection: they will receive any future chat messages here
    socket.join(`chat-${socket.userId}`);

    // Update this new user on current moderator availability
    // socket.emit(MODERATOR_AVAILABILITY_EVENT, {
    //   areModeratorsAvailable: numModeratorsConnected > 0,
    // });

    socket.on("moderator availability check", () => {
      socket.emit(MODERATOR_AVAILABILITY_EVENT, {
        areModeratorsAvailable: numModeratorsConnected > 0,
      });
    });

    socket.on(USER_REQUEST_CHAT_EVENT, () => {
      console.log("Sending chat request event to moderator room");
      addChatRequest(socket.userId);
    });

    socket.on(USER_REQUEST_CALL_EVENT, (payload) => {
      console.log("Sending call request event to moderator room");
      addCallRequest(socket.peerjs_id);
    });

    socket.on("disconnect", () => {
      deleteChatRequestAndSendUpdate(socket.userId);
      deleteCallRequestAndSendUpdate(socket.peerjs_id);

      // Inform of disconnection to all members (moderators) of this chat room
      io.to(`chat-${socket.userId}`).emit(CHAT_DISCONNECT_EVENT);
    });
  }
});

const port = process.env.PORT;
server.listen(port, "0.0.0.0", () => {
  console.log(`⚡️[chat]: Server is running at http://localhost:${port}`);
});
