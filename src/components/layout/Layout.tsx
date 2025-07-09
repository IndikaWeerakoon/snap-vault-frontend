import { useAuth } from "../auth-context/AuthContext";
import { AvatarMenu } from "../avatar-menu/AvatarMenu";
import { Sidebar } from "../sidebar/Sidebar";
import logo from '@assets/logo.png';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const auth = useAuth(); 

  return (
    <div className="flex flex-col min-h-screen">
      
      <header className=" bg-white p-4 flex h-15 justify-between items-center">
        <img src={logo} alt="Logo" className=" w-25" />
        {auth?.isAuthenticated && (<AvatarMenu/>)}
      </header>
       {auth?.isAuthenticated && <div className="flex flex-grow">
          <aside className="w-55 bg-gray-100  hidden md:block border-t border-gray-200">
            <Sidebar />
          </aside>
        
        <div className="flex flex-grow border-t border-gray-200">
            <main className="flex-grow  p-6 ">{children}</main>
          </div>
      </div>}
      { !auth?.isAuthenticated && <main className="flex-grow bg-gray-100 ">{children}</main> }
     
      {/* <footer className="text-center text-sm text-gray-500 p-4">© 2025</footer> */}
    </div>
  );
}