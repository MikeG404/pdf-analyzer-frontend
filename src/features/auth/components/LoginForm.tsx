import type React from "react"
import type { LoginForm } from "../types"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import Button from "../../../shared/ui/Button"
import useAuth from "../../../shared/hooks/useAuth"
import { useNavigate } from "@tanstack/react-router"

const BASE_URL = "http://localhost:3000/api"

const defaultLoginValues: LoginForm = {
    email: "",
    password: "",
}

export default function LoginForm() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: (login: LoginForm) => {
            return axios.post(`${BASE_URL}/auth/login`, login)
        },
        onSuccess: (response) => {
            login({
                token: response.data.token
            })

            navigate({ to: "/dashboard"})
        }
    })

    const form = useForm({
        defaultValues: defaultLoginValues,
        onSubmit: async ({ value }) => {
            await loginMutation.mutateAsync(value)
        }
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <form.Field
                    name="email"
                    children={(field) => (
                        <div>
                            <label htmlFor={field.name}>Email :</label>
                            <input
                                type="email"
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                            />
                        </div>
                    )}
                />
                <form.Field
                    name="password"
                    children={(field) => (
                        <div>
                            <label htmlFor={field.name}>Password :</label>
                            <input
                                type="password"
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                            />
                        </div>
                    )}
                />

                {loginMutation.isError ? (
                    <div>Invalid email or password</div>
                ) : null}

                <Button isDisabled={loginMutation.isPending} type="submit">{loginMutation.isPending ? "Wait..." : "Login"}</Button>
            </form>
            <a href={`${BASE_URL}/auth/google`}>
                Connect with Google
            </a>
        </>

    )
}