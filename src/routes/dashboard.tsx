import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAuth from "../shared/hooks/useAuth";

export const Route = createFileRoute('/dashboard')({
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
