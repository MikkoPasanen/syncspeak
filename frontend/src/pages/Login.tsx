// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Other
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

// Validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const navigate = useNavigate();

  // Zod schema to validate form input
  const formSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
  });

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // When user clicks "Login" button
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setInvalidCredentials(false);
      setError(false);

      // Send request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        values,
        { withCredentials: true },
      );

      // If everything is OK, store data to localstorage and go to Chat page
      if (response.status === 200) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("id", response.data.userId);
        setIsAuthenticated(true);
        navigate("/chat");
      }
    } catch (error: unknown) {
      // If password or username is wrong
      if (axios.isAxiosError(error) && error.response?.status === 401)
        setInvalidCredentials(true);
      // If other error happened
      else setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2">SyncSpeak</h1>
        <h2 className="text-xl mb-10">Login</h2>
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
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="rounded text-black"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant={"ghost"}
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
            {invalidCredentials && (
              <h1 className="text-xl text-orange-600">
                Invalid credentials! Try again.
              </h1>
            )}
            {error && (
              <h1 className="text-xl text-orange-600">
                An error occured! Try again.
              </h1>
            )}
            <Button
              type="submit"
              className="rounded-xl w-full text-xl bg-custom-blue"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-custom-blue underline"
              >
                Sign up!
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
