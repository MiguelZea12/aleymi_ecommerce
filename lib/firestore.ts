import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/firebase"
import type { Product, Order, OrderItem, CustomerInfo, PaymentMethod } from "./types"

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
}): Promise<string> {
  const docRef = await addDoc(ordersRef, {
    ...params,
    status: "pendiente",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
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
