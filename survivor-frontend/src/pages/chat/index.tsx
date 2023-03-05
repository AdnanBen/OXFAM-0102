import { Trans } from "@lingui/macro";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Loader } from "rsuite";
import io, { Socket } from "socket.io-client";
import Chat from "../../components/Chat";
import requireSSRTransition from "../../server/requireSSRTransition";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;
  return { props: {} };
};

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
    return (
      <div>
        <Trans>Request sent</Trans>
      </div>
    );
  }

  if (moderatorsAvailable) {
    return (
      <button onClick={requestChat}>
        <Trans>Request Chat</Trans>
      </button>
    );
  }

  return (
    <div>
      <Trans>There are no moderators available to chat at the moment.</Trans>
    </div>
  );
};

const ChatPage: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const sessionId = window?.sessionStorage.getItem("sessionId");
    setSocket(io("/", { auth: { sessionId }, path: "/api/chat" }));

    return () => {
      socket?.close();
    };
  }, []);

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Forum</title>
      </Head>

      <main>
        <h2>
          <Trans>Chat</Trans>
        </h2>
        {socket ? <UserChat socket={socket} /> : <Loader center backdrop />}
      </main>
    </>
  );
};

export default ChatPage;
