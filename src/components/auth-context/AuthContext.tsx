import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { UserResponse } from '../../api/type/api.type';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const contextValue = React.useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: isAuthenticated }),
    [user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};