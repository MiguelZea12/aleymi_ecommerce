import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb, hasFirebaseAdmin } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  if (!hasFirebaseAdmin()) {
    return NextResponse.json({ error: "Admin no configurado" }, { status: 503 })
  }

  try {
    const { orderId, voucherUrl } = await req.json()

    if (!orderId || !voucherUrl) {
      return NextResponse.json({ error: "Faltan datos." }, { status: 400 })
    }

    const db = getAdminDb()
    await db.doc(`orders/${orderId}`).update({
      voucherUrl,
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("update-order-voucher error:", e)
    return NextResponse.json({ error: "No se pudo guardar el comprobante." }, { status: 500 })
  }
}
