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
                // Subscribe to the receiver's queue to see their messages in real-time
                stompClient.subscribe(
                    `/user/${userId}/${receiverId}/queue/messages`,
                    (message) => {
                        let receivedMessage = JSON.parse(message.body);

                        if (
                            receivedMessage.senderId !== userId &&
                            !receivedMessage.hasBeenRead
                        ) {
                            stompClient.publish({
                                destination: "/app/mark-read",
                                body: JSON.stringify(receivedMessage.id),
                            });

                            receivedMessage.hasBeenRead = true;

                            setMessages((prev) => [...prev, receivedMessage]);
                        }
                    }
                );

                // Subscribe to our own queue to see our own messages in real-time
                stompClient.subscribe(
                    `/user/${receiverId}/${userId}/queue/messages`,
                    (message) => {
                        const newMessage = JSON.parse(message.body);

                        // If the message is already in the messages array, update it
                        setMessages((prev) => {
                            const messageIndex = prev.findIndex(
                                (msg) => msg.id === newMessage.id
                            );

                            if (messageIndex !== -1) {
                                const updatedMessages = [...prev];
                                updatedMessages[messageIndex] = newMessage;
                                return updatedMessages;
                            } else {
                                return [...prev, newMessage];
                            }
                        });
                    }
                );
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
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
        if (!client || content.length === 0) return;
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
