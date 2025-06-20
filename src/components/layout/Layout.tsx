import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../auth-context/AuthContext";
import { logoutAsync } from "../../redux/slices/auth-slice";
import CircularProgress from "@mui/material/CircularProgress";
import type { RootState } from "../../redux/store";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const auth = useAuth(); 
  const dispatch = useDispatch();
  const { logout: logoutLoading } = useSelector((state: RootState) => state.auth.loading);

  const handleLogout = () => {
    dispatch(logoutAsync())
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className=" bg-white p-4 flex justify-between items-center">
        <span className="mogra-regular text-gray-800 text-2xl">Snap Vault</span>
        {auth?.isAuthenticated && (
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-gray-800 
                      hover:bg-gray-700 
                      text-white 
                      text-sm px-4 py-2 
                      rounded transition-colors
                      flex items-center gap-2">
            Logout
            {logoutLoading && (
              <CircularProgress size="16px" 
                sx={{ color: 'white' }}  />
            )}
          </button>
        )}
      </header>
      
      <main className="flex-grow bg-gray-100">{children}</main>
      {/* <footer className="text-center text-sm text-gray-500 p-4">© 2025</footer> */}
    </div>
  );
}