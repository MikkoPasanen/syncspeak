import { useEffect, useState } from "react";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  username: string;
}

const Sidebar = ({
  setReceiverId,
  setReceiverName,
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
          { withCredentials: true },
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
      <div className="w-1/4 bg-custom-dark-2 p-2 border-r border-gray-300 rounded-bl-xl flex items-center justify-center text-white font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-1/4 bg-custom-dark-2 p-2 border-r border-gray-300 rounded-bl-xl">
      <h2 className="text-2xl font-semibold mb-2 text-white text-center">
        Users
      </h2>
      {users
        .filter((user) => user.username !== localStorage.getItem("username"))
        .map((user) => (
          <div
            key={user.id}
            className="p-2 cursor-pointer hover:bg-custom-dark-4 rounded text-white"
            onClick={() => {
              setReceiverId(user.id);
              setReceiverName(user.username);
            }}
          >
            <div className="flex items-center mb-1">
              <Avatar className="mr-2 hover:cursor-pointer">
                <AvatarFallback className="border-black border-2 font-bold text-black">
                  {(user.username?.at(0) ?? "").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold">{user.username}</h2>
                <small className="text-[10px]">Last message</small>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
