import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/auth')({
    component: AuthPage,
})

function AuthPage() {
    return <h1>Login</h1>
}