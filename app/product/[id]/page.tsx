"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Minus, Plus, ChevronDown, ChefHat, Heart, Award, Clock, Star, Check } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useLang } from "@/components/boty/language-context"

const products: Record<string, {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  sizes: string[]
  details: string
  howToUse: string
  ingredients: string
  delivery: string
}> = {
  "bolas-de-carne": {
    id: "bolas-de-carne",
    name: "Bolas de Carne",
    tagline: "El bocadito más pedido de Aleymi",
    description: "50 albóndigas caseras bañadas en salsa especial, preparadas con carne fresca del día. Siempre incluyen salsas para degustar.",
    price: 15,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Nuestras bolas de carne se preparan con carne molida de primera calidad, condimentadas con especias naturales y bañadas en nuestra salsa especial de la casa.",
    howToUse: "Servir a temperatura ambiente. Ideales para reuniones y eventos. Consumir el mismo día del pedido para mayor frescura.",
    ingredients: "Carne molida de res, cebolla, ajo, huevo, pan rallado, especias naturales, sal.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "dedos-de-queso": {
    id: "dedos-de-queso",
    name: "Dedos de Queso",
    tagline: "Crujientes por fuera, irresistibles por dentro",
    description: "50 unidades de dedos de queso o mortadela apanados y dorados, con textura crujiente y sabor inigualable.",
    price: 15,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Elaborados con queso fresco o mortadela, apanados con pan rallado artesanal y preparados al momento. Incluyen salsas para degustar.",
    howToUse: "Servir recién listos para disfrutar su textura crujiente. Acompañar con las salsas incluidas.",
    ingredients: "Queso fresco o mortadela, pan rallado, huevo, sal, aceite vegetal.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "mini-empanadillas": {
    id: "mini-empanadillas",
    name: "Mini Empanadillas",
    tagline: "Cuatro sabores para elegir",
    description: "50 mini empanadillas con masa crujiente hecha a mano, rellenas a elección: queso, pollo, carne o piña.",
    price: 15,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Elaboradas con masa hojaldrada artesanal y rellenos frescos preparados el mismo día. Disponibles en cuatro sabores: queso, pollo, carne y piña. Incluyen salsas.",
    howToUse: "Servir a temperatura ambiente o calentar brevemente. Acompañar con las salsas incluidas.",
    ingredients: "Harina de trigo, mantequilla, rellenos a elección (queso/pollo/carne/piña), especias naturales.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "mini-sanduchitos": {
    id: "mini-sanduchitos",
    name: "Mini Sanduchitos",
    tagline: "El clásico perfecto para cualquier ocasión",
    description: "50 mini sándwiches con queso cheddar, lechuga fresca y jamón. Sencillos, deliciosos y siempre un éxito.",
    price: 16,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Preparados con pan tierno, queso cheddar, lechuga fresca y jamón de calidad. Cada uno armado con cuidado para una presentación impecable.",
    howToUse: "Servir frescos, idealmente el mismo día del pedido. Conservar en lugar fresco hasta el momento de servir.",
    ingredients: "Pan, queso cheddar, lechuga, jamón, mayonesa.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "mini-hamburguesas": {
    id: "mini-hamburguesas",
    name: "Mini Hamburguesas",
    tagline: "Con todos los aderezos especiales",
    description: "50 mini hamburguesas con pan esponjoso, carne jugosa y todos los aderezos especiales. El bocadito más completo del menú.",
    price: 17.50,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Armadas con pan artesanal, carne de res sazonada, lechuga, tomate y nuestros aderezos especiales. Uno de los favoritos de nuestros clientes.",
    howToUse: "Servir a temperatura ambiente o calentar brevemente antes de servir para mayor disfrute.",
    ingredients: "Pan de hamburguesa, carne de res, lechuga, tomate, aderezos especiales.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "mini-hotdog": {
    id: "mini-hotdog",
    name: "Mini Hot Dog",
    tagline: "El favorito de reuniones y fiestas",
    description: "50 mini hot dogs en pan artesanal, con salchicha jugosa y los aderezos clásicos que todos aman.",
    price: 17.50,
    originalPrice: null,
    image: "/images/products/miniHotdogs.png",
    sizes: ["50 unidades"],
    details: "Preparados con pan suave artesanal, salchicha de primera calidad y aderezos clásicos. Siempre un éxito en cualquier evento.",
    howToUse: "Servir tibios para disfrutar mejor su sabor. Ideales como aperitivo o bocadito central del evento.",
    ingredients: "Pan hot dog, salchicha, mostaza, ketchup, mayonesa.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "mini-salchichas": {
    id: "mini-salchichas",
    name: "Mini Salchichas BBQ",
    tagline: "En nuestra irresistible salsa especial",
    description: "50 mini salchichas bañadas en salsa BBQ especial de la casa. El bocadito más rendidor y sabroso del menú.",
    price: 10.50,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Preparadas con salchichas de calidad y nuestra salsa BBQ casera, con un balance perfecto entre dulce y ahumado.",
    howToUse: "Servir calientes para mejor sabor. Presentar con palillos para facilitar el servicio.",
    ingredients: "Mini salchichas, salsa BBQ casera (tomate, azúcar morena, vinagre, especias).",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "tartaletas": {
    id: "tartaletas",
    name: "Tartaletas",
    tagline: "El toque gourmet del menú Aleymi",
    description: "50 tartaletas de masa crujiente rellenas de pollo o camarón con queso crema. El bocadito más especial para ocasiones importantes.",
    price: 18.50,
    originalPrice: null,
    image: "/images/products/producto1.png",
    sizes: ["50 unidades"],
    details: "Elaboradas con masa quebrada artesanal y rellenas de pollo o camarón con queso crema, decoradas para una presentación impecable.",
    howToUse: "Servir a temperatura ambiente. Consumir el mismo día para mantener la textura crujiente de la masa.",
    ingredients: "Masa quebrada, pollo o camarón, queso crema, especias, perejil.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "bandeja-completa": {
    id: "bandeja-completa",
    name: "Bandeja Completa",
    tagline: "Para llenar tu evento de sabor",
    description: "Bandeja surtida con 100 piqueos seleccionados. La opción perfecta para llenar tu fiesta o evento de sabor y variedad.",
    price: 29,
    originalPrice: null,
    image: "/images/products/bandejaClasica.png",
    sizes: ["100 piqueos surtidos"],
    details: "Incluye una selección de 100 bocaditos variados del menú Aleymi, presentados en bandeja con salsas para degustar incluidas.",
    howToUse: "Servir a temperatura ambiente. Ideal para eventos de 15-20 personas. Incluye salsas.",
    ingredients: "Selección surtida de bocaditos del menú Aleymi.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  },
  "bandeja-personalizada": {
    id: "bandeja-personalizada",
    name: "Bandeja Personalizada",
    tagline: "Tu elección, nuestro sabor",
    description: "Arma tu propia bandeja con los bocaditos que más te gustan. Precio desde $2.75 por unidad — perfecto para personalizar tu evento.",
    price: 2.75,
    originalPrice: null,
    image: "/images/products/bandejaClasica.png",
    sizes: ["Mínimo 50 unidades"],
    details: "Puedes combinar libremente todos los bocaditos del menú. Mézclanos como quieras — precio por unidad desde $2.75.",
    howToUse: "Consultar disponibilidad y combinar con los bocaditos de tu preferencia. Servir a temperatura ambiente.",
    ingredients: "Selección a elección del menú Aleymi.",
    delivery: "Pedidos con 2 días de anticipación y previo abono. Consultar disponibilidad para su fecha."
  }
}

const benefits = {
  es: [
    { icon: ChefHat, label: "Receta Artesanal" },
    { icon: Heart, label: "Hecho con Amor" },
    { icon: Clock, label: "Listo para Servir" },
    { icon: Award, label: "Calidad Premium" },
  ],
  en: [
    { icon: ChefHat, label: "Artisan Recipe" },
    { icon: Heart, label: "Made with Love" },
    { icon: Clock, label: "Ready to Serve" },
    { icon: Award, label: "Premium Quality" },
  ],
}

type AccordionSection = "details" | "howToUse" | "ingredients" | "delivery"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = products[productId] || products["bolas-de-carne"]
  const { lang } = useLang()

  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("details")
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId])

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const accordionItems: { key: AccordionSection; title: string; content: string }[] = [
    { key: "details", title: lang === 'es' ? "Detalles" : "Details", content: product.details },
    { key: "howToUse", title: lang === 'es' ? "Cómo Servir" : "How to Serve", content: product.howToUse },
    { key: "ingredients", title: lang === 'es' ? "Ingredientes" : "Ingredients", content: product.ingredients },
    { key: "delivery", title: lang === 'es' ? "Cómo Pedir" : "How to Order", content: product.delivery },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            {lang === 'es' ? 'Volver a la Tienda' : 'Back to Shop'}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-card boty-shadow">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-8">
                <span className="text-sm tracking-[0.3em] uppercase text-primary mb-2 block">
                  Aleymi Bocaditos
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground italic mb-4">
                  {product.tagline}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({lang === 'es' ? '128 reseñas' : '128 reviews'})</span>
                </div>

                <p className="text-foreground/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-medium text-foreground">$ {product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    $ {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">{lang === 'es' ? 'Tamaño' : 'Size'}</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full text-sm boty-transition boty-shadow ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-card/80"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="text-sm font-medium text-foreground mb-3 block">{lang === 'es' ? 'Cantidad' : 'Quantity'}</label>
                <div className="inline-flex items-center gap-4 bg-card rounded-full px-2 py-2 boty-shadow">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide boty-transition boty-shadow ${
                    isAdded
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      {lang === 'es' ? 'Añadido al Carrito' : 'Added to Cart'}
                    </>
                  ) : (
                    lang === 'es' ? 'Añadir al Carrito' : 'Add to Cart'
                  )}
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-foreground/5"
                >
                  {lang === 'es' ? 'Comprar Ahora' : 'Buy Now'}
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {benefits[lang].map((benefit) => (
                  <div
                    key={benefit.label}
                    className="flex flex-col items-center gap-2 p-4 boty-shadow bg-transparent shadow-none rounded-md"
                  >
                    <benefit.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground text-center">{benefit.label}</span>
                  </div>
                ))}
              </div>

              {/* Accordion */}
              <div className="border-t border-border/50">
                {accordionItems.map((item) => (
                  <div key={item.key} className="border-b border-border/50">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.key)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="font-medium text-foreground">{item.title}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground boty-transition ${
                          openAccordion === item.key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden boty-transition ${
                        openAccordion === item.key ? "max-h-96 pb-5" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
