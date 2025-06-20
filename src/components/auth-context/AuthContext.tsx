import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { getCurrentUser, type GetCurrentUserOutput } from 'aws-amplify/auth';

interface AuthContextType {
  user: GetCurrentUserOutput | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [user, setUser] = React.useState<GetCurrentUserOutput | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userState = await getCurrentUser();
        setUser(userState);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (isAuthenticated) {
      checkUser();    
    }
  }, [isAuthenticated]);

  const contextValue = React.useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: isAuthenticated}),
    [user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};