"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft, Banknote, Building2, Loader2, CheckCircle2,
  Minus, Plus, Trash2,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useLang } from "@/components/boty/language-context"
import { useAuth } from "@/components/boty/auth-context"
import { AuthPanel } from "@/components/boty/auth-forms"
import { createOrder } from "@/lib/firestore"
import type { PaymentMethod, CustomerInfo, OrderItem } from "@/lib/types"

const t = {
  es: {
    back: "Volver a la Tienda",
    title: "Finalizar Pedido",
    cartTitle: "Tu Pedido",
    emptyCart: "Tu carrito está vacío",
    goShop: "Ir a la Tienda",
    // Auth
    authTitle: "Crea tu cuenta para continuar",
    authSubtitle: "Registra tus datos una sola vez y haz tus pedidos más rápido.",
    tabRegister: "Crear cuenta",
    tabLogin: "Iniciar sesión",
    regName: "Nombre completo",
    regPhone: "Teléfono",
    regEmail: "Correo electrónico",
    regBirthdate: "Fecha de nacimiento",
    regPassword: "Contraseña",
    regPasswordHint: "Mínimo 6 caracteres",
    registerBtn: "Crear cuenta",
    loginEmail: "Correo electrónico",
    loginPassword: "Contraseña",
    loginBtn: "Iniciar sesión",
    loggingIn: "Ingresando...",
    registering: "Creando cuenta...",
    // Pedido
    orderTitle: "Datos del Pedido",
    hola: "Hola",
    notYou: "¿No eres tú?",
    autoFilled: "Completado automáticamente desde tu cuenta",
    address: "Dirección de entrega",
    city: "Ciudad",
    eventDate: "Fecha del evento",
    notes: "Notas adicionales",
    notesPlaceholder: "Instrucciones especiales, alergias, etc.",
    paymentTitle: "Método de Pago",
    transferencia: "Transferencia Bancaria",
    transferenciaDesc: "Realiza una transferencia y envía el comprobante",
    efectivo: "Efectivo",
    efectivoDesc: "Paga al momento de la entrega",
    subtotal: "Subtotal",
    shipping: "Envío",
    free: "Gratis",
    total: "Total",
    placeOrder: "Confirmar Pedido",
    processing: "Procesando...",
    required: "Este campo es obligatorio",
    invalidEmail: "Email inválido",
    invalidPhone: "Teléfono inválido (mín. 7 dígitos)",
    successTitle: "¡Pedido Confirmado!",
    successMsg: "Tu pedido ha sido registrado. Te contactaremos pronto para confirmar los detalles.",
    orderId: "Número de pedido",
    continueShopping: "Seguir Comprando",
  },
  en: {
    back: "Back to Shop",
    title: "Checkout",
    cartTitle: "Your Order",
    emptyCart: "Your cart is empty",
    goShop: "Go to Shop",
    authTitle: "Create your account to continue",
    authSubtitle: "Register your details once and order faster.",
    tabRegister: "Create account",
    tabLogin: "Sign in",
    regName: "Full name",
    regPhone: "Phone",
    regEmail: "Email",
    regBirthdate: "Date of birth",
    regPassword: "Password",
    regPasswordHint: "Minimum 6 characters",
    registerBtn: "Create account",
    loginEmail: "Email",
    loginPassword: "Password",
    loginBtn: "Sign in",
    loggingIn: "Signing in...",
    registering: "Creating account...",
    orderTitle: "Order Details",
    hola: "Hello",
    notYou: "Not you?",
    autoFilled: "Auto-filled from your account",
    address: "Delivery address",
    city: "City",
    eventDate: "Event date",
    notes: "Additional notes",
    notesPlaceholder: "Special instructions, allergies, etc.",
    paymentTitle: "Payment Method",
    transferencia: "Bank Transfer",
    transferenciaDesc: "Make a transfer and send the receipt",
    efectivo: "Cash",
    efectivoDesc: "Pay on delivery",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    placeOrder: "Place Order",
    processing: "Processing...",
    required: "This field is required",
    invalidEmail: "Invalid email",
    invalidPhone: "Invalid phone (min. 7 digits)",
    successTitle: "Order Confirmed!",
    successMsg: "Your order has been registered. We'll contact you soon to confirm the details.",
    orderId: "Order number",
    continueShopping: "Continue Shopping",
  },
}

const paymentMethods: { value: "transferencia" | "efectivo"; icon: typeof Building2; labelKey: "transferencia" | "efectivo"; descKey: "transferenciaDesc" | "efectivoDesc" }[] = [
  { value: "transferencia", icon: Building2, labelKey: "transferencia", descKey: "transferenciaDesc" },
  { value: "efectivo", icon: Banknote, labelKey: "efectivo", descKey: "efectivoDesc" },
]

export default function CheckoutPage() {
  const { items, subtotal, clearCart, updateQuantity, removeItem } = useCart()
  const { lang } = useLang()
  const { user, profile, loading: authLoading } = useAuth()
  const tx = t[lang]

  const [orderId, setOrderId] = useState<string | null>(null)
  const shipping: number = 0
  const total = subtotal + shipping

  if (authLoading) {
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

  if (orderId) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20">
          <div className="max-w-lg mx-auto px-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{tx.successTitle}</h1>
            <p className="text-muted-foreground mb-6">{tx.successMsg}</p>
            <div className="bg-card rounded-2xl p-6 boty-shadow mb-8">
              <p className="text-sm text-muted-foreground mb-1">{tx.orderId}</p>
              <p className="font-mono text-lg font-medium text-foreground">{orderId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/cuenta" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-full font-medium hover:bg-muted boty-transition">
                {lang === "es" ? "Ver mis pedidos" : "View my orders"}
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 boty-transition">
                {tx.continueShopping}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!authLoading && items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20">
          <div className="max-w-lg mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-6">{tx.emptyCart}</h1>
            <Link href="/shop" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 boty-transition">
              {tx.goShop}
            </Link>
          </div>
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
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground boty-transition mb-8">
            <ChevronLeft className="w-4 h-4" />
            {tx.back}
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-10">{tx.title}</h1>

          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 order-first lg:order-last">
              <OrderSummary
                tx={tx}
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            </div>

            <div className="lg:col-span-3 space-y-10 order-last lg:order-first">
              {!user ? (
                <AuthPanel title={tx.authTitle} subtitle={tx.authSubtitle} />
              ) : (
                <OrderFormPanel
                  tx={tx}
                  lang={lang}
                  profile={profile}
                  items={items}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  clearCart={clearCart}
                  onOrderSuccess={setOrderId}
                  userId={user?.uid}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

// ─── Formulario del pedido (cuando está logueado) ────────────────────────────

function OrderFormPanel({
  tx, lang, profile, items, subtotal, shipping, total, clearCart, onOrderSuccess, userId,
}: {
  tx: typeof t["es"]
  lang: "es" | "en"
  profile: import("@/components/boty/auth-context").UserProfile | null
  items: import("@/components/boty/cart-context").CartItem[]
  subtotal: number
  shipping: number
  total: number
  clearCart: () => void
  onOrderSuccess: (id: string) => void
  userId?: string
}) {
  const { logout } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<"transferencia" | "efectivo">("transferencia")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!address.trim()) e.address = tx.required
    if (!city.trim()) e.city = tx.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const customer: CustomerInfo = {
        name: profile?.name ?? "",
        phone: profile?.phone ?? "",
        email: profile?.email ?? "",
        address, city, eventDate, notes,
      }
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image,
      }))
      const id = await createOrder({ items: orderItems, subtotal, shipping, total, paymentMethod, customer, userId })
      clearCart()
      onOrderSuccess(id)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Saludo con datos auto-completados */}
      <section className="bg-card rounded-2xl p-6 boty-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-foreground">
            {tx.hola}, {profile?.name?.split(" ")[0]}
          </h2>
          <button type="button" onClick={logout} className="text-xs text-muted-foreground hover:text-foreground underline boty-transition">
            {tx.notYou}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{tx.autoFilled}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <ReadField label={lang === "es" ? "Nombre" : "Name"} value={profile?.name ?? ""} />
          <ReadField label={lang === "es" ? "Teléfono" : "Phone"} value={profile?.phone ?? ""} />
          <ReadField label={lang === "es" ? "Correo" : "Email"} value={profile?.email ?? ""} />
        </div>
      </section>

      {/* Datos del pedido */}
      <section>
        <h2 className="font-serif text-2xl text-foreground mb-6">{tx.orderTitle}</h2>
        <div className="space-y-4">
          <Field label={tx.address} value={address} onChange={(v) => { setAddress(v); clearErr("address") }} error={errors.address} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx.city} value={city} onChange={(v) => { setCity(v); clearErr("city") }} error={errors.city} />
            <Field label={tx.eventDate} value={eventDate} onChange={setEventDate} type="date" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{tx.notes}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={tx.notesPlaceholder} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 boty-transition resize-none"
            />
          </div>
        </div>
      </section>

      {/* Método de pago */}
      <section>
        <h2 className="font-serif text-2xl text-foreground mb-6">{tx.paymentTitle}</h2>
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <button key={pm.value} type="button" onClick={() => setPaymentMethod(pm.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border boty-transition text-left ${
                paymentMethod === pm.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === pm.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <pm.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{tx[pm.labelKey]}</p>
                <p className="text-sm text-muted-foreground">{tx[pm.descKey]}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Botón confirmar */}
      <button type="button" onClick={handleSubmit} disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 boty-transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.processing}</> : tx.placeOrder}
      </button>
    </div>
  )
}

// ─── Resumen del pedido ──────────────────────────────────────────────────────

function OrderSummary({
  tx, items, subtotal, shipping, total, updateQuantity, removeItem,
}: {
  tx: typeof t["es"]
  items: import("@/components/boty/cart-context").CartItem[]
  subtotal: number
  shipping: number
  total: number
  updateQuantity: (id: string, qty: number) => void
  removeItem: (id: string) => void
}) {
  return (
    <div className="bg-card rounded-2xl p-6 boty-shadow sticky top-28">
      <h2 className="font-serif text-xl text-foreground mb-6">{tx.cartTitle}</h2>
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground mb-1.5 line-clamp-1">{item.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-full">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted boty-transition rounded-l-full"><Minus className="w-3 h-3" /></button>
                  <span className="px-2 text-xs font-medium">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted boty-transition rounded-r-full"><Plus className="w-3 h-3" /></button>
                </div>
                <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground whitespace-nowrap">S/{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground"><span>{tx.subtotal}</span><span>S/{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>{tx.shipping}</span><span>{shipping === 0 ? tx.free : `S/${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between text-lg font-medium text-foreground pt-2 border-t border-border/50"><span>{tx.total}</span><span>S/{total.toFixed(2)}</span></div>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, error, type = "text", placeholder, maxLength, hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  placeholder?: string
  maxLength?: number
  hint?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 boty-transition ${
          error ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30"
        }`}
      />
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <p className="text-sm font-medium text-foreground bg-background px-3 py-2.5 rounded-lg border border-border/50 truncate">{value || "—"}</p>
    </div>
  )
}
