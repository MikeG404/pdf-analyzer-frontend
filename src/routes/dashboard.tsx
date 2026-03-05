import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import useAuth from "../shared/hooks/useAuth";

const TOKEN_KEY = "auth_token"

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            throw redirect({ to: "/auth" })
        }
    },
    component: DashboardPage,
})

function DashboardPage() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate({ to: "/auth" })
    }

    return (
        <>
            <h1>Dashboard</h1>
            <p>Bienvenue, vous êtes connecté.</p>
            <button onClick={handleLogout}>Se déconnecter</button>
        </>
    )
}
