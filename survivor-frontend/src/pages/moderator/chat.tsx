import { NextPage } from "next";
import Peer, { MediaConnection } from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { Loader, Button } from "rsuite";
import io, { Socket } from "socket.io-client";
import Chat from "../../components/Chat";

// TODO: when auth is working, as soon as moderator logs in, they should be 'listening'
const ModeratorChat = ({
  socket,
  peerjsConn,
}: {
  socket: Socket;
  peerjsConn: any;
}) => {
  const [chatRequests, setChatRequests] = useState({});
  const [callRequests, setCallRequests] = useState({});

  const [activeCall, setActiveCall] = useState<any>(null);

  const [callEnded, setCallEnded] = useState<any>(false);

  const [isListening, setIsListening] = useState(false);
  const [chattingWithUser, setChattingWithUser] = useState(null);

  const acceptChat = (userId) => {
    socket.emit("accept chat", { userId });
  };

  const acceptCall = (userId) => {
    socket.emit("accept call", { userId });
  };

  const EndCall = () => {
    activeCall.close();
  };

  const CleanUpCall = () => {
    alert("call ended");
    window.location.reload();
  };

  // FIXME, this won't always run, race condition because of having to spawn peerjs
  useEffect(() => {
    setIsListening(true);
    console.log("here atleast");
    socket.on("session", (payload) => {
      console.log("inside session");
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

    // Voice specific

    socket.on("call requests", (payload) => {
      setCallRequests(payload.callRequests);
    });

    socket.on("call accepted", (payload) => {
      // setChattingWithUser(payload.userId);
      callPeer(payload.userId);
    });

    // wait for the 'open' event to be emitted, indicating that the connection is ready
    peerjsConn.on("open", (peerId) => {
      console.log(`Connected with ID ${peerId}`);
    });

    // get user media
    async function getUserMedia() {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    // initiate a call with a remote peer
    function callPeer(remotePeerId: string) {
      // get user media
      getUserMedia()
        .then((localStream: MediaStream) => {
          // call the remote peer
          const call = peerjsConn.call(remotePeerId, localStream);

          console.log("called " + remotePeerId);

          // handle the 'stream' event to receive the remote peer's media stream
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            setActiveCall(call);

            // create a new <audio> element and attach the remote stream to it
            const audioElement = document.createElement("audio");
            audioElement.srcObject = remoteStream;
            audioElement.play();
            document.body.appendChild(audioElement);

            socket.on("call ended", () => {
              setCallEnded(true);
            });

            // handle errors that can occur during the call
            call.on("close", () => {
              let peer_id = call.peer;
              socket.emit("call ended notification", { peer_id });
              CleanUpCall();
            });
          });

          // handle errors that can occur during the call
          call.on("error", (error) => {
            console.error("Call error:", error);
          });
        })
        .catch((error) => {
          console.error("Error getting user media:", error);
        });
    }
  }, []);

  if (callEnded) {
    return (
      <div>
        Call Ended
        <div>
          <button onClick={EndCall}>Press here to clean up</button>
        </div>
      </div>
    );
  }

  if (activeCall)
    return (
      <div>
        <button onClick={EndCall}>End Call</button>
      </div>
    );

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
      {isListening && (
        <ul>
          {Object.keys(callRequests).map((userId) => (
            <li key={`chat-request-${userId}`}>
              {userId}{" "}
              <Button
                size="xs"
                appearance="ghost"
                color="green"
                onClick={() => acceptCall(userId)}
              >
                Accept Call
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
  const [peerjsConn, setPeerjsConn] = useState<any>(null);

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

  useEffect(() => {
    if (socket?.connected) {
      console.log(socket);
      import("peerjs").then(({ default: Peer }) => {
        // Do your stuff here
        const peer = new Peer(socket.id, {
          host: window.location.host,
          port: 443,
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

  return socket?.connected && peerjsConn ? (
    <ModeratorChat socket={socket} peerjsConn={peerjsConn} />
  ) : (
    <Loader center backdrop />
  );
};

export default ModeratorDashboard;
