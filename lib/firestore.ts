import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/firebase"
import { formatOrderNumber } from "./order-number"
import type { Product, Order, OrderItem, CustomerInfo, PaymentMethod, OrderStatus } from "./types"

// ─── Productos ───

const productsRef = collection(db, "products")

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsRef, orderBy("name")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
}

export async function getProductsByCategory(category: "bocaditos" | "bandejas"): Promise<Product[]> {
  const snap = await getDocs(
    query(productsRef, where("category", "==", category), orderBy("name"))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Product
}

// ─── Seed de productos ───

export async function seedProducts(products: Omit<Product, "id"> & { id: string }[]) {
  for (const product of products) {
    const { id, ...data } = product
    await setDoc(doc(db, "products", id), data)
  }
}

// ─── Pedidos / Órdenes ───

const ordersRef = collection(db, "orders")

export async function createOrder(params: {
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  customer: CustomerInfo
  userId?: string
  voucherUrl?: string
}): Promise<{ id: string; orderNumber: string }> {
  const counterRef = doc(db, "counters", "orders")

  const result = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef)
    const lastNumber = counterSnap.exists()
      ? Number(counterSnap.data().lastNumber) || 0
      : 0
    const nextNumber = lastNumber + 1
    const orderNumber = formatOrderNumber(nextNumber)

    transaction.set(counterRef, { lastNumber: nextNumber, updatedAt: serverTimestamp() }, { merge: true })

    const newOrderRef = doc(collection(db, "orders"))
    transaction.set(newOrderRef, {
      ...params,
      orderNumber,
      status: "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: newOrderRef.id, orderNumber }
  })

  notifyAdminNewOrder({
    customerName: params.customer.name,
    total: params.total,
    orderId: result.id,
    orderNumber: result.orderNumber,
  }).catch(() => {})

  return result
}

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(query(ordersRef, orderBy("createdAt", "desc")))
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
    } as Order
  })
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const snap = await getDocs(query(ordersRef, where("userId", "==", userId)))
  return snap.docs
    .map((d) => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
      } as Order
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// ─── Cambiar estado de un pedido ─────────────────────────────────────────────
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  // 1. Actualizar Firestore
  const orderRef = doc(db, "orders", orderId)
  await updateDoc(orderRef, { status, updatedAt: serverTimestamp() })

  // 2. Leer el pedido para enviar el email al cliente
  try {
    const snap = await getDoc(orderRef)
    if (!snap.exists()) return
    const data = snap.data()
    const customerEmail: string = data.customer?.email
    if (!customerEmail) return

    // Llamada al API route de Next.js para enviar el email
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

    fetch(`${baseUrl}/api/send-order-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: data.customer?.name ?? "",
        customerEmail,
        orderId: data.orderNumber ?? orderId,
        status,
        total: data.total ?? 0,
        items: data.items ?? [],
      }),
    }).catch(() => {}) // no bloquea aunque falle
  } catch {
    // silent — el email es best-effort
  }
}

// ─── Adjuntar comprobante a un pedido ────────────────────────────────────────
export async function updateOrderVoucher(orderId: string, voucherUrl: string) {
  await updateDoc(doc(db, "orders", orderId), {
    voucherUrl,
    updatedAt: serverTimestamp(),
  })
}

// ─── Modificar pedido pendiente (datos + productos) ──────────────────────────
export async function updateOrderDetails(
  orderId: string,
  fields: {
    address?: string
    city?: string
    notes?: string
    eventDate?: string
    items?: OrderItem[]
    subtotal?: number
    total?: number
  }
) {
  const orderRef = doc(db, "orders", orderId)
  const snap = await getDoc(orderRef)
  if (!snap.exists()) throw new Error("Pedido no encontrado")

  const data = snap.data()
  const customer = { ...data.customer }
  if (fields.address !== undefined) customer.address = fields.address
  if (fields.city !== undefined) customer.city = fields.city
  if (fields.notes !== undefined) customer.notes = fields.notes
  if (fields.eventDate !== undefined) customer.eventDate = fields.eventDate

  const updates: Record<string, unknown> = {
    customer,
    updatedAt: serverTimestamp(),
  }
  if (fields.items !== undefined) updates.items = fields.items
  if (fields.subtotal !== undefined) updates.subtotal = fields.subtotal
  if (fields.total !== undefined) updates.total = fields.total

  await updateDoc(orderRef, updates)
}

// ─── Leer push token del admin (para enviar notif al crear pedido) ────────────
export async function getAdminPushToken(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, "admin_config", "push_token"))
    if (!snap.exists()) return null
    return snap.data().token ?? null
  } catch {
    return null
  }
}

// ─── Enviar push notification al admin via Expo Push API ─────────────────────
export async function notifyAdminNewOrder(params: {
  customerName: string
  total: number
  orderId: string
  orderNumber?: string
}) {
  const token = await getAdminPushToken()
  if (!token) return

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify({
        to: token,
        title: "🛒 Nuevo pedido",
        body: `${params.orderNumber ?? params.orderId} · ${params.customerName} · S/${params.total.toFixed(2)}`,
        data: { orderId: params.orderId },
        sound: "default",
        channelId: "pedidos",
      }),
    })
  } catch (e) {
    console.error("Error enviando push al admin:", e)
  }
}
