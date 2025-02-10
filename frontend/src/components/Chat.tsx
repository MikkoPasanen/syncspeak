// Other
import { useEffect, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";

// Websocket hook
import useWebSocket from "../hooks/useWebSocket.ts";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Messages from "./Messages.tsx";

const Chat = ({
    receiverId,
    receiverName,
}: {
    receiverId: string;
    receiverName: string;
}) => {
    const userId: string = localStorage.getItem("id") || "";
    const { messages, sendMessage, clearMessages } = useWebSocket(receiverId);
    const [oldMessages, setOldMessages] = useState<any[]>([]);
    const [loading = true, setLoading] = useState<boolean>(true);
    const [text, setText] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setLoading(true);
                const response: AxiosResponse = await axios.get(
                    `${
                        import.meta.env.VITE_API_BASE_URL
                    }/api/chat/${userId}/${receiverId}`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setOldMessages(response.data);
                }
            } catch (error: unknown) {
                console.error("Error fetching chat history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();

        return () => {
            clearMessages();
        };
    }, [userId, receiverId]);

    // Scroll to the bottom whenever the messages change and page is loaded
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [messages, oldMessages]);

    return (
        <div className="w-3/4 flex flex-col bg-custom-dark-3 h-full">
            {/* Chat header */}
            <div className="bg-custom-dark-2 text-white py-2 text-center w-full">
                <h1 className="text-2xl">Chat with {receiverName}</h1>
            </div>

            {/* Message container*/}
            <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(90vh-210px)]">
                {/* Loading screen / empty chat / messages */}
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-white">
                            Loading...
                        </h1>
                    </div>
                ) : messages.length === 0 && oldMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full flex-col text-white">
                        <h1 className="text-3xl mb-3">
                            You're starting a new chat with {receiverName}!
                        </h1>
                        <p className="text-lg">Type your first message below</p>
                    </div>
                ) : (
                    <Messages
                        messages={messages}
                        oldMessages={oldMessages}
                        userId={userId}
                    />
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input bar at bottom */}
            <div className="w-full px-5 py-3 flex items-center">
                <Input
                    placeholder="Enter text"
                    className="w-full mr-3 rounded"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    onClick={() => {
                        sendMessage(receiverId, text);
                        setText("");
                    }}
                    className="bg-custom-blue rounded"
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default Chat;
