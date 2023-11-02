import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

interface AuthProps {
  authState?: {
    authenticated: boolean | null;
    userId: string | null;
    role: string | null;
  };
  authenticate?: (userId: string, role: string) => any;
  logout?: () => any;
}

export const AuthContext = createContext<AuthProps>({});
export const STATE_KEY = "loggedIn";
export const USER_ID_KEY = "dcusr_id";
export const ROLE_KEY = "dcur";

export const useAuth = () => {
  return useContext(AuthContext);
};

export const getAuthState = () => {
  return localStorage.getItem(STATE_KEY);
};

export const logout = () => {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(STATE_KEY);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
    userId: string | null;
    role: string | null;
  }>({
    authenticated: null,
    userId: null,
    role: null,
  });

  useEffect(() => {
    const loadToken = () => {
      const state = localStorage.getItem(STATE_KEY);
      const userId = localStorage.getItem(USER_ID_KEY);
      const role = localStorage.getItem(ROLE_KEY);

      if (state === "true") {
        setAuthState({ authenticated: true, userId, role });
      } else {
        setAuthState({ authenticated: false, userId: null, role: null });
      }
    };

    loadToken();
  }, []);

  const authenticate = async (userId: string, role: string) => {
    await localStorage.setItem(USER_ID_KEY, userId);
    await localStorage.setItem(ROLE_KEY, role);
    await localStorage.setItem(STATE_KEY, "true");

    setAuthState({ authenticated: true, userId, role });
  };

  const logout = async () => {
    await localStorage.removeItem(ROLE_KEY);
    await localStorage.removeItem(USER_ID_KEY);
    await localStorage.removeItem(STATE_KEY);

    setAuthState({ authenticated: false, userId: null, role: null });
  };

  const value = {
    authenticate,
    logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
