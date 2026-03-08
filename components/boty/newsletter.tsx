"use client"

import React from "react"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { useLang } from "./language-context"

const t = {
  es: {
    title: "Únete a la familia",
    subtitle: "Suscríbete para ofertas exclusivas, recetas y acceso anticipado a nuevos productos.",
    placeholder: "Tu correo electrónico",
    button: "Suscribirse",
    success: "¡Bienvenido a la familia Aleymi!",
    fine: "Cancela cuando quieras. Respetamos tu bandeja de entrada.",
  },
  en: {
    title: "Join the family",
    subtitle: "Subscribe for exclusive deals, recipes and early access to new products.",
    placeholder: "Your email address",
    button: "Subscribe",
    success: "Welcome to the Aleymi family!",
    fine: "Cancel anytime. We respect your inbox.",
  },
}

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { lang } = useLang()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl leading-tight text-primary-foreground mb-4 text-balance md:text-7xl">
            {t[lang].title}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            {t[lang].subtitle}
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-8 py-4">
              <Check className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground">{t[lang].success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t[lang].placeholder}
                className="flex-1 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-6 py-4 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 boty-transition"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary-foreground/90"
              >
                {t[lang].button}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </button>
            </form>
          )}

          <p className="text-sm text-primary-foreground/60 mt-6">
            {t[lang].fine}
          </p>
        </div>
      </div>
    </section>
  )
}
