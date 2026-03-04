import type React from "react"
import type { LoginForm } from "./types"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { LoginFormSchema } from "./schemas"
import Button from "../../shared/ui/Button"

const defaultLoginValues: LoginForm = {
    email: "",
    password: "",
}

export default function LoginForm() {
    const mutation = useMutation({
        mutationFn: (login: LoginForm) => {
            return axios.post("http://localhost:3000/api/auth/login", login)
        }
    })

    const form = useForm({
        defaultValues: defaultLoginValues,
        onSubmit: async ({ value }) => {
            await mutation.mutateAsync(value)
        }
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <form.Field
                name="email"
                validators={{
                    onBlur: ({ value }) => {
                        const result = LoginFormSchema.shape.email.safeParse(value)
                        return result.success ? undefined : result.error.issues[0].message
                    }
                }}
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
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <span>
                                {field.state.meta.errors.join(', ')}
                            </span>
                        )}
                    </div>
                )}
            />
            <form.Field
                name="password"
                validators={{
                    onBlur: ({ value }) => {
                        const result = LoginFormSchema.shape.password.safeParse(value)
                        return result.success ? undefined : result.error.issues[0].message
                    }
                }}
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
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <span>
                                {field.state.meta.errors.join(', ')}
                            </span>
                        )}
                    </div>
                )}
            />

            {mutation.isError ? (
                <div>Invalid email or password</div>
            ) : null}

            <Button isDisabled={mutation.isPending} type="submit">{mutation.isPending ? "Wait..." : "Login"}</Button>
            <Button isDisabled={mutation.isPending} type="text">Connect with Google</Button>
        </form>
    )
}