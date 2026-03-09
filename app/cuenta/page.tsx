"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  UserCircle2, ClipboardList, LogOut, Loader2, Package,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
} from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useAuth } from "@/components/boty/auth-context"
import { AuthPanel } from "@/components/boty/auth-forms"
import { getOrdersByUser } from "@/lib/firestore"
import type { Order } from "@/lib/types"

const PAGE_SIZE = 5

const STATUS_LABELS: Record<string, { es: string; color: string }> = {
  pendiente:       { es: "Pendiente",          color: "bg-yellow-100 text-yellow-700" },
  confirmado:      { es: "Confirmado",          color: "bg-blue-100 text-blue-700" },
  en_preparacion:  { es: "En preparación",      color: "bg-purple-100 text-purple-700" },
  listo:           { es: "Listo para entrega",  color: "bg-teal-100 text-teal-700" },
  entregado:       { es: "Entregado",           color: "bg-green-100 text-green-700" },
  cancelado:       { es: "Cancelado",           color: "bg-red-100 text-red-700" },
}

const ORDER_STEPS: { key: string; label: string }[] = [
  { key: "pendiente",      label: "Pendiente" },
  { key: "confirmado",     label: "Confirmado" },
  { key: "en_preparacion", label: "Preparando" },
  { key: "listo",          label: "Listo" },
  { key: "entregado",      label: "Entregado" },
]

function CuentaContent() {
  const { user, profile, logout, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"perfil" | "pedidos">(
    searchParams.get("tab") === "pedidos" ? "pedidos" : "perfil"
  )
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "pedidos" && user) {
      setOrdersLoading(true)
      getOrdersByUser(user.uid)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab, user])

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

  // Sin sesión: mostrar formulario de acceso
  if (!user) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20">
          <div className="max-w-lg mx-auto px-6">
            <h1 className="font-serif text-4xl text-foreground mb-2 text-center">Mi Cuenta</h1>
            <p className="text-muted-foreground text-center mb-10">Accede para ver tu perfil y tus pedidos</p>
            <AuthPanel />
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          {/* Cabecera */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-serif text-4xl text-foreground">Mi Cuenta</h1>
              <p className="text-muted-foreground mt-1">{profile?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive boty-transition"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-full p-1 mb-8 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("perfil")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium boty-transition ${activeTab === "perfil" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <UserCircle2 className="w-4 h-4" />
              Mi Perfil
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pedidos")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium boty-transition ${activeTab === "pedidos" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ClipboardList className="w-4 h-4" />
              Mis Pedidos
            </button>
          </div>

          {activeTab === "perfil" && <PerfilTab profile={profile} onLogout={logout} />}
          {activeTab === "pedidos" && <PedidosTab orders={orders} loading={ordersLoading} />}
        </div>
      </div>
      <Footer />
    </main>
  )
}

// ─── Perfil ──────────────────────────────────────────────────────────────────

function PerfilTab({
  profile,
  onLogout,
}: {
  profile: import("@/components/boty/auth-context").UserProfile | null
  onLogout: () => void
}) {
  const fields = [
    { label: "Nombre completo",    value: profile?.name ?? "—" },
    { label: "Teléfono",           value: profile?.phone ?? "—" },
    { label: "Correo electrónico", value: profile?.email ?? "—" },
    { label: "Fecha de nacimiento",value: profile?.birthdate ?? "—" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-8 boty-shadow">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {profile?.name?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground">{profile?.name}</h2>
            <p className="text-sm text-muted-foreground">Cuenta activa</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
              <p className="text-sm font-medium text-foreground bg-background px-4 py-3 rounded-xl border border-border/50">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="sm:hidden flex items-center gap-2 text-sm text-destructive hover:opacity-80 boty-transition"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <p className="text-sm text-foreground/80">
          ¿Quieres cambiar tu contraseña o datos? Escríbenos por{" "}
          <a href="https://wa.me/" className="underline font-medium hover:text-primary boty-transition">
            WhatsApp
          </a>{" "}
          y te ayudamos.
        </p>
      </div>
    </div>
  )
}

// ─── Pedidos paginados + colapsables ─────────────────────────────────────────

function PedidosTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalPages = Math.ceil(orders.length / PAGE_SIZE)
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-2">Aún no tienes pedidos</h2>
        <p className="text-muted-foreground mb-8">Cuando realices tu primer pedido, aparecerá aquí.</p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 boty-transition"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paginated.map((order) => {
        const status = STATUS_LABELS[order.status] ?? { es: order.status, color: "bg-muted text-muted-foreground" }
        const date = order.createdAt instanceof Date
          ? order.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })
          : "—"
        const isOpen = expanded === order.id
        const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)

        return (
          <div key={order.id} className="bg-card rounded-2xl boty-shadow overflow-hidden">
            {/* Fila resumen — siempre visible */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : (order.id ?? null))}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/30 boty-transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                    #{order.id?.slice(0, 8)}…
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{date} · {itemCount} {itemCount === 1 ? "producto" : "productos"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-medium px-3 py-1 rounded-full hidden sm:inline ${status.color}`}>
                  {status.es}
                </span>
                <p className="font-medium text-foreground text-sm">S/{order.total.toFixed(2)}</p>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                }
              </div>
            </button>

            {/* Detalle expandible */}
            {isOpen && (
              <div className="px-5 pb-6 border-t border-border/40 pt-4 space-y-5">
                {/* Estado en móvil */}
                <div className="sm:hidden">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>
                    {status.es}
                  </span>
                </div>

                {/* Barra de progreso */}
                <OrderProgress status={order.status} />

                {/* Resumen de datos */}
                <div className="grid grid-cols-3 gap-3 text-sm pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                    <p className="font-medium text-foreground">{date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pago</p>
                    <p className="font-medium text-foreground capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="font-medium text-foreground">S/{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Productos */}
                <div className="bg-background rounded-xl p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Productos</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-foreground/80">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                      <span className="text-foreground font-medium">S/{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/40 pt-2 mt-2 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>S/{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Entrega */}
                {order.customer.address && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dirección de entrega</p>
                    <p className="text-sm text-foreground/80">{order.customer.address}, {order.customer.city}</p>
                    {order.customer.eventDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">Fecha del evento: {order.customer.eventDate}</p>
                    )}
                  </div>
                )}

                {/* ID completo */}
                <p className="text-xs text-muted-foreground font-mono">ID: {order.id}</p>
              </div>
            )}
          </div>
        )
      })}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm text-foreground/70 hover:text-foreground border border-border rounded-full disabled:opacity-40 boty-transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm text-foreground/70 hover:text-foreground border border-border rounded-full disabled:opacity-40 boty-transition"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Barra de seguimiento ─────────────────────────────────────────────────────

function OrderProgress({ status }: { status: string }) {
  if (status === "cancelado") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
        Pedido cancelado
      </div>
    )
  }

  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex items-center gap-1">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= currentIndex
        const active = i === currentIndex
        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-2.5 h-2.5 rounded-full boty-transition ${active ? "bg-primary ring-2 ring-primary/30" : done ? "bg-primary/70" : "bg-border"}`} />
              <p className={`text-[9px] text-center leading-tight ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </p>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`h-px flex-1 mb-4 ${i < currentIndex ? "bg-primary/50" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function CuentaPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    }>
      <CuentaContent />
    </Suspense>
  )
}
