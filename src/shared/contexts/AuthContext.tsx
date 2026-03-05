import { createContext, useState, type ReactNode } from "react";

export type User = {
    token: string
}

export type AuthContextType = {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        return storedToken ? { token: storedToken } : null
    })

    const isAuthenticated = !!user

    const login = (userData: User) => {
        localStorage.setItem(TOKEN_KEY, userData.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
