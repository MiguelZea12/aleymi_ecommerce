"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { useLang } from "./language-context"

const testimonialsData = {
  es: [
    { id: 1, name: "Alejandro Z.", location: "Portoviejo, Ecuador", rating: 5, text: "Los bocaditos de Aleymi hicieron que mi reunión fuera un éxito total. Pedí la bandeja completa y todos querían saber dónde la conseguí.", product: "Bandeja Completa" },
    { id: 2, name: "Alejandra Z.", location: "Portoviejo, Ecuador", rating: 5, text: "Por fin encontré bocaditos que saben caseros de verdad. Las empanadillas son mis favoritas, siempre las pido.", product: "Mini Empanadillas" },
    { id: 3, name: "Anthonella C.", location: "Portoviejo, Ecuador", rating: 5, text: "Las tartaletas de camarón son espectaculares. La presentación es hermosa y el sabor es increíble.", product: "Tartaletas" },
    { id: 4, name: "Aldair T.", location: "Portoviejo, Ecuador", rating: 5, text: "Pedí la bandeja completa para un evento corporativo y todos quedaron encantados. La calidad es insuperable.", product: "Bandeja Completa" },
    { id: 5, name: "Malena P.", location: "Portoviejo, Ecuador", rating: 5, text: "Las mini hamburguesas son perfectas para mis reuniones. Todo fresco y artesanal, la presentación impecable.", product: "Mini Hamburguesas" },
    { id: 6, name: "Miguel Z.", location: "Portoviejo, Ecuador", rating: 5, text: "Los mini sanduchitos son perfectos para las reuniones del trabajo. Siempre pido de más porque vuelan.", product: "Mini Sanduchitos" },
    { id: 7, name: "Sebastian Z.", location: "Portoviejo, Ecuador", rating: 5, text: "Los mini hot dog son increíbles. Cada uno tiene un toque especial que los hace únicos.", product: "Mini Hot Dog" },
    { id: 8, name: "Christian S.", location: "Portoviejo, Ecuador", rating: 5, text: "Pedí bolas de carne para el cumpleaños de mi hija y fue todo un éxito. ¡Desaparecieron en minutos!", product: "Bolas de Carne" },
    { id: 9, name: "Cintia I.", location: "Portoviejo, Ecuador", rating: 5, text: "La atención es excelente y los bocaditos siempre llegan frescos. Los dedos de queso son una delicia.", product: "Dedos de Queso" },
  ],
  en: [
    { id: 1, name: "Alejandro Z.", location: "Portoviejo, Ecuador", rating: 5, text: "Aleymi's bites made my meeting a total success. I ordered the full tray and everyone wanted to know where I got it.", product: "Full Tray" },
    { id: 2, name: "Alejandra Z.", location: "Portoviejo, Ecuador", rating: 5, text: "I finally found bites that truly taste homemade. The empanadas are my favorites, I always order them.", product: "Mini Empanadas" },
    { id: 3, name: "Anthonella C.", location: "Portoviejo, Ecuador", rating: 5, text: "The shrimp tartlets are spectacular. The presentation is beautiful and the flavor is amazing.", product: "Tartlets" },
    { id: 4, name: "Aldair T.", location: "Portoviejo, Ecuador", rating: 5, text: "I ordered the full tray for a corporate event and everyone was delighted. The quality is unmatched.", product: "Full Tray" },
    { id: 5, name: "Malena P.", location: "Portoviejo, Ecuador", rating: 5, text: "The mini burgers are perfect for my gatherings. Everything fresh and artisan, presentation impeccable.", product: "Mini Burgers" },
    { id: 6, name: "Miguel Z.", location: "Portoviejo, Ecuador", rating: 5, text: "The mini sandwiches are perfect for work meetings. I always order extra because they fly.", product: "Mini Sandwiches" },
    { id: 7, name: "Sebastian Z.", location: "Portoviejo, Ecuador", rating: 5, text: "The mini hot dogs are incredible. Each one has a special touch that makes them unique.", product: "Mini Hot Dogs" },
    { id: 8, name: "Christian S.", location: "Portoviejo, Ecuador", rating: 5, text: "I ordered meatballs for my daughter's birthday and it was a total hit. They disappeared in minutes!", product: "Meatballs" },
    { id: 9, name: "Cintia I.", location: "Portoviejo, Ecuador", rating: 5, text: "Customer service is excellent and the bites always arrive fresh. The cheese fingers are a delight.", product: "Cheese Fingers" },
  ],
}

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonialsData.es)[0] }) => (
  <div className="rounded-3xl p-6 bg-white mb-4 flex-shrink-0"
    style={{
      boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"
    }}
  >
    {/* Stars */}
    

    {/* Quote */}
    <p className="text-foreground/80 leading-relaxed mb-4 text-pretty font-medium text-xl font-serif tracking-wide">
      &ldquo;{testimonial.text}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-foreground text-sm font-bold">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
      </div>
      <span className="text-xs tracking-wide text-primary/70 bg-primary/5 px-2 py-1 rounded-full whitespace-nowrap">
        {testimonial.product}
      </span>
    </div>
  </div>
)

export function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()
  const testimonials = testimonialsData[lang]
  
  const column1 = [testimonials[0], testimonials[3], testimonials[6]]
  const column2 = [testimonials[1], testimonials[4], testimonials[7]]
  const column3 = [testimonials[2], testimonials[5], testimonials[8]]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-background overflow-hidden pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            {lang === 'es' ? 'Opiniones' : 'Reviews'}
          </span>
          <h2 className={`font-serif text-4xl leading-tight text-foreground text-balance md:text-7xl ${headerVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
            {lang === 'es' ? 'Amados por todos' : 'Loved by everyone'}
          </h2>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          
          {/* Mobile - Single Column */}
          <div className="md:hidden h-[600px]">
            <div className="relative overflow-hidden h-full">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={`mobile-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop - Three Columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 h-[600px]">
            {/* Column 1 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column1, ...column1].map((testimonial, index) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolling Up */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-up hover:animate-scroll-up-slow">
                {[...column2, ...column2].map((testimonial, index) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 3 - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div className="animate-scroll-down hover:animate-scroll-down-slow">
                {[...column3, ...column3].map((testimonial, index) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }

        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }

        .animate-scroll-down-slow {
          animation: scroll-down 60s linear infinite;
        }

        .animate-scroll-up-slow {
          animation: scroll-up 60s linear infinite;
        }
      `}</style>
    </section>
  )
}
