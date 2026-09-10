import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb, hasFirebaseAdmin } from "@/lib/firebase-admin"
import { formatOrderNumber } from "@/lib/order-number"
import type { CustomerInfo, OrderItem, PaymentMethod } from "@/lib/types"

export async function POST(req: NextRequest) {
  if (!hasFirebaseAdmin()) {
    return NextResponse.json({ error: "Admin no configurado" }, { status: 503 })
  }

  try {
    const body = await req.json()
    const {
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      customer,
      userId,
    } = body as {
      items: OrderItem[]
      subtotal: number
      shipping: number
      total: number
      paymentMethod: PaymentMethod
      customer: CustomerInfo
      userId?: string
    }

    if (!items?.length || !customer?.name || !customer?.email || total == null) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 })
    }

    const db = getAdminDb()
    const counterRef = db.doc("counters/orders")

    const { id, orderNumber } = await db.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef)
      const lastNumber = counterSnap.exists
        ? Number(counterSnap.data()?.lastNumber) || 0
        : 0
      const nextNumber = lastNumber + 1
      const orderNumber = formatOrderNumber(nextNumber)

      transaction.set(
        counterRef,
        { lastNumber: nextNumber, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      )

      const orderRef = db.collection("orders").doc()
      transaction.set(orderRef, {
        items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        customer,
        userId: userId ?? null,
        orderNumber,
        status: "pendiente",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })

      return { id: orderRef.id, orderNumber }
    })

    return NextResponse.json({ id, orderNumber })
  } catch (e) {
    console.error("create-order error:", e)
    return NextResponse.json({ error: "No se pudo crear el pedido." }, { status: 500 })
  }
}
