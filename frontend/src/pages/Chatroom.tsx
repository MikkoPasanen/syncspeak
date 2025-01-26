//Components
import Sidebar from '../components/Sidebar';
import Navbar from '../components/navbar';
import Chat from '../components/Chat';

interface User {
    id: string;
    username: string;
    password: string;
    role: string;
    created_at: string;
}
const Chatroom = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center bg-white w-3/4 h-[90vh] rounded-xl shadow-xl rounded-xl">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <div className="flex w-full h-full">
          <Sidebar onSelectUser={function (user: User): void {
            throw new Error('Function not implemented.');
          } } currentUserId={''} />
          <Chat userId={''} receiverId={''} />
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
