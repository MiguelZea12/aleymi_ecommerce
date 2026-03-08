"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#e3e1e2' }}>
      {/* Background Video */}
      <div className="absolute inset-0" style={{ backgroundColor: '#e3e1e2' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/food3.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-20 mr-14 lg:mr-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <span className="text-sm uppercase mb-6 block text-white/90 animate-blur-in opacity-0 tracking-[0.2em]" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Bocaditos Artesanales
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-balance text-white">
              <span className="block animate-blur-in opacity-0 font-semibold" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>Sabor único.</span>
              <span className="block animate-blur-in opacity-0 font-semibold xl:text-9xl text-7xl" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>Hecho para ti.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0 text-white/90 animate-blur-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
              Descubre bocaditos preparados con amor. Ingredientes frescos, recetas artesanales, sabores inolvidables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-blur-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
              >
                Ver Menú
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white">
        <span className="text-xs tracking-widest uppercase font-bold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Desliza</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/70 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
