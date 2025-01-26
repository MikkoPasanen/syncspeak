import { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.ts";
import axios from "axios";

const Chat = ({
    userId,
    receiverId,
}: {
    userId: string;
    receiverId: string;
}) => {
    const { messages, sendMessage } = useWebSocket(userId);
    const [oldMessages, setOldMessages] = useState<any[]>([]);
    const [text, setText] = useState("");

    useEffect(() => {
        // Fetch chat history when component mounts
        axios
            .get(`http://localhost:8080/api/chat/${userId}/${receiverId}`)
            .then((response) => {
                setOldMessages(response.data); // Store old messages
            })
            .catch((error) =>
                console.error("Error fetching chat history:", error)
            );
    }, [userId, receiverId]);

    return (
        <div className="w-3/4 flex justify-center items-center">
            {/* Display old messages first */}
            <div>
                {oldMessages.map((msg, idx) => (
                    <p key={idx}>
                        <strong>
                            {msg.senderId === userId ? "Me" : "Them"}:
                        </strong>{" "}
                        {msg.content}
                    </p>
                ))}
            </div>

            {/* Display real-time messages */}
            <div>
                {messages.map((msg: { senderId: string; content: string }, idx: number) => (
                    <p key={idx + oldMessages.length}>
                        <strong>
                            {msg.senderId === userId ? "Me" : "Them"}:
                        </strong>{" "}
                        {msg.content}
                    </p>
                ))}
            </div>

            {/* Input field to send new messages */}
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => sendMessage(receiverId, text)}>Send</button>
        </div>
    );
};

export default Chat;
