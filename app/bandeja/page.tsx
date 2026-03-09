"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, Check, MessageSquarePlus, ShoppingBag, Loader2 } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useLang } from "@/components/boty/language-context"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/lib/types"

interface SelectedItem {
  product: Product
  quantity: number
}

const t = {
  es: {
    back: "Volver a la Tienda",
    title: "Arma tu Bandeja",
    subtitle: "Selecciona los bocaditos que quieres incluir y personaliza las cantidades",
    available: "Bocaditos Disponibles",
    selected: "Tu Selección",
    emptySelection: "Aún no has seleccionado bocaditos",
    emptySelectionHint: "Toca los bocaditos de arriba para agregarlos",
    suggestion: "¿Sugerir un bocadito nuevo?",
    suggestionPlaceholder: "Describe el bocadito que te gustaría ver en el menú...",
    minUnits: "Mínimo 50 unidades en total",
    totalUnits: "unidades",
    pricePerUnit: "Precio por unidad:",
    totalPrice: "Total estimado:",
    addToCart: "Agregar Bandeja al Carrito",
    minError: "Necesitas al menos 50 unidades en total",
  },
  en: {
    back: "Back to Shop",
    title: "Build Your Tray",
    subtitle: "Select the bites you want to include and customize quantities",
    available: "Available Bites",
    selected: "Your Selection",
    emptySelection: "You haven't selected any bites yet",
    emptySelectionHint: "Tap the bites above to add them",
    suggestion: "Suggest a new bite?",
    suggestionPlaceholder: "Describe the bite you'd like to see on the menu...",
    minUnits: "Minimum 50 units total",
    totalUnits: "units",
    pricePerUnit: "Price per unit:",
    totalPrice: "Estimated total:",
    addToCart: "Add Tray to Cart",
    minError: "You need at least 50 total units",
  },
}

const PRICE_PER_UNIT = 2.75
const MIN_UNITS = 50

export default function BandejaPage() {
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { lang } = useLang()
  const tx = t[lang]

  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map())
  const [suggestion, setSuggestion] = useState("")
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [showMinError, setShowMinError] = useState(false)

  const bocaditos = products.filter((p) => p.category === "bocaditos")

  const totalUnits = useMemo(() => {
    let sum = 0
    selectedItems.forEach((item) => { sum += item.quantity })
    return sum
  }, [selectedItems])

  const totalPrice = totalUnits * PRICE_PER_UNIT

  const toggleItem = (product: Product) => {
    setSelectedItems((prev) => {
      const next = new Map(prev)
      if (next.has(product.id)) {
        next.delete(product.id)
      } else {
        next.set(product.id, { product, quantity: 10 })
      }
      return next
    })
    setShowMinError(false)
  }

  const updateItemQuantity = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev)
      const item = next.get(productId)
      if (!item) return prev
      const newQty = Math.max(1, item.quantity + delta)
      next.set(productId, { ...item, quantity: newQty })
      return next
    })
    setShowMinError(false)
  }

  const handleAddToCart = () => {
    if (totalUnits < MIN_UNITS) {
      setShowMinError(true)
      return
    }

    const itemNames = Array.from(selectedItems.values())
      .map((s) => `${s.product.name} x${s.quantity}`)
      .join(", ")

    const description = `${totalUnits} unids. personalizada: ${itemNames}${suggestion ? ` | Sugerencia: ${suggestion}` : ""}`

    addItem({
      id: `bandeja-custom-${Date.now()}`,
      name: "Bandeja Personalizada",
      description,
      price: totalPrice,
      image: "/images/products/bandejaClasica.png",
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            {tx.back}
          </Link>

          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">{tx.title}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">{tx.subtitle}</p>
          </div>

          {/* Bocaditos disponibles */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-foreground mb-6">{tx.available}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bocaditos.map((product) => {
                const isSelected = selectedItems.has(product.id)
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleItem(product)}
                    className={`relative text-left rounded-2xl overflow-hidden boty-transition boty-shadow ${
                      isSelected
                        ? "ring-2 ring-primary bg-primary/5"
                        : "bg-card hover:scale-[1.02]"
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base text-foreground">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Selección del usuario */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-foreground mb-6">{tx.selected}</h2>

            {selectedItems.size === 0 ? (
              <div className="bg-card rounded-2xl p-10 text-center boty-shadow">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">{tx.emptySelection}</p>
                <p className="text-sm text-muted-foreground/60 mt-1">{tx.emptySelectionHint}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from(selectedItems.values()).map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 bg-card rounded-xl p-4 boty-shadow"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{quantity} {tx.totalUnits}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); updateItemQuantity(product.id, -5) }}
                          className="p-1.5 hover:bg-muted boty-transition rounded-l-full"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{quantity}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); updateItemQuantity(product.id, 5) }}
                          className="p-1.5 hover:bg-muted boty-transition rounded-r-full"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleItem(product)}
                        className="text-xs text-destructive hover:underline ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sugerencia de bocadito nuevo */}
          <section className="mb-10">
            <button
              type="button"
              onClick={() => setShowSuggestion(!showSuggestion)}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 boty-transition font-medium"
            >
              <MessageSquarePlus className="w-4 h-4" />
              {tx.suggestion}
            </button>
            {showSuggestion && (
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={tx.suggestionPlaceholder}
                rows={3}
                className="mt-3 w-full max-w-lg px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 boty-transition resize-none"
              />
            )}
          </section>

          {/* Resumen y botón */}
          <div className="bg-card rounded-2xl p-6 boty-shadow max-w-md">
            <div className="space-y-2 text-sm mb-6">
              <p className="text-muted-foreground">{tx.minUnits}</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tx.totalUnits}:</span>
                <span className={`font-medium ${totalUnits < MIN_UNITS ? "text-destructive" : "text-foreground"}`}>{totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tx.pricePerUnit}</span>
                <span className="font-medium text-foreground">S/{PRICE_PER_UNIT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-foreground pt-2 border-t border-border/50">
                <span>{tx.totalPrice}</span>
                <span>S/{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {showMinError && (
              <p className="text-sm text-destructive mb-3">{tx.minError}</p>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedItems.size === 0}
              className={`w-full py-4 rounded-full font-medium boty-transition flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {lang === "es" ? "¡Añadida!" : "Added!"}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  {tx.addToCart}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
