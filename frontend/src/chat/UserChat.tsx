import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [moderatorsAvailable, setModeratorsAvailable] = useState(false);

  const requestChat = () => {
    socket?.emit("request chat");
    setRequestSent(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on("session", (payload) => {
      console.log("session event", payload);
      socket.auth = { sessionId: payload.sessionId };
      // socket.connect();
    });

    socket.on("moderator availability", (payload) => {
      console.log("moderator availability event", payload);
      setModeratorsAvailable(payload.areModeratorsAvailable);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
      socket.removeAllListeners();
    });

    return () => socket.disconnect();
  }, []);

  if (requestSent) {
    return <div>Request sent!</div>;
  }

  if (moderatorsAvailable) {
    return <button onClick={requestChat}>Request Chat</button>;
  }

  return <div>There are no moderators available to chat at the moment.</div>;
};

export default Chat;
