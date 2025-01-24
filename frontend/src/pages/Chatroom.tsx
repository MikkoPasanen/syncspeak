//Components
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/navbar';
import Chat from '@/components/ui/Chat';

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
          <Sidebar />
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
