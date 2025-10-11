import React from 'react';
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (pin: string) => Promise<void>;
    logout: () => void;
    error: string | null;
    rememberDevice: boolean;
    setRememberDevice: (remember: boolean) => void;
}
export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
