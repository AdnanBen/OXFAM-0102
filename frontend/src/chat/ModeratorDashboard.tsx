import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// TODO: when auth is working, as soon as moderator logs in, they should be 'listening'
const ModeratorDashboard = () => {
  const [socket, setSocket] = useState(null);
  const [chatRequests, setChatRequests] = useState({});
  const [isListening, setIsListening] = useState(false);

  const listenToRequests = () => {
    socket?.connect();
    setIsListening(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:8000", {
      autoConnect: false,
      auth: { isAdmin: true },
    });
    setSocket(socket);

    socket.on("session", (payload) => {
      socket.auth.sessionId = payload.sessionId;
      // socket.connect();
    });

    socket.on("request chat", (payload) => {
      setChatRequests((old) => ({ ...old, [payload.userId]: true }));
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
      socket.removeAllListeners();
    });

    return () => socket.disconnect();
  }, []);

  console.log("pending chat requests", Object.keys(chatRequests));

  return (
    <div>
      <h2>Chat requests</h2>

      {isListening ? (
        <p>Listening to chat messages...</p>
      ) : (
        <button onClick={() => listenToRequests()}>
          Listen to chat requests
        </button>
      )}

      <ul>
        {Object.keys(chatRequests).map((userId) => (
          <li key={`chat-request-${userId}`}>{userId}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModeratorDashboard;
