"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Clock, Sparkles, Globe } from "lucide-react"
import { useLang } from "./language-context"

const t = {
  es: {
    title: "100% Artesanal",
    sub: "100% Para Ti",
    bullet1: "Preparado en el Día",
    bullet2: "Ingredientes Seleccionados",
    bullet3: "Productores Locales",
  },
  en: {
    title: "100% Artisan",
    sub: "100% For You",
    bullet1: "Freshly Prepared",
    bullet2: "Handpicked Ingredients",
    bullet3: "Local Producers",
  },
}

export function CTABanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={bannerRef}
          className={`rounded-3xl p-12 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[400px] transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Background Image */}
          <Image
            src="/banner1.png"
            alt="Natural ingredients"
            fill
            className="object-cover"
          />
          
          <div className="relative z-10 text-left max-w-2xl">
            <h3 className="text-4xl md:text-5xl text-black mb-4 lg:text-5xl">
                {t[lang].title}
              </h3>
              <h3 className="text-3xl md:text-4xl lg:text-5xl text-black/70 mb-8">
                {t[lang].sub}
              </h3>
              
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3 text-black/90">
                  <Clock className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                  <span className="text-base">{t[lang].bullet1}</span>
                </div>
                <div className="flex items-center gap-3 text-black/90">
                  <Sparkles className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                  <span className="text-base">{t[lang].bullet2}</span>
                </div>
                <div className="flex items-center gap-3 text-black/90">
                  <Globe className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
                  <span className="text-base">{t[lang].bullet3}</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
