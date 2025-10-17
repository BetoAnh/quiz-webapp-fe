import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(!!user); // nếu có user → verify token

    useEffect(() => {
        const verifyToken = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await authService.auth();
                setUser(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setUser(null);
                } else {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    // Sync user vào localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
