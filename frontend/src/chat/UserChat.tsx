import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Chat from "./Chat";
//https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react

const UserChat = ({ socket }: { socket: Socket }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [moderatorsAvailable, setModeratorsAvailable] = useState(false);
  const [chattingWithModerator, setChattingWithModerator] = useState(false);

  const requestChat = () => {
    socket.emit("request chat");
    setRequestSent(true);
  };

  useEffect(() => {
    socket.on("session", (payload) => {
      console.log("session event", payload);
      socket.auth = { sessionId: payload.sessionId };
    });

    socket.on("moderator availability", (payload) => {
      console.log("moderator availability event", payload);
      setModeratorsAvailable(payload.areModeratorsAvailable);
    });

    socket.on("chat started", (payload) => {
      setChattingWithModerator(true);
    });

    socket.on("chat disconnected", () => {
      setRequestSent(false);
      setChattingWithModerator(false);
    });

    socket.on("disconnect", () => {
      socket?.removeAllListeners();
    });

    return () => {
      console.log("disconnecting");

      socket?.disconnect();
    };
  }, []);

  if (chattingWithModerator) {
    return <Chat socket={socket} />;
  }

  if (requestSent) {
    return <div>Request sent!</div>;
  }

  if (moderatorsAvailable) {
    return <button onClick={requestChat}>Request Chat</button>;
  }

  return <div>There are no moderators available to chat at the moment.</div>;
};

const UserChatWrapper = () => {
  const s = io("http://localhost:8000");
  return <UserChat socket={s} />;
};

export default UserChatWrapper;
