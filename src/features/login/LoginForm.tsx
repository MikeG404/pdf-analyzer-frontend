import { useForm } from "@tanstack/react-form"

type LoginForm = {
    email: string,
    password: string,
}

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

    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
    }

    return (
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

            <button type="submit">Login</button>
        </form>
    )
}