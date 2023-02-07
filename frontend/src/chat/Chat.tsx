import React, { useEffect, useState } from "react";
import { Button, Input } from "rsuite";
import { Socket } from "socket.io-client";
import { Server } from "socket.io";

import styles from "./chat.module.css";



const Chat = ({
  socket,
  chatWithUserId,
}: {
  socket: Socket;
  chatWithUserId: string | null;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState({message : []});


  const sendNewMessage = (message: string) => {
    const payload = {
      message,
      timestamp: new Date().getTime(),
      chatWithUserId,
    };
    socket.emit("private message", payload);
    setMessages((old) => {
      old.message.push(payload);
      return { ...old };
    });
  };

  useEffect(() => {
    socket.on("private message", (payload) => {
      console.log("received message", payload);
      setMessages((old) => {
        old.message.push(payload);
        payload.isUser = true;
        return { ...old };
      });
    });
  }, []);


  return (

  <>    
    <div className={styles.chat_container}>
      <div className={styles.message_container}>
        {messages.message.map((m) => (
              <div className={`${styles.message} ${m.isUser ? styles.them : styles.me}`} >
                {m.isUser ? <div className={styles.sender}>Them:</div> : <div className={styles.sender}>You:</div>}
                {m.message} - {new Date(m.timestamp).toLocaleTimeString()}
              </div> 
          ))}
      </div>
      
      <div className={styles.input_container}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className={styles.send_button} onClick={() => sendNewMessage(inputValue)}>Send message</button>
      </div>
    </div>
  </>
    
  );
};

export default Chat;