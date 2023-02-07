import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "rsuite";
import io, { Socket } from "socket.io-client";
import Chat from "../../components/Chat";

// TODO: when auth is working, as soon as moderator logs in, they should be 'listening'
const ModeratorDashboard: NextPage = () => {
  const socket = useRef<Socket | null>(null);
  const [chatRequests, setChatRequests] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [chattingWithUser, setChattingWithUser] = useState(null);

  const acceptChat = (userId) => {
    socket.current?.emit("accept chat", { userId });
  };

  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      auth: { isAdmin: true },
    });

    socket.current.on("session", (payload) => {
      socket.current.auth.sessionId = payload.sessionId;
      setIsListening(true);
    });

    socket.current.on("chat requests", (payload) => {
      setChatRequests(payload.chatRequests);
    });

    socket.current.on("chat started", (payload) => {
      setChattingWithUser(payload.userId);
    });

    socket.current.on("chat disconnected", () => {
      setChattingWithUser(null);
    });

    socket.current.on("disconnect", () => {
      socket.current?.removeAllListeners();
    });

    return () => socket.current?.disconnect();
  }, []);

  return (
    <div>
      <h2>Chat requests</h2>

      {isListening && <p>Listening to chat requests...</p>}

      {chattingWithUser && (
        <>
          <p>Chatting with user: {chattingWithUser}</p>
          <Chat socket={socket.current} chatWithUserId={chattingWithUser} />
        </>
      )}

      {isListening && (
        <ul>
          {Object.keys(chatRequests).map((userId) => (
            <li key={`chat-request-${userId}`}>
              {userId}{" "}
              <Button
                size="xs"
                appearance="ghost"
                color="green"
                onClick={() => acceptChat(userId)}
              >
                Accept chat
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModeratorDashboard;
