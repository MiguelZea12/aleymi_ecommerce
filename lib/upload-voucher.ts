/** Sube comprobante a Cloudinary vía API route (servidor) */
export async function uploadVoucher(file: File, orderId: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("orderId", orderId)

  const res = await fetch("/api/upload-voucher", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? "Error al subir comprobante")
  return data.url as string
}
