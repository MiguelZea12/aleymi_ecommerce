"use client"

import { useState } from "react"
import { Loader2, User, LogIn, Eye, EyeOff } from "lucide-react"
import { useAuth } from "./auth-context"

const tx = {
  authTitle: "Crea tu cuenta",
  authSubtitle: "Registra tus datos una sola vez para gestionar tus pedidos más rápido.",
  tabRegister: "Crear cuenta",
  tabLogin: "Iniciar sesión",
  regName: "Nombre completo",
  regPhone: "Teléfono",
  regEmail: "Correo electrónico",
  regBirthdate: "Fecha de nacimiento",
  regPassword: "Contraseña",
  regPasswordHint: "Mínimo 6 caracteres",
  registerBtn: "Crear cuenta",
  loginEmail: "Correo electrónico",
  loginPassword: "Contraseña",
  loginBtn: "Iniciar sesión",
  loggingIn: "Ingresando...",
  registering: "Creando cuenta...",
  required: "Este campo es obligatorio",
  invalidEmail: "Email inválido",
  invalidPhone: "Teléfono inválido (mín. 7 dígitos)",
}

function Field({
  label, value, onChange, error, type = "text", hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  hint?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 boty-transition ${
          error ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30"
        }`}
      />
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}

function RegisterForm() {
  const { register, authError, clearAuthError } = useAuth()
  const [fields, setFields] = useState({ name: "", phone: "", email: "", birthdate: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (k: keyof typeof fields, v: string) => {
    setFields((p) => ({ ...p, [k]: v }))
    clearAuthError()
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fields.name.trim()) e.name = tx.required
    if (!fields.phone.trim()) e.phone = tx.required
    else if (fields.phone.replace(/\D/g, "").length < 7) e.phone = tx.invalidPhone
    if (!fields.email.trim()) e.email = tx.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = tx.invalidEmail
    if (!fields.birthdate) e.birthdate = tx.required
    if (!fields.password.trim()) e.password = tx.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try { await register(fields) } catch { /* error shown via authError */ }
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <Field label={tx.regName} value={fields.name} onChange={(v) => set("name", v)} error={errors.name} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={tx.regPhone} value={fields.phone} onChange={(v) => set("phone", v)} error={errors.phone} type="tel" />
        <Field label={tx.regEmail} value={fields.email} onChange={(v) => set("email", v)} error={errors.email} type="email" />
      </div>
      <Field label={tx.regBirthdate} value={fields.birthdate} onChange={(v) => set("birthdate", v)} error={errors.birthdate} type="date" />
      <div className="relative">
        <Field label={tx.regPassword} value={fields.password} onChange={(v) => set("password", v)} error={errors.password} type={showPass ? "text" : "password"} hint={tx.regPasswordHint} />
        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground" aria-label="Toggle password">
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {authError && <p className="text-sm text-destructive">{authError}</p>}
      <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 boty-transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.registering}</> : tx.registerBtn}
      </button>
    </div>
  )
}

function LoginForm() {
  const { login, authError, clearAuthError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = tx.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = tx.invalidEmail
    if (!password.trim()) e.password = tx.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    clearAuthError()
    if (!validate()) return
    setSubmitting(true)
    try { await login(email, password) } catch { /* error shown via authError */ }
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <Field label={tx.loginEmail} value={email} onChange={(v) => { setEmail(v); clearAuthError() }} error={errors.email} type="email" />
      <div className="relative">
        <Field label={tx.loginPassword} value={password} onChange={(v) => { setPassword(v); clearAuthError() }} error={errors.password} type={showPass ? "text" : "password"} />
        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground" aria-label="Toggle password">
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {authError && <p className="text-sm text-destructive">{authError}</p>}
      <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 boty-transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.loggingIn}</> : tx.loginBtn}
      </button>
    </div>
  )
}

export function AuthPanel({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [tab, setTab] = useState<"register" | "login">("register")
  return (
    <section className="bg-card rounded-2xl p-8 boty-shadow">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-foreground mb-1">{title ?? tx.authTitle}</h2>
        <p className="text-sm text-muted-foreground">{subtitle ?? tx.authSubtitle}</p>
      </div>
      <div className="flex gap-1 bg-background rounded-full p-1 mb-8 w-fit">
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`px-5 py-2 rounded-full text-sm font-medium boty-transition ${tab === "register" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          <User className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          {tx.tabRegister}
        </button>
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`px-5 py-2 rounded-full text-sm font-medium boty-transition ${tab === "login" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          <LogIn className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          {tx.tabLogin}
        </button>
      </div>
      {tab === "register" ? <RegisterForm /> : <LoginForm />}
    </section>
  )
}
