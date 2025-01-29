const Message = ({ messages, oldMessages, userId }: { messages: any[], oldMessages: any[], userId: string }) => {
    return (
        <div className="flex flex-col">
            {oldMessages.concat(messages).map((msg, idx) => (
                <div
                    key={idx}
                    className={`text-white mx-2 mt-3 max-w-[60%] w-fit px-3 py-2 break-words relative ${
                        msg.senderId === userId
                            ? "bg-custom-blue ml-auto rounded-tl-xl rounded-br-xl rounded-bl-xl"
                            : "bg-gray-500 rounded-tr-xl rounded-br-xl rounded-bl-xl"
                    }`}
                >
                    <span className="mr-8">{msg.content}</span>
                    <small className="text-xs text-gray-300 absolute right-2 bottom-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </small>
                </div>
            ))}
        </div>
    );
};

export default Message;
