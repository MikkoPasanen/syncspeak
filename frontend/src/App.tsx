import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatroom from './pages/Chatroom';
import ErrorPage from './pages/ErrorPage';

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { AxiosResponse, isAxiosError } from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response: AxiosResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/verify-token`,
          {},
          { withCredentials: true },
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error: unknown) {
        if (
          isAxiosError(error) &&
          (error.response?.status === 401 ||
            (isAxiosError(error) && error.response?.status === 403))
        ) {
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-bold">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div id="box" className="fixed"></div>
      <div className="relative min-h-screen">
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <Chatroom setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
