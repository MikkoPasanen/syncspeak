// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Other
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

// Validation
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  const formSchema = z.object({
    username: z
      .string()
      .nonempty('Username is required')
      .max(30, 'Username must be at most 30 characters long'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters long'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setUserExists(false);
      setError(false);

      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + '/auth/signup',
        values,
      );

      if (response.status == 200) navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400)
        setUserExists(true);
      else setError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2">SyncSpeak</h1>
        <h2 className="text-xl mb-10">Signup</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black text-md">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      {...field}
                      className="rounded text-black"
                    />
                  </FormControl>
                  <FormMessage className="text-orange-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black text-md">Password</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="rounded text-black"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant={'ghost'}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        setPasswordVisible(!passwordVisible);
                      }}
                      size="icon"
                    >
                      {passwordVisible ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-orange-600" />
                </FormItem>
              )}
            />
            {userExists && (
              <h1 className="text-xl text-orange-600">
                User with the same name already exists!
              </h1>
            )}
            {error && (
              <h1 className="text-xl text-orange-600">
                An error occured! Try again.
              </h1>
            )}
            <Button
              type="submit"
              className="rounded-xl w-full text-xl bg-sky-600"
            >
              Sign up
            </Button>
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-sky-900 underline">
                Login!
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
