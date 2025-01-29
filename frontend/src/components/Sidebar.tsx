import { useEffect, useState } from "react";
import axios, { AxiosResponse, isAxiosError } from "axios";

interface User {
    id: string;
    username: string;
}

const Sidebar = ({
    setReceiverId,
    setReceiverName
}: {
    setReceiverId: (value: string) => void;
    setReceiverName: (value: string) => void;
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response: AxiosResponse = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/users/all`,
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setUsers(response.data);
                }
            } catch (error: unknown) {
                if (
                    isAxiosError(error) &&
                    (error.response?.status === 401 ||
                        (isAxiosError(error) && error.response?.status === 403))
                ) {
                    console.log("Couldn't load users");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen font-bold">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-1/4 bg-custom-dark-2 p-4 border-r border-gray-300 rounded-bl-xl">
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">Users</h2>
            <ul>
                {users.filter(user => user.username !== localStorage.getItem("username")).map((user) => (
                    <li
                        key={user.id}
                        className="p-2 cursor-pointer hover:bg-custom-dark-4 rounded text-white"
                        onClick={() => { setReceiverId(user.id); setReceiverName(user.username); }}
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
