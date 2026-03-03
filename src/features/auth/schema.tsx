import { z } from 'zod'

export const LoginFormSchema = z.object({
    email: z.email("Invalid Email"),
    password: z.string()
        .min(9, "Password must have at least 9 caracters")
        .max(20, "Password must have maximum 20 caracters")
})