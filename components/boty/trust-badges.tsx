"use client"

import { useEffect, useRef, useState } from "react"
import { Droplets, Sparkles, Flower2, ChefHat } from "lucide-react"
import { useLang } from "./language-context"

const badgesData = {
  es: [
    { icon: ChefHat, title: "Ingredientes Frescos", description: "Seleccionados cada día con cuidado" },
    { icon: Droplets, title: "Recetas Artesanales", description: "Preparados con dedicación" },
    { icon: Sparkles, title: "Sabor Único", description: "Combinaciones exclusivas" },
    { icon: Flower2, title: "Hecho a Mano", description: "Con amor en cada bocado" },
  ],
  en: [
    { icon: ChefHat, title: "Fresh Ingredients", description: "Carefully selected every day" },
    { icon: Droplets, title: "Artisan Recipes", description: "Prepared with dedication" },
    { icon: Sparkles, title: "Unique Flavor", description: "Exclusive combinations" },
    { icon: Flower2, title: "Handmade", description: "With love in every bite" },
  ],
}

export function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()
  const badges = badgesData[lang]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={sectionRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className={`bg-background p-6 lg:p-8 text-center rounded-xl border border-stone-200 transition-all duration-700 ease-out border-none ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <badge.icon className="text-primary mb-4 mx-auto size-12" strokeWidth={1} />
              <h3 className="font-serif text-foreground mb-2 text-2xl">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
