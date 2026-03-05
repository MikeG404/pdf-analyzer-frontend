import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
import SignUpForm from "../features/auth/components/SignupForm";

export const Route = createFileRoute('/auth')({
    component: AuthPage,
})

function AuthPage() {
    
    
    return (
        <>
            <h1>Authentication</h1>
            <LoginForm />
            <br />
            <br />
            <br />
            <SignUpForm />
        </>
    )
}