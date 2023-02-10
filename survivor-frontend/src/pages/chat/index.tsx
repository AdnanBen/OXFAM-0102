import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Loader } from "rsuite";
import io, { Socket } from "socket.io-client";
import Chat from "../../components/Chat";

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
    console.log("effect", socket);
    socket.on("session", (payload) => {
      console.log("session event", payload);
      window.sessionStorage.setItem("sessionId", payload.sessionId);
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

const ChatPage: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const sessionId = window?.sessionStorage.getItem("sessionId");
    setSocket(
      io("/", { auth: { sessionId }, path: "/api/chat" })
    );

    return () => {
      socket?.close();
    };
  }, []);

  return socket ? <UserChat socket={socket} /> : <Loader center backdrop />;
};

export default ChatPage;
