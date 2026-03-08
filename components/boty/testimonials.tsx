"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { useLang } from "./language-context"

const testimonialsData = {
  es: [
    {
      id: 1,
      name: "Alejandro Z.",
      location: "Quito, Ecuador",
      rating: 5,
      text: "Los bocaditos de Aleymi hicieron que mi reunión fuera un éxito total. Todos querían saber dónde los conseguí.",
      product: "Tabla Clásica"
    },
    {
      id: 2,
      name: "Alejandra Z.",
      location: "Guayaquil, Ecuador",
      rating: 5,
      text: "Por fin encontré bocaditos que saben caseros de verdad. Los ingredientes frescos hacen toda la diferencia.",
      product: "Mini Empanadas"
    },
    {
      id: 3,
      name: "Anthonella C.",
      location: "Cuenca, Ecuador",
      rating: 5,
      text: "Las tablas de quesos son espectaculares. La presentación es hermosa y el sabor es increíble.",
      product: "Tabla de Quesos"
    },
    {
      id: 4,
      name: "Aldair T.",
      location: "Ambato, Ecuador",
      rating: 5,
      text: "Pedí para un evento corporativo y todos quedaron encantados. La calidad es insuperable.",
      product: "Pack Corporativo"
    },
    {
      id: 5,
      name: "Malena P.",
      location: "Riobamba, Ecuador",
      rating: 5,
      text: "Me encanta que todo es fresco y artesanal. El empaque es muy bonito e impecable.",
      product: "Bocaditos Dulces"
    },
    {
      id: 6,
      name: "Miguel Z.",
      location: "Loja, Ecuador",
      rating: 5,
      text: "Los mini sándwiches son perfectos para las reuniones del trabajo. Siempre pido de más porque vuelan.",
      product: "Mini Sándwiches"
    },
    {
      id: 7,
      name: "Sebastian Z.",
      location: "Ibarra, Ecuador",
      rating: 5,
      text: "La variedad de sabores es increíble. Cada bocadito tiene un toque especial que lo hace único.",
      product: "Tabla Gourmet"
    },
    {
      id: 8,
      name: "Christian S.",
      location: "Manta, Ecuador",
      rating: 5,
      text: "Pedí para el cumpleaños de mi hija y fue todo un éxito. Los bocaditos dulces son deliciosos.",
      product: "Pack Fiesta"
    },
    {
      id: 9,
      name: "Cintia I.",
      location: "Santo Domingo, Ecuador",
      rating: 5,
      text: "La atención al cliente es excelente y los bocaditos siempre llegan frescos. ¡100% recomendados!",
      product: "Tabla Clásica"
    }
  ],
  en: [
    {
      id: 1,
      name: "Alejandro Z.",
      location: "Quito, Ecuador",
      rating: 5,
      text: "Aleymi's bites made my meeting a total success. Everyone wanted to know where I got them.",
      product: "Classic Board"
    },
    {
      id: 2,
      name: "Alejandra Z.",
      location: "Guayaquil, Ecuador",
      rating: 5,
      text: "I finally found bites that truly taste homemade. The fresh ingredients make all the difference.",
      product: "Mini Empanadas"
    },
    {
      id: 3,
      name: "Anthonella C.",
      location: "Cuenca, Ecuador",
      rating: 5,
      text: "The cheese boards are spectacular. The presentation is beautiful and the flavor is amazing.",
      product: "Cheese Board"
    },
    {
      id: 4,
      name: "Aldair T.",
      location: "Ambato, Ecuador",
      rating: 5,
      text: "I ordered for a corporate event and everyone was delighted. The quality is unmatched.",
      product: "Corporate Pack"
    },
    {
      id: 5,
      name: "Malena P.",
      location: "Riobamba, Ecuador",
      rating: 5,
      text: "I love that everything is fresh and artisan. The packaging is also very pretty and impeccable.",
      product: "Sweet Bites"
    },
    {
      id: 6,
      name: "Miguel Z.",
      location: "Loja, Ecuador",
      rating: 5,
      text: "The mini sandwiches are perfect for work meetings. I always order extra because they fly.",
      product: "Mini Sandwiches"
    },
    {
      id: 7,
      name: "Sebastian Z.",
      location: "Ibarra, Ecuador",
      rating: 5,
      text: "The variety of flavors is incredible. Each bite has a special touch that makes it unique.",
      product: "Gourmet Board"
    },
    {
      id: 8,
      name: "Christian S.",
      location: "Manta, Ecuador",
      rating: 5,
      text: "I ordered for my daughter's birthday and it was a total hit. The sweet bites are delicious.",
      product: "Party Pack"
    },
    {
      id: 9,
      name: "Cintia I.",
      location: "Santo Domingo, Ecuador",
      rating: 5,
      text: "Customer service is excellent and the bites always arrive fresh. 100% recommended!",
      product: "Classic Board"
    }
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
