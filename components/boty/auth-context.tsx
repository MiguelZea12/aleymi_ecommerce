"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/firebase"

export interface UserProfile {
  uid: string
  name: string
  phone: string
  email: string
  birthdate: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  register: (data: { name: string; phone: string; email: string; birthdate: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  authError: string | null
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid))
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const register = async ({
    name,
    phone,
    email,
    birthdate,
    password,
  }: {
    name: string
    phone: string
    email: string
    birthdate: string
    password: string
  }) => {
    setAuthError(null)
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      const profileData: UserProfile = { uid: newUser.uid, name, phone, email, birthdate }
      await setDoc(doc(db, "users", newUser.uid), {
        ...profileData,
        createdAt: serverTimestamp(),
      })
      setProfile(profileData)
    } catch (e: unknown) {
      setAuthError(mapAuthError(e))
      throw e
    }
  }

  const login = async (email: string, password: string) => {
    setAuthError(null)
    try {
      const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password)
      const snap = await getDoc(doc(db, "users", loggedUser.uid))
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null)
    } catch (e: unknown) {
      setAuthError(mapAuthError(e))
      throw e
    }
  }

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  const clearAuthError = () => setAuthError(null)

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, authError, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

function mapAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? ""
  switch (code) {
    case "auth/email-already-in-use": return "Este correo ya está registrado."
    case "auth/invalid-email": return "Correo electrónico inválido."
    case "auth/weak-password": return "La contraseña debe tener al menos 6 caracteres."
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Correo o contraseña incorrectos."
    case "auth/too-many-requests": return "Demasiados intentos. Intenta más tarde."
    default: return "Ocurrió un error. Intenta de nuevo."
  }
}
