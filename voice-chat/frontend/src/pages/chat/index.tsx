import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Loader } from "rsuite";
import io, { Socket } from "socket.io-client";
import { Peer } from "peerjs";
import Chat from "../../components/Chat";

//https://stackoverflow.com/questions/72238175/why-useeffect-running-twice-and-how-to-handle-it-well-in-react
const UserChat = ({
  socket,
  peerjsConn,
}: {
  socket: Socket;
  peerjsConn: any;
}) => {
  const [chatRequestSent, setChatRequestSent] = useState(false);
  const [callRequestSent, setCallRequestSent] = useState(false);

  const [activeCall, setActiveCall] = useState<any>(null);
  const [audioStream, setAudioStream] = useState<any>(null);

  const [chatRequestTimerId, setChatRequestTimerId] = useState<
    string | number | NodeJS.Timeout | undefined
  >(null);
  const [callRequestTimerId, setCallRequestTimerId] = useState<
    string | number | NodeJS.Timeout | undefined
  >(null);

  const [moderatorsAvailable, setModeratorsAvailable] = useState(false);
  const [chattingWithModerator, setChattingWithModerator] = useState(false);

  const InitialRequestChat = () => {
    console.log("requesting chat");
    socket.emit("request chat");

    const timerId = setTimeout(RepeatingRequestChat, 5000);
    setChatRequestTimerId(timerId);

    setChatRequestSent(true);
  };

  const RepeatingRequestChat = () => {
    socket.emit("request chat");
  };

  // Voice

  const InitialCallRequest = () => {
    console.log("requesting call");
    socket.emit("request call");

    const timerId = setTimeout(RepeatingRequestCall, 5000);
    setCallRequestTimerId(timerId);

    setCallRequestSent(true);
  };

  const EndCall = () => {
    activeCall.close();
    setActiveCall(null);
  };

  const RepeatingRequestCall = () => {
    socket.emit("request call");
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
      if (!payload.areModeratorsAvailable) {
        console.log("no mods anymore");
        clearTimeout(chatRequestTimerId);
        setChatRequestTimerId(undefined);

        clearTimeout(chatRequestTimerId);
        setChatRequestTimerId(undefined);
      }
      setModeratorsAvailable(payload.areModeratorsAvailable);
    });

    socket.on("chat started", (payload) => {
      clearTimeout(chatRequestTimerId);
      setChatRequestTimerId(undefined);
      setChattingWithModerator(true);
    });

    socket.on("chat disconnected", () => {
      setChatRequestSent(false);
      setChattingWithModerator(false);
    });

    socket.on("disconnect", () => {
      socket?.removeAllListeners();
    });

    // Voice specific

    peerjsConn.on("open", function (id) {
      console.log("My peer ID is: " + id);

      // answer incoming calls and create a media stream for the call
      peerjsConn.on("call", (call) => {
        console.log("received call");
        setActiveCall(call);
        setCallRequestSent(false);
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((mediaStream) => {
            call.answer(mediaStream);

            // handle the 'stream' event to receive the remote peer's media stream
            call.on("stream", (remoteStream) => {
              console.log("Received remote stream");
              // create a new <audio> element and attach the remote stream to it
              const audioElement = document.createElement("audio");
              setAudioStream(audioElement);
              audioElement.srcObject = remoteStream;
              audioElement.play();
              document.body.appendChild(audioElement);
            });

            // handle errors that can occur during the call
            call.on("close", () => {
              mediaStream.getTracks().forEach((track) => track.stop());
              audioStream.remove();
              setAudioStream(null);
            });

            // handle errors that can occur during the call
            call.on("error", (error) => {
              console.error("Call error:", error);
            });
          })
          .catch((error) => {
            console.error("Error getting user media:", error);
          });
      });
    });
  }, []);

  if (chattingWithModerator) {
    return <Chat socket={socket} />;
  }

  if (chatRequestSent) {
    return <div>Chat Request sent!</div>;
  }

  if (callRequestSent) {
    return <div>Call Request sent!</div>;
  }

  if (activeCall) {
    return (
      <div>
        <button onClick={EndCall}>End Call</button>
      </div>
    );
  }

  if (moderatorsAvailable) {
    return (
      <div>
        <button onClick={InitialRequestChat}>Request Chat</button>
        <button onClick={InitialCallRequest}>Request Call</button>
      </div>
    );
  }

  return <div>There are no moderators available to chat at the moment.</div>;
};

const ChatPage: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerjsConn, setPeerjsConn] = useState<any>(null);
  useEffect(() => {
    const sessionId = window?.sessionStorage.getItem("sessionId");
    setSocket(
      io("http://192.168.3.227:3001", {
        auth: { sessionId },
        path: "/api/chat",
      })
    );

    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      console.log(socket);
      import("peerjs").then(({ default: Peer }) => {
        // Do your stuff here
        const peer = new Peer(socket.id, {
          host: "192.168.3.227",
          port: 9000,
          path: "/api/voiceserver",
        });

        setPeerjsConn(peer);
      });
    }
    return () => {
      if (peerjsConn) {
        peerjsConn.destroy();
      }
    };
  }, [socket]);

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Forum</title>
      </Head>

      <main>
        <h2>Chat</h2>
        {socket && peerjsConn ? (
          <UserChat socket={socket} peerjsConn={peerjsConn} />
        ) : (
          <Loader center backdrop />
        )}
      </main>
    </>
  );
};

export default ChatPage;
