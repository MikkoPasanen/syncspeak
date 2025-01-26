import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (userId: string) => {
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe("/topic/messages", (message) => {
                    setMessages((prev) => [...prev, JSON.parse(message.body)]);
                });
            },
            onWebSocketClose: (event) => {
                console.log("WebSocket closed: ", event);
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
    };

    return { messages, sendMessage };
};

export default useWebSocket;
