import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { loginAsync } from "../../redux/slices/auth-slice";
import type { RootState } from "../../redux/store";
import CircularProgress from '@mui/material/CircularProgress';

type LoginFormInputs = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const { login: loadingLogin } = loading;

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log('Login Data:', data);
    dispatch(loginAsync({ username: data.email, password: data.password }));
  };

  return (
    <div className="flex items-center justify-center bg-gray-100" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex
                  message: 'Please enter a valid email address',
                },
               })}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must include uppercase, lowercase, number, and special character',
                }, 
              })}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div  className="w-full gap-1 flex items-start justify-center flex-col">
            <button
              type="submit"
              className="w-full action-gradient-bg text-white py-2 rounded-lg font-semibold transition gap-3 flex items-center justify-center"
              disabled={loadingLogin}>
              Login
              {loadingLogin && (
                <CircularProgress size="16px" 
                  sx={{ color: 'white' }}  />
              )}
            </button>

            {error && (
              <p className="text-red-500 text-sm ">{error}</p>
            )}
          </div>
         
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}