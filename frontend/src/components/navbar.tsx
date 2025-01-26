//Components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

//Other
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

// Cheer messages for only the admin to see :)
const cheerMessages: string[] = [
  'Well done!',
  '10/10!',
  'You have earned your paycheck!',
  'Great job!',
  "You're a superstar!",
  'Keep up the good work!',
  "That's amazing!",
  "You're killing it!",
  'Awesome work!',
  'You nailed it!',
  'Fantastic effort!',
  "You're on fire!",
  'Incredible performance!',
  "You're unstoppable!",
  'Excellent work!',
  'Outstanding!',
  'Way to go!',
  'Impressive!',
  "You're crushing it!",
  'Bravo!',
];

const Navbar = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

  // Logout the user and clear cookies
  const logout = async () => {
    try {
      const response: AxiosResponse = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/auth/logout',
        {},
        { withCredentials: true },
      );
      if (response.status === 200) {
        localStorage.clear();
        navigate('/login');
        setIsAuthenticated(false);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-sky-600 py-5 flex justify-between items-center rounded-t-xl">
        <h1 className="font-bold text-3xl text-white ml-5">SyncSpeak</h1>
        <div className="flex flex-col items-end">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="mr-5 hover:cursor-pointer">
                <AvatarFallback className="border-black border-2 font-bold">
                  {localStorage.getItem('username')?.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-64 flex flex-col items-center">
              <p>
                Signed in as{' '}
                <span className="font-bold">
                  {localStorage.getItem('username')}
                </span>
              </p>
              <Button
                variant={'destructive'}
                size={'sm'}
                className="rounded mt-5"
                onClick={() => logout()}
              >
                Log out
              </Button>
            </PopoverContent>
          </Popover>
          {/* If the admin is logged in, show him a cheer message */}
          {localStorage.getItem('username') === 'Admin' &&
            localStorage.getItem('role') === 'ADMIN' && (
              <p className="text-white mr-5 mt-2">{`Dear ${localStorage.getItem('username')}, ${cheerMessages[Math.floor(Math.random() * cheerMessages.length)]}`}</p>
            )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Navbar;
