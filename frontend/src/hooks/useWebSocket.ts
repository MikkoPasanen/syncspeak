import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const userId: string = localStorage.getItem("id") || "";

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      onConnect: () => {
        stompClient.subscribe("/topic/messages", (message) => {
          setMessages((prev) => [...prev, JSON.parse(message.body)]);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    client?.publish({
      destination: "/app/chat",
      body: JSON.stringify({ senderId: userId, receiverId, content }),
    });
    console.log(JSON.stringify({ senderId: userId, receiverId, content }));
    console.log(messages);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, sendMessage, clearMessages };
};

export default useWebSocket;
