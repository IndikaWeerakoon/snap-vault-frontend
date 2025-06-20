// auth.ts
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number;
  roles: string[];
  sub: string;
}

export function getUserFromToken(): DecodedToken | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) return null; // token expired
    return decoded;
  } catch {
    return null;
  }
}