"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft, ChevronRight, Banknote, Building2, Loader2, CheckCircle2,
  Minus, Plus, Trash2, Copy, Check, Upload, X, FileImage, MapPin, CreditCard,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { useLang } from "@/components/boty/language-context"
import { useAuth } from "@/components/boty/auth-context"
import { AuthPanel } from "@/components/boty/auth-forms"
import { createOrder, updateOrderVoucher } from "@/lib/firestore"
import { uploadVoucher } from "@/lib/upload-voucher"
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
    stepDelivery: "Entrega",
    stepPayment: "Pago",
    stepConfirm: "Confirmar",
    stepOf: "Paso",
    next: "Continuar",
    stepBack: "Atrás",
    transferTitle: "Realiza tu transferencia",
    transferSubtitle: "Transfiere el monto exacto y sube el comprobante",
    transferStep1: "Copia el número de cuenta",
    transferStep2: "Transfiere desde tu banco",
    transferStep3: "Sube el comprobante aquí",
    reviewTitle: "Revisa tu pedido",
    reviewPayment: "Método de pago",
    reviewDelivery: "Entrega",
    cashNote: "Pagarás en efectivo al momento de la entrega.",
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
    stepDelivery: "Delivery",
    stepPayment: "Payment",
    stepConfirm: "Confirm",
    stepOf: "Step",
    next: "Continue",
    stepBack: "Back",
    transferTitle: "Make your transfer",
    transferSubtitle: "Transfer the exact amount and upload the receipt",
    transferStep1: "Copy the account number",
    transferStep2: "Transfer from your bank",
    transferStep3: "Upload the receipt here",
    reviewTitle: "Review your order",
    reviewPayment: "Payment method",
    reviewDelivery: "Delivery",
    cashNote: "You will pay in cash upon delivery.",
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
  const [submitError, setSubmitError] = useState("")
  // Comprobante
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const BANK = {
    bank: "Banco Pichincha",
    holder: "Aleymi",
    type: "Cuenta de Ahorros",
    number: "2210631764",     // ← pon el número real de cuenta de tu mamá
    cci: "", // ← pon el CCI real
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK.number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVoucherFile(file)
    setVoucherPreview(URL.createObjectURL(file))
    const newErrors = { ...errors }
    delete newErrors.voucher
    setErrors(newErrors)
  }

  const [step, setStep] = useState<1 | 2 | 3>(1)

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n })

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!address.trim()) e.address = tx.required
    if (!city.trim()) e.city = tx.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    if (paymentMethod === "transferencia" && !voucherFile) {
      setErrors({ voucher: "Debes subir el comprobante de transferencia." })
      return false
    }
    setErrors({})
    return true
  }

  const goNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const goBack = () => {
    setErrors({})
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
  }

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) return
    setSubmitting(true)
    setSubmitError("")
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

      // 1. Crear pedido primero (no bloquear por la subida del comprobante)
      const { id, orderNumber } = await createOrder({
        items: orderItems, subtotal, shipping, total,
        paymentMethod, customer, userId,
      })

      // 2. Subir comprobante a Cloudinary
      if (voucherFile) {
        try {
          const voucherUrl = await uploadVoucher(voucherFile, id)
          await updateOrderVoucher(id, voucherUrl)
        } catch (uploadErr) {
          console.error("Error subiendo comprobante:", uploadErr)
          setSubmitError(
            `Tu pedido ${orderNumber} fue registrado, pero no se pudo subir el comprobante. Escríbenos por WhatsApp.`
          )
          clearCart()
          onOrderSuccess(orderNumber)
          return
        }
      }

      clearCart()
      onOrderSuccess(orderNumber)
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : ""
      setSubmitError(
        msg.includes("permission") || msg.includes("Permission")
          ? "Error de permisos en Firebase. Publica las reglas de Firestore actualizadas e intenta de nuevo."
          : "No se pudo registrar el pedido. Verifica tu conexión e intenta de nuevo."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { n: 1, label: tx.stepDelivery, icon: MapPin },
    { n: 2, label: tx.stepPayment, icon: CreditCard },
    { n: 3, label: tx.stepConfirm, icon: CheckCircle2 },
  ] as const

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 boty-shadow">
        <p className="text-xs text-muted-foreground mb-3">
          {tx.stepOf} {step} / 3
        </p>
        <div className="flex items-center gap-0">
          {steps.map((s, i) => {
            const done = step > s.n
            const active = step === s.n
            return (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center boty-transition ${
                    done ? "bg-primary text-primary-foreground"
                      : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-medium hidden sm:block ${active || done ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 sm:mb-0 ${done ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── PASO 1: Entrega ── */}
      {step === 1 && (
        <div className="bg-card rounded-2xl p-6 boty-shadow space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-foreground">{tx.orderTitle}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {tx.hola}, {profile?.name?.split(" ")[0]}
              </p>
            </div>
            <button type="button" onClick={logout} className="text-xs text-muted-foreground hover:text-foreground underline boty-transition shrink-0">
              {tx.notYou}
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-2 p-3 bg-background rounded-xl border border-border/50">
            <ReadField label={lang === "es" ? "Nombre" : "Name"} value={profile?.name ?? ""} />
            <ReadField label={lang === "es" ? "Teléfono" : "Phone"} value={profile?.phone ?? ""} />
            <ReadField label={lang === "es" ? "Correo" : "Email"} value={profile?.email ?? ""} />
          </div>

          <div className="space-y-4">
            <Field label={tx.address} value={address} onChange={(v) => { setAddress(v); clearErr("address") }} error={errors.address} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={tx.city} value={city} onChange={(v) => { setCity(v); clearErr("city") }} error={errors.city} />
              <Field label={tx.eventDate} value={eventDate} onChange={setEventDate} type="date" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{tx.notes}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={tx.notesPlaceholder} rows={2}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 boty-transition resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 2: Pago ── */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="font-serif text-xl text-foreground px-1">{tx.paymentTitle}</h2>

          {/* Selector de método — compacto en fila */}
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((pm) => (
              <button
                key={pm.value}
                type="button"
                onClick={() => { setPaymentMethod(pm.value); setErrors({}) }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border boty-transition ${
                  paymentMethod === pm.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  paymentMethod === pm.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <pm.icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm text-foreground text-center">{tx[pm.labelKey]}</p>
              </button>
            ))}
          </div>

          {/* Transferencia: flujo guiado */}
          {paymentMethod === "transferencia" && (
            <div className="bg-card rounded-2xl boty-shadow overflow-hidden">
              {/* Header con monto a transferir */}
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">{tx.transferTitle}</p>
                <p className="font-serif text-3xl font-bold">S/{total.toFixed(2)}</p>
                <p className="text-xs opacity-70 mt-1">{tx.transferSubtitle}</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Paso 1: cuenta bancaria */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-foreground">{tx.transferStep1}</p>
                    <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Banco</span>
                        <span className="font-medium">{BANK.bank}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Titular</span>
                        <span className="font-medium">{BANK.holder}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tipo</span>
                        <span className="font-medium">{BANK.type}</span>
                      </div>
                      {BANK.cci && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">CCI</span>
                          <span className="font-mono font-medium">{BANK.cci}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">N° de cuenta</p>
                          <p className="font-mono font-bold text-lg text-foreground tracking-wide">{BANK.number}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium boty-transition ${
                            copied ? "bg-green-100 text-green-700" : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paso 2: instrucción */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <p className="text-sm text-foreground pt-1">{tx.transferStep2}</p>
                </div>

                {/* Paso 3: comprobante */}
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-3">{tx.transferStep3}</p>
                    {voucherPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={voucherPreview} alt="Comprobante" className="w-full max-h-44 object-contain bg-muted" />
                        <button
                          type="button"
                          onClick={() => { setVoucherFile(null); setVoucherPreview(null) }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="px-4 py-2 flex items-center gap-2 bg-background border-t border-border">
                          <FileImage className="w-4 h-4 text-primary" />
                          <span className="text-xs truncate">{voucherFile?.name}</span>
                          <Check className="w-4 h-4 text-green-600 ml-auto shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-6 py-7 cursor-pointer boty-transition ${
                        errors.voucher ? "border-destructive bg-destructive/5" : "border-primary/30 hover:border-primary hover:bg-primary/5"
                      }`}>
                        <Upload className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium text-foreground">Toca para subir comprobante</span>
                        <span className="text-xs text-muted-foreground">JPG, PNG o PDF</span>
                        <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={handleVoucherChange} />
                      </label>
                    )}
                    {errors.voucher && <p className="text-xs text-destructive mt-2">{errors.voucher}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Efectivo: mensaje simple */}
          {paymentMethod === "efectivo" && (
            <div className="bg-card rounded-2xl p-6 boty-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{tx.efectivo}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{tx.cashNote}</p>
                <p className="text-lg font-bold text-primary mt-1">S/{total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PASO 3: Confirmar ── */}
      {step === 3 && (
        <div className="bg-card rounded-2xl p-6 boty-shadow space-y-5 animate-in fade-in duration-200">
          <h2 className="font-serif text-xl text-foreground">{tx.reviewTitle}</h2>

          <div className="space-y-3">
            <div className="p-4 bg-background rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{tx.reviewDelivery}</p>
              <p className="text-sm font-medium">{address}, {city}</p>
              {eventDate && <p className="text-xs text-muted-foreground mt-1">{tx.eventDate}: {eventDate}</p>}
              {notes && <p className="text-xs text-muted-foreground mt-1 italic">{notes}</p>}
            </div>

            <div className="p-4 bg-background rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{tx.reviewPayment}</p>
              <p className="text-sm font-medium">{tx[paymentMethod === "transferencia" ? "transferencia" : "efectivo"]}</p>
              {paymentMethod === "transferencia" && voucherFile && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Comprobante adjunto
                </p>
              )}
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/20">
              <span className="font-medium text-foreground">{tx.total}</span>
              <span className="font-serif text-2xl font-bold text-primary">S/{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
          {submitError}
        </p>
      )}

      {/* Navegación */}
      <div className={`pt-2 ${step > 1 ? "grid grid-cols-2 gap-3" : ""}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted boty-transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {tx.stepBack}
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className={`flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-8 rounded-full font-medium hover:bg-primary/90 boty-transition ${step > 1 ? "" : "w-full max-w-sm mx-auto"}`}
          >
            {tx.next}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-8 rounded-full font-medium hover:bg-primary/90 boty-transition disabled:opacity-50"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{tx.processing}</> : tx.placeOrder}
          </button>
        )}
      </div>
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
