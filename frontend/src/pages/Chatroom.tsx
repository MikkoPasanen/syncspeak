//Components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";
import Chat from "../components/Chat";

// Other
import { useState } from "react";

const Chatroom = ({
    setIsAuthenticated,
}: {
    setIsAuthenticated: (value: boolean) => void;
}) => {
    const [receiverId, setReceiverId] = useState<string | null>(null);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center bg-white w-3/4 h-[90vh] rounded-xl shadow-xl rounded-xl">
                <Navbar setIsAuthenticated={setIsAuthenticated} />
                <div className="flex w-full h-full">
                    <Sidebar setReceiverId={setReceiverId} />
                    {receiverId !== null ? (
                        <Chat receiverId={receiverId} />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <h1 className="text-3xl font-bold">
                                Select a user
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chatroom;
