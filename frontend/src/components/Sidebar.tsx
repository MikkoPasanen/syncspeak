import { useEffect, useState } from "react";
import axios, { AxiosResponse, isAxiosError } from "axios";

interface User {
    id: string;
    username: string;
}

// interface SidebarProps {
//     onSelectUser: (user: User) => void;
//     currentUserId: string;
// }

const Sidebar = ({
    setReceiverId,
}: {
    setReceiverId: (value: string) => void;
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
        <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                        onClick={() => setReceiverId(user.id)}
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
