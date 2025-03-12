const Messages = ({
    messages,
    oldMessages,
    userId,
}: {
    messages: any[];
    oldMessages: any[];
    userId: string;
}) => {
    // Variables
    let lastDate: string = "";

    // Function to determine if we should print the date or not
    // PARAMS: date - the date of the message, prevDate - the date of the previous message
    const checkDate = (date: string, prevDate: string) => {
        const currentDate = new Date();
        const messageDate = new Date(date);

        // Function to check if two dates are the same day
        const isSameDay = (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        let dateString = "";

        // If the current day is the same as the messages date, store "Today"
        if (isSameDay(currentDate, messageDate)) {
            dateString = "Today";
        }
        // If the current day is the day before the messages date, store "Yesterday"
        else if (
            isSameDay(
                new Date(currentDate.setDate(currentDate.getDate() - 1)),
                messageDate
            )
        ) {
            dateString = "Yesterday";
        }
        // Else store the date in the format "Jan 01 2024"
        else {
            dateString = messageDate.toLocaleDateString([], {
                year: "numeric",
                month: "short",
                day: "2-digit",
            });
        }

        // Return the stored date and a boolean to determine if we should show the date
        return { dateString, shouldShowDate: dateString !== prevDate };
    };

    return (
        <div className="flex flex-col">
            {oldMessages.concat(messages).map((msg, idx) => {
                // Check if we should show the date for each message
                const { dateString, shouldShowDate } = checkDate(
                    msg.timestamp,
                    lastDate
                );

                // If the current date isn't the same as the last date
                // update the last date with the current messages date ("Today", "Yesterday", "Jan 01 2024")
                if (shouldShowDate) {
                    lastDate = dateString;
                }

                return (
                    <div key={idx}>
                        {shouldShowDate && (
                            <span className="text-white bg-custom-dark-1 rounded-xl w-fit p-1 text-xs mx-auto my-2 block">
                                {dateString}
                            </span>
                        )}
                        <div
                            className={`text-white mx-2 my-2 max-w-[60%] w-fit px-3 py-2 break-words relative ${
                                msg.senderId === userId
                                    ? "bg-custom-blue ml-auto rounded-tl-xl rounded-br-xl rounded-bl-xl"
                                    : "bg-gray-500 rounded-tr-xl rounded-br-xl rounded-bl-xl"
                            }`}
                        >
                            <span className="mr-8">{msg.content}</span>
                                {msg.senderId === userId && (
                                    <small className="text-xs text-white-600 absolute top-1 right-2">
                                        {msg.hasBeenRead ? "✓✓" : "✓"}
                                    </small>
                                )}
                            <small className="text-xs text-gray-300 absolute right-2 bottom-1">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </small>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;
