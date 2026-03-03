import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../features/auth/LoginForm";

export const Route = createFileRoute('/auth')({
    component: AuthPage,
})

function AuthPage() {
    
    
    return (
        <>
            <h1>Login</h1>
            <LoginForm />
        </>
    )
}