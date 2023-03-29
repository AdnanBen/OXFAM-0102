import { Trans } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "../styles/Chat.module.css";

const Chat = ({
  socket,
  chatWithUserId,
}: {
  socket: Socket;
  chatWithUserId: string | null;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState({ messages: [] });

  const sendNewMessage = (message: string) => {
    const payload = {
      message,
      timestamp: new Date().getTime(),
      chatWithUserId,
    };
    socket.emit("private message", payload);
    setMessages((old) => {
      return { messages: [...old.messages, payload] };
    });
    setInputValue("");
  };

  useEffect(() => {
    socket.on("private message", (payload) => {
      setMessages((old) => {
        payload.isUser = true;
        return { messages: [...old.messages, payload] };
      });
    });

    return () => socket.removeAllListeners();
  }, []);

  return (
    <>
      <div className={styles.chat_container}>
        <div className={styles.message_container}>
          {messages.messages.map((m) => (
            <div
              className={`${styles.message} ${
                m.isUser ? styles.them : styles.me
              }`}
            >
              {m.isUser ? (
                <div className={styles.sender}>
                  <Trans>Them</Trans>:
                </div>
              ) : (
                <div className={styles.sender}>
                  <Trans>You</Trans>:
                </div>
              )}
              {m.message} - {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          ))}
        </div>

        <div className={styles.input_container}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                sendNewMessage(inputValue);
              }
            }}
          />
          <button
            className={styles.send_button}
            onClick={() => sendNewMessage(inputValue)}
          >
            <Trans>Send message</Trans>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
