import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Dashboard } from './pages/dashboard/Dashboard'
import { SignUp } from './pages/sign-up/SignUp'
import { Unauthorized } from './pages/unauthorized/Unauthorized'
import PrivateRouter from './components/private-router/PrivateRouter'
import { Login } from './pages/login/Login'
import { Layout } from './components/layout/Layout'
import { useAuth } from './components/auth-context/AuthContext'

function App() {
  const auth = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/sign-up" 
            element={auth?.isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} 
          />
          <Route 
            path="/login" 
            element={auth?.isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route element={<PrivateRouter />}>
            <Route path="/" element={<Dashboard />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={auth?.isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
