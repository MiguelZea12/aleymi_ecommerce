"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, SlidersHorizontal, X } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useLang } from "@/components/boty/language-context"

const t = {
  es: {
    eyebrow: "Nuestra Colección",
    title: "Todos los Productos",
    subtitle: "Bocaditos artesanales preparados con cariño",
    filters: "Filtros",
    categories: { todos: "Todos", bocaditos: "Bocaditos", bandejas: "Bandejas" },
    product: "producto",
    products: "productos",
  },
  en: {
    eyebrow: "Our Collection",
    title: "All Products",
    subtitle: "Artisan bites crafted with care",
    filters: "Filters",
    categories: { todos: "All", bocaditos: "Bites", bandejas: "Trays" },
    product: "product",
    products: "products",
  },
}

const products = [
  { id: "bolas-de-carne", name: "Bolas de Carne", description: "50 unids. albóndigas caseras en salsa especial", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: "Popular", category: "bocaditos" },
  { id: "dedos-de-queso", name: "Dedos de Queso", description: "50 unids. de queso o mortadela apanados", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" },
  { id: "mini-empanadillas", name: "Mini Empanadillas", description: "50 unids. sabores: queso, pollo, carne o piña", price: 15, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" },
  { id: "mini-sanduchitos", name: "Mini Sanduchitos", description: "50 unids. queso cheddar, lechuga y jamón", price: 16, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" },
  { id: "mini-hamburguesas", name: "Mini Hamburguesas", description: "50 unids. con aderezos especiales", price: 17.50, originalPrice: null, image: "/images/products/producto1.png", badge: "Nuevo", category: "bocaditos" },
  { id: "mini-hotdog", name: "Mini Hot Dog", description: "50 unids. en pan artesanal", price: 17.50, originalPrice: null, image: "/images/products/miniHotdogs.png", badge: null, category: "bocaditos" },
  { id: "mini-salchichas", name: "Mini Salchichas BBQ", description: "50 unids. en salsa BBQ especial", price: 10.50, originalPrice: null, image: "/images/products/producto1.png", badge: null, category: "bocaditos" },
  { id: "tartaletas", name: "Tartaletas", description: "50 unids. de pollo o camarón", price: 18.50, originalPrice: null, image: "/images/products/producto1.png", badge: "Popular", category: "bocaditos" },
  { id: "bandeja-completa", name: "Bandeja Completa", description: "100 piqueos surtidos seleccionados", price: 29, originalPrice: null, image: "/images/products/bandejaClasica.png", badge: "Nuevo", category: "bandejas" },
  { id: "bandeja-personalizada", name: "Bandeja Personalizada", description: "Piqueos a tu elección — desde $2.75 c/u", price: 2.75, originalPrice: null, image: "/images/products/bandejaClasica.png", badge: null, category: "bandejas" },
]

const categories = ["todos", "bocaditos", "bandejas"]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()
  const tx = t[lang]

  const filteredProducts = selectedCategory === "todos"
    ? products
    : products.filter(p => p.category === selectedCategory)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) {
      observer.observe(gridRef.current)
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current)
      }
    }
  }, [])

  // Reset animation when category changes
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              {tx.eyebrow}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              {tx.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {tx.subtitle}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-2 text-sm text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {tx.filters}
            </button>

            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm capitalize boty-transition bg-popover ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground/70 hover:text-foreground boty-shadow"
                  }`}
                >
                  {tx.categories[category as keyof typeof tx.categories]}
                </button>
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? tx.product : tx.products}
            </span>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl text-foreground">Filtros</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-foreground/70 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowFilters(false)
                      }}
                      className={`w-full px-6 py-4 rounded-2xl text-left capitalize boty-transition ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground boty-shadow"
                      }`}
                    >
                      {tx.categories[category as keyof typeof tx.categories]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div 
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function ProductCard({ 
  product, 
  index, 
  isVisible 
}: { 
  product: typeof products[0]
  index: number
  isVisible: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {/* Skeleton */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500 ${
              imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover boty-transition group-hover:scale-105 transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide ${
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
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
            onClick={(e) => {
              e.preventDefault()
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-serif text-xl text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-foreground">S/{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                S/{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
