import type React from "react"
import type { LoginForm } from "./types"
import { useForm } from "@tanstack/react-form"
import { LoginFormSchema } from "./schemas"
import Button from "../../shared/ui/Button"

const defaultLoginValues: LoginForm = {
    email: "",
    password: "",
}

export default function LoginForm() {

    const form = useForm({
        defaultValues: defaultLoginValues,
        onSubmit: async ({ value }) => {
            console.log("Login ", value)
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

            <Button type="submit">Login</Button>
            <Button type="text">Google</Button>
        </form>
    )
}