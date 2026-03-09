"use client"

import { ArrowRight, ClipboardList, MapPin, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { useLang } from "./language-context"

const t = {
  es: {
    title: "Únete a la familia",
    subtitle: "Crea tu cuenta y haz tus pedidos más rápido, sin repetir tus datos cada vez.",
    perks: [
      { icon: "clipboard", text: "Historial de todos tus pedidos" },
      { icon: "map", text: "Guarda tu dirección de entrega" },
      { icon: "shield", text: "Tus datos seguros, siempre" },
    ],
    cta: "Crear mi cuenta",
    ctaLoggedIn: "Ver mis pedidos",
    note: "Es gratis. Sin compromisos.",
    greeting: "¡Ya eres parte de la familia, ",
  },
  en: {
    title: "Join the family",
    subtitle: "Create your account and order faster — no need to re-enter your details every time.",
    perks: [
      { icon: "clipboard", text: "Full order history" },
      { icon: "map", text: "Save your delivery address" },
      { icon: "shield", text: "Your data, always safe" },
    ],
    cta: "Create my account",
    ctaLoggedIn: "View my orders",
    note: "It's free. No strings attached.",
    greeting: "You're already part of the family, ",
  },
}

const icons = {
  clipboard: ClipboardList,
  map: MapPin,
  shield: ShieldCheck,
} as const

export function Newsletter() {
  const { lang } = useLang()
  const { user, profile } = useAuth()
  const router = useRouter()
  const tx = t[lang]

  const handleCta = () => {
    if (user) {
      router.push("/cuenta?tab=pedidos")
    } else {
      router.push("/cuenta")
    }
  }

  return (
    <section className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl leading-tight text-primary-foreground mb-4 text-balance md:text-7xl">
            {tx.title}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            {user
              ? tx.greeting + (profile?.name?.split(" ")[0] ?? "") + "!"
              : tx.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            {tx.perks.map((perk) => {
              const Icon = icons[perk.icon as keyof typeof icons]
              return (
                <div key={perk.text} className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{perk.text}</span>
                </div>
              )
            })}
          </div>

          <button
            onClick={handleCta}
            className="group inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary-foreground/90"
          >
            {user ? tx.ctaLoggedIn : tx.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
          </button>

          {!user && (
            <p className="text-sm text-primary-foreground/60 mt-6">{tx.note}</p>
          )}
        </div>
      </div>
    </section>
  )
}

