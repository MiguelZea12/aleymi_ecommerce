"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { useLang } from "./language-context"

type Category = "bocaditos" | "bandejas"

const products = [
  { id: "bolas-de-carne", name: "Bolas de Carne", description: "50 unids. albóndigas caseras en salsa especial", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: "Popular", category: "bocaditos" as Category },
  { id: "dedos-de-queso", name: "Dedos de Queso", description: "50 unids. de queso o mortadela apanados", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" as Category },
  { id: "mini-empanadillas", name: "Mini Empanadillas", description: "50 unids. sabores: queso, pollo, carne o piña", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" as Category },
  { id: "mini-sanduchitos", name: "Mini Sanduchitos", description: "50 unids. queso cheddar, lechuga y jamón", price: 16, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" as Category },
  { id: "mini-hamburguesas", name: "Mini Hamburguesas", description: "50 unids. con aderezos especiales", price: 17.50, originalPrice: null, image: "/images/products/producto1.png", badge: "Nuevo", category: "bocaditos" as Category },
  { id: "mini-hotdog", name: "Mini Hot Dog", description: "50 unids. en pan artesanal", price: 17.50, originalPrice: null, image: "/images/products/miniHotdogs.png", badge: null, category: "bocaditos" as Category },
  { id: "mini-salchichas", name: "Mini Salchichas BBQ", description: "50 unids. en salsa BBQ especial", price: 10.50, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" as Category },
  { id: "tartaletas", name: "Tartaletas", description: "50 unids. de pollo o camarón", price: 18.50, originalPrice: null, image: "/images/products/producto1.png", badge: "Popular", category: "bocaditos" as Category },
  { id: "bandeja-completa", name: "Bandeja Completa", description: "100 piqueos surtidos seleccionados", price: 29, originalPrice: null, image: "/images/products/bandejaClasica.png", badge: "Nuevo", category: "bandejas" as Category },
  { id: "bandeja-personalizada", name: "Bandeja Personalizada", description: "Piqueos a tu elección — desde $2.75 c/u", price: 2.75, originalPrice: null, image: "/images/products/bandejaClasica.png", badge: null, category: "bandejas" as Category },
]

const categories = [
  { value: "bocaditos" as Category, label: { es: "Bocaditos", en: "Bites" } },
  { value: "bandejas" as Category, label: { es: "Bandejas", en: "Trays" } },
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("bocaditos")
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { lang } = useLang()
  
  const filteredProducts = products.filter(product => product.category === selectedCategory)

  const handleCategoryChange = (category: Category) => {
    if (category !== selectedCategory) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedCategory(category)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 300)
    }
  }

  // Preload all product images on mount
  useEffect(() => {
    products.forEach((product) => {
      const img = new window.Image()
      img.src = product.image
    })
  }, [])

  useEffect(() => {
    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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

    if (gridRef.current) {
      gridObserver.observe(gridRef.current)
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current)
    }

    return () => {
      if (gridRef.current) {
        gridObserver.unobserve(gridRef.current)
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}>
            {lang === 'es' ? 'Nuestra Colección' : 'Our Collection'}
          </span>
          <h2 className={`font-serif leading-tight text-foreground mb-4 text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}>
            {lang === 'es' ? 'Bocaditos irresistibles' : 'Irresistible bites'}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-md mx-auto ${headerVisible ? 'animate-fade-up opacity-0' : 'opacity-0'}`} style={headerVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}>
            {lang === 'es' ? 'Productos elaborados con cariño para cada ocasión especial' : 'Products crafted with care for every special occasion'}
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-background rounded-full p-1 gap-1 relative">
            {/* Animated background slide */}
            <div
              className="absolute top-1 bottom-1 bg-foreground rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{
                left: selectedCategory === 'bocaditos' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 4px)'
              }}
            />
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryChange(category.value)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div 
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <Link
              key={`${selectedCategory}-${product.id}`}
              href={`/product/${product.id}`}
              className={`group transition-all duration-500 ease-out ${
                isVisible && !isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: isTransitioning ? '0ms' : `${index * 80}ms` }}
            >
              <div className="bg-background rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
                {/* Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover boty-transition group-hover:scale-105"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-white text-black ${
                        product.badge === "Sale"
                          ? "bg-destructive/10 text-destructive"
                          : product.badge === "New"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                  {/* Quick add button */}
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addItem({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image
                      })
                    }}
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-serif text-lg text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">$ {product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        S/{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5"
          >
            {lang === 'es' ? 'Ver Todos los Productos' : 'View All Products'}
          </Link>
        </div>
      </div>
    </section>
  )
}
