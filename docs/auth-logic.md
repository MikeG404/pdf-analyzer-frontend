# Logique d'authentification - Guide complet

## Architecture globale

```
src/
├── shared/
│   ├── contexts/
│   │   └── AuthContext.tsx    ← Provider + state global auth
│   └── hooks/
│       └── useAuth.ts         ← Hook pour consommer le contexte
├── features/auth/
│   ├── types.ts               ← Types (LoginForm)
│   ├── schemas.ts             ← Validation Zod
│   └── components/
│       ├── LoginForm.tsx      ← Formulaire de connexion
│       └── SignupForm.tsx     ← Formulaire d'inscription
├── routes/
│   ├── auth.tsx               ← Page /auth (login + signup)
│   └── dashboard.tsx          ← Page protégée /dashboard
└── main.tsx                   ← Point d'entrée, wrapping providers
```

---

## 1. AuthContext — Le coeur du système

**Fichier** : `src/shared/contexts/AuthContext.tsx`

### Ce qu'il fait :

- Stocke l'utilisateur connecté (`user`) dans un state React
- Persiste le token JWT dans le `localStorage` pour survivre aux rafraîchissements de page
- Expose 4 valeurs via le contexte :

| Valeur             | Type              | Description                                      |
|--------------------|-------------------|--------------------------------------------------|
| `user`             | `User \| null`    | L'utilisateur connecté (contient le `token`)      |
| `isAuthenticated`  | `boolean`         | `true` si un utilisateur est connecté             |
| `login(user)`      | `function`        | Connecte l'utilisateur et sauvegarde le token     |
| `logout()`         | `function`        | Déconnecte et supprime le token du localStorage   |

### Flux de persistance :

```
1. Au montage du composant :
   → useState lit le localStorage
   → Si un token existe → user = { token }
   → Sinon → user = null

2. Lors du login :
   → localStorage.setItem("auth_token", token)
   → setUser({ token })

3. Lors du logout :
   → localStorage.removeItem("auth_token")
   → setUser(null)
```

---

## 2. useAuth — Le hook d'accès

**Fichier** : `src/shared/hooks/useAuth.ts`

### Ce qu'il fait :

- Appelle `useContext(AuthContext)`
- Vérifie que le hook est utilisé à l'intérieur d'un `<AuthProvider>`
- Lance une erreur explicite sinon

### Utilisation :

```tsx
const { user, isAuthenticated, login, logout } = useAuth()
```

---

## 3. LoginForm — Connexion

**Fichier** : `src/features/auth/components/LoginForm.tsx`

### Flux :

```
1. L'utilisateur remplit email + password
2. Au submit → useMutation envoie POST /api/auth/login
3. Si succès :
   → login({ token: response.data.token })   // sauvegarde dans le contexte
   → navigate({ to: "/dashboard" })           // redirection
4. Si erreur :
   → Affiche "Invalid email or password"
```

### Librairies utilisées :
- `@tanstack/react-form` — gestion du formulaire
- `@tanstack/react-query` — mutation HTTP
- `axios` — requêtes HTTP

---

## 4. SignupForm — Inscription

**Fichier** : `src/features/auth/components/SignupForm.tsx`

### Flux :

```
1. L'utilisateur remplit email + password
2. Validation onBlur avec le schema Zod (LoginFormSchema)
   → Email : format valide
   → Password : min 9 caractères, max 20
3. Au submit → useMutation envoie POST /api/auth/signup
4. Si succès → affiche "Vous êtes bien inscrit"
```

> Note : Le signup ne connecte pas automatiquement l'utilisateur.
> Il doit ensuite se connecter via le LoginForm.

---

## 5. Validation Zod

**Fichier** : `src/features/auth/schemas.ts`

```ts
LoginFormSchema = z.object({
    email: z.email("Invalid Email"),
    password: z.string()
        .min(9, "Password must have at least 9 caracters")
        .max(20, "Password must have maximum 20 caracters")
})
```

Utilisé par le `SignupForm` pour la validation field-by-field au `onBlur`.

---

## 6. Wrapping dans main.tsx

```tsx
<StrictMode>
    <QueryClientProvider client={queryClient}>   // TanStack Query
        <AuthProvider>                            // Contexte Auth
            <RouterProvider router={router} />    // TanStack Router
        </AuthProvider>
    </QueryClientProvider>
</StrictMode>
```

### Ordre des providers (important) :

1. **QueryClientProvider** — en premier car les composants auth utilisent `useMutation`
2. **AuthProvider** — wraps le router pour que toutes les routes aient accès au contexte
3. **RouterProvider** — le router et ses routes

---

## 7. Schéma du flux complet

```
┌─────────────┐     POST /auth/login      ┌──────────┐
│  LoginForm  │ ────────────────────────►  │  Backend │
│             │ ◄────────────────────────  │          │
└──────┬──────┘     { token: "xxx" }       └──────────┘
       │
       │ login({ token })
       ▼
┌──────────────┐
│ AuthContext   │
│              │ ── localStorage.setItem("auth_token", token)
│ user = {...} │
│ isAuth = true│
└──────┬───────┘
       │
       │ navigate("/dashboard")
       ▼
┌──────────────┐
│  Dashboard   │ ── useAuth() → { logout }
│              │
└──────────────┘

       │ logout()
       ▼
┌──────────────┐
│ AuthContext   │
│              │ ── localStorage.removeItem("auth_token")
│ user = null  │
│ isAuth = false│
└──────────────┘
```

---

## Points clés à retenir

1. **Le token est persisté dans localStorage** — un refresh de page ne déconnecte pas l'utilisateur
2. **`isAuthenticated`** est un booléen dérivé (`!!user`) — pas un state séparé
3. **Le hook `useAuth`** est le seul point d'accès au contexte — ne jamais utiliser `useContext(AuthContext)` directement
4. **Le signup ne connecte pas** — c'est un choix délibéré, l'utilisateur doit confirmer en se connectant
