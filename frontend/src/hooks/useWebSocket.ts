import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (receiverId: string) => {
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const userId: string = localStorage.getItem("id") || "";

    useEffect(() => {
        if (!receiverId) return; // Don't activate WebSocket connection if no receiverId

        const stompClient = new Client({
            webSocketFactory: () =>
                new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
            onConnect: () => {
                // Subscribe to user-specific topic when WebSocket connects
                stompClient.subscribe(
                    `/user/${userId}/${receiverId}/queue/messages`,
                    (message) => {
                        setMessages((prev) => [
                            ...prev,
                            JSON.parse(message.body),
                        ]);
                    }
                );
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
            },
            onStompError: (frame) => {
                console.error("STOMP Error", frame);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
            setMessages([]); // Clear messages when WebSocket disconnects so that duplicate messages don't appear
        };
    }, [userId, receiverId]); // Depend on both userId and receiverId to re-subscribe correctly

    // Send a message to the receiver
    const sendMessage = (receiverId: string, content: string) => {
        if (!client) return;
        client.publish({
            destination: "/app/chat",
            body: JSON.stringify({ senderId: userId, receiverId, content }),
        });
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return { messages, sendMessage, clearMessages };
};

export default useWebSocket;
