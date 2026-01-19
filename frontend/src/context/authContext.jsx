import { createContext, useContext, useEffect, useState } from "react";
import api from "./../lib/api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [user, setUser] = useState({
        role: "EMPLOYEE",
        email: "",
        name: ""
    });
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        RefreshToken();
    }, []);

    const RefreshToken = async () => {
        try {
            const res = await api.get("/auth/refresh");
            setUser(res?.data?.user);
            setLoggedIn(true);
        } catch (err) {
            console.log("Failed to refresh token");
            setLoggedIn(false);
            setUser({});
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                loggedIn,
                RefreshToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 