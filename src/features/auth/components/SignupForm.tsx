import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query";
import type { LoginForm } from "../types"
import Button from "../../../shared/ui/Button";
import axios from "axios";
import { LoginFormSchema } from "../schemas";

const BASE_URL = "http://localhost:3000/api"

const defaultLoginValues: LoginForm = {
    email: "",
    password: "",
}

export default function SignUpForm() {
    const signUpMutation = useMutation({
        mutationFn: (signup: LoginForm) => {
            return axios.post(`${BASE_URL}/auth/signup`, signup)
        }
    })

    const form = useForm({
        defaultValues: defaultLoginValues,
        onSubmit: async ({ value }) => {
            await signUpMutation.mutateAsync(value)
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

            {signUpMutation.isSuccess && 
                <div>Vous êtes bien inscrit</div>
            }

            <Button type="submit">SignUp</Button>
        </form>
    )
}