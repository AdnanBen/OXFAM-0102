import React, { useEffect, useState } from "react";
import { Button, Input } from "rsuite";
import { Socket } from "socket.io-client";
import styles from "./chat.module.css";

const Chat = ({
  socket,
  chatWithUserId,
}: {
  socket: Socket;
  chatWithUserId: string | null;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState({ sender: [], recipient: [] });

  const sendNewMessage = (message: string) => {
    const payload = {
      message,
      timestamp: new Date().getTime(),
      chatWithUserId,
    };
    socket.emit("private message", payload);
    setMessages((old) => {
      old.sender.push(payload);
      return { ...old };
    });
  };

  useEffect(() => {
    socket.on("private message", (payload) => {
      console.log("received message", payload);
      setMessages((old) => {
        old.recipient.push(payload);
        return { ...old };
      });
    });
  }, []);

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.sender}>
        {messages.sender.map((m) => (
          <div>
            {m.message} - {new Date(m.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>

      <div className={styles.recipient}>
        {messages.recipient.map((m) => (
          <div>
            {m.message} - {new Date(m.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>

      <div>
        <Input value={inputValue} onChange={setInputValue} />
        <Button onClick={() => sendNewMessage(inputValue)} appearance="primary">
          Send message
        </Button>
      </div>
    </div>
  );
};

export default Chat;
