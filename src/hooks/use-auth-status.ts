import { useState, useEffect } from "react";

interface User {
  userId: number;
  username: string;
  email: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuthStatus() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/status");

        // Check if the response is OK before parsing JSON
        if (!response.ok) {
          console.error(
            `Auth status check failed: ${response.status} ${response.statusText}`,
          );
          const errorText = await response.text();
          console.error("Error response:", errorText);

          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return;
        }

        const data = await response.json();

        setAuthStatus({
          isAuthenticated: data.isAuthenticated,
          user: data.user || null,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  return authStatus;
}
