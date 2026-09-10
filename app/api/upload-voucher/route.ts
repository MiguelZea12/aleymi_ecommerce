import { NextRequest, NextResponse } from "next/server"

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "dck3chn5v"
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "aleymi_comprobante"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const orderId = formData.get("orderId") as string | null

    if (!file || !orderId) {
      return NextResponse.json({ error: "Faltan archivo u orderId." }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo supera 5 MB." }, { status: 400 })
    }

    // Subida directa con upload preset (debe estar en modo "Unsigned" en Cloudinary)
    const cloudinaryForm = new FormData()
    cloudinaryForm.append("file", file)
    cloudinaryForm.append("upload_preset", UPLOAD_PRESET)
    cloudinaryForm.append("folder", `aleymi/vouchers/${orderId}`)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      { method: "POST", body: cloudinaryForm }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("Cloudinary error:", data)
      const msg =
        data.error?.message?.includes("Invalid signature") ||
        data.error?.message?.includes("Upload preset")
          ? 'El preset debe estar en modo "Unsigned" en Cloudinary → Upload → Upload Presets → aleymi_comprobante'
          : data.error?.message ?? "Error de Cloudinary"
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    return NextResponse.json({ url: data.secure_url as string })
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "No se pudo subir el comprobante." }, { status: 500 })
  }
}
