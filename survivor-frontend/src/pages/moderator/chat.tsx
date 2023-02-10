import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { Loader, Button } from "rsuite";
import io, { Socket } from "socket.io-client";
import Chat from "../../components/Chat";

// TODO: when auth is working, as soon as moderator logs in, they should be 'listening'
const ModeratorChat = ({ socket }: { socket: Socket }) => {
  const [chatRequests, setChatRequests] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [chattingWithUser, setChattingWithUser] = useState(null);

  const acceptChat = (userId) => {
    socket.emit("accept chat", { userId });
  };

  useEffect(() => {
    socket.on("session", (payload) => {
      socket.auth.sessionId = payload.sessionId;
      setIsListening(true);
    });

    socket.on("chat requests", (payload) => {
      setChatRequests(payload.chatRequests);
    });

    socket.on("chat started", (payload) => {
      setChattingWithUser(payload.userId);
    });

    socket.on("chat disconnected", () => {
      setChattingWithUser(null);
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
    });
  }, []);

  return (
    <div>
      <h2>Chat requests</h2>

      {isListening && <p>Listening to chat requests...</p>}

      {chattingWithUser && (
        <>
          <p>Chatting with user: {chattingWithUser}</p>
          <Chat socket={socket} chatWithUserId={chattingWithUser} />
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

const ModeratorDashboard: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const sessionId = window?.sessionStorage.getItem("sessionId");

    setSocket(
      io("/", {
        auth: { isAdmin: true, sessionId },
        path: "/api/chat",
      })
    );

    return () => {
      socket?.close();
    };
  }, []);

  return socket ? (
    <ModeratorChat socket={socket} />
  ) : (
    <Loader center backdrop />
  );
};

export default ModeratorDashboard;
