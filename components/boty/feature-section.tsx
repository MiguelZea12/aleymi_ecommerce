"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Sparkles, ChefHat, Flower2, Globe, Clock } from "lucide-react"
import { useLang } from "./language-context"

const featuresData = {
  es: [
    { icon: Sparkles, title: "Presentación Premium", description: "Cada detalle cuidado con esmero" },
    { icon: ChefHat, title: "Sabor Casero", description: "Recetas de casa, preparadas con cariño" },
    { icon: Flower2, title: "Hecho a Mano", description: "Preparado artesanalmente con dedicación" },
    { icon: Globe, title: "Ingredientes Locales", description: "Productores locales certificados" },
  ],
  en: [
    { icon: Sparkles, title: "Premium Presentation", description: "Every detail carefully crafted" },
    { icon: ChefHat, title: "Homemade Flavor", description: "Home recipes, prepared with care" },
    { icon: Flower2, title: "Handmade", description: "Artisanally prepared with dedication" },
    { icon: Globe, title: "Local Ingredients", description: "Certified local producers" },
  ],
}

const translations = {
  es: {
    eyebrow: "Por Qué Aleymi",
    title: "Sabor que inspira.",
    body: "Creemos que cada bocadito debe ser una experiencia única. Cada producto está elaborado con intención y amor por lo que haces.",
    bentoTitle: "100% Artesanal",
    bentoSub: "100% Para Ti",
    bullet1: "Preparado en el Día",
    bullet2: "Ingredientes Seleccionados",
    bullet3: "Productores Locales",
    ecoTitle: "Presentación",
    ecoSub: "Premium",
    overlayTitle: "100% Artesanal",
    overlayBody: "Elaborados exclusivamente con ingredientes frescos y recetas tradicionales.",
  },
  en: {
    eyebrow: "Why Aleymi",
    title: "Flavor that inspires.",
    body: "We believe each bite should be a unique experience. Every product is crafted with intention and love for what you do.",
    bentoTitle: "100% Artisan",
    bentoSub: "100% For You",
    bullet1: "Freshly Prepared",
    bullet2: "Handpicked Ingredients",
    bullet3: "Local Producers",
    ecoTitle: "Presentation",
    ecoSub: "Premium",
    overlayTitle: "100% Artisan",
    overlayBody: "Made exclusively with fresh ingredients and traditional recipes.",
  },
}

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const bentoRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()
  const features = featuresData[lang]
  const tx = translations[lang]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (bentoRef.current) {
      observer.observe(bentoRef.current)
    }

    if (videoSectionRef.current) {
      videoObserver.observe(videoSectionRef.current)
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    return () => {
      if (bentoRef.current) {
        observer.unobserve(bentoRef.current)
      }
      if (videoSectionRef.current) {
        videoObserver.unobserve(videoSectionRef.current)
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Grid */}
        <div 
          ref={bentoRef}
          className="grid md:grid-cols-4 mb-20 md:grid-rows-[300px_300px] gap-6"
        >
          {/* Left Large Block - Video with Overlay Card */}
          <div 
            className={`relative rounded-3xl overflow-hidden h-[500px] md:h-auto md:col-span-2 md:row-span-2 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/artesanal.mp4" type="video/mp4" />
            </video>
            {/* Overlay Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white p-6 shadow-lg rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  
                </div>
                <div>
                  <h3 className="text-xl text-foreground mb-2 font-medium">
                    {tx.overlayTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tx.overlayBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - 100% Natural */}
          <div 
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center md:col-span-2 relative overflow-hidden transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Background Image */}
            <Image
              src="/naturales2.jpg  "
              alt="Natural ingredients"
              fill
              className="object-cover"
            />

            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl text-black mb-2">
                {tx.bentoTitle}
              </h3>
              <h3 className="text-2xl md:text-3xl text-black/70 mb-4">
                {tx.bentoSub}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black/90 text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{tx.bullet1}</span>
                </div>
                <div className="flex items-center gap-2 text-black/90 text-sm">
                  <Flower2 className="w-4 h-4 flex-shrink-0" />
                  <span>{tx.bullet2}</span>
                </div>
                <div className="flex items-center gap-2 text-black/90 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>{tx.bullet3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Premium */}
          <div 
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden md:col-span-2 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Background Image */}
            <Image
              src="/premium.jpg"
              alt="Premium presentation"
              fill
              className="object-cover"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/10" />
            
            <div className="relative z-10 flex flex-col justify-center h-full text-left items-start">
              <div className="inline-flex items-center justify-center w-10 h-10 mb-3">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-sans text-base mb-1 text-black">
                {tx.ecoSub}
              </h3>
              <h3 className="text-2xl md:text-3xl mb-2 text-black">
                {tx.ecoTitle}
              </h3>
            </div>
          </div>
        </div>

        <div 
          ref={videoSectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center my-0 py-20"
        >
          {/* Video */}
          <div 
            className={`relative aspect-[4/5] rounded-3xl overflow-hidden boty-shadow transition-all duration-700 ease-out ${
              isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/food2.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Content */}
          <div
            ref={headerRef}
            className={`transition-all duration-700 ease-out ${
              isVideoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
              {tx.eyebrow}
            </span>
            <h2 className={`font-serif text-4xl leading-tight text-foreground mb-6 text-balance md:text-7xl ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
              {tx.title}
            </h2>
            <p className={`text-lg text-muted-foreground leading-relaxed mb-10 max-w-md ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}>
              {lang === 'es'
                ? 'Cada bocadito está preparado con dedicación, ingredientes frescos y recetas de casa.'
                : 'Each bite is prepared with dedication, fresh ingredients and home recipes.'}
            </p>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-5 boty-transition hover:scale-[1.02] rounded-md bg-white"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 group-hover:bg-primary/20 boty-transition bg-stone-50">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
