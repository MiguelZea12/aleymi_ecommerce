import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Textos por estado
const STATUS_COPY: Record<string, { subject: string; heading: string; body: string; emoji: string }> = {
  confirmado: {
    emoji: "✅",
    subject: "Tu pedido fue confirmado — Aleymi",
    heading: "¡Tu pedido está confirmado!",
    body: "Hemos recibido y confirmado tu pedido. Ya estamos preparando todo para que llegue en perfectas condiciones.",
  },
  en_preparacion: {
    emoji: "👩‍🍳",
    subject: "Tu pedido está en preparación — Aleymi",
    heading: "¡Tu pedido está en preparación!",
    body: "Nuestro equipo está preparando con cariño tu pedido. Te avisaremos cuando esté listo para la entrega.",
  },
  listo: {
    emoji: "📦",
    subject: "Tu pedido está listo — Aleymi",
    heading: "¡Tu pedido está listo!",
    body: "Tu pedido ya está listo y pronto será entregado. Prepárate para recibirlo.",
  },
  entregado: {
    emoji: "🎉",
    subject: "Pedido entregado — Aleymi",
    heading: "¡Pedido entregado!",
    body: "Tu pedido ha sido entregado. ¡Esperamos que lo disfrutes mucho! Gracias por confiar en Aleymi.",
  },
  cancelado: {
    emoji: "❌",
    subject: "Tu pedido fue cancelado — Aleymi",
    heading: "Tu pedido fue cancelado",
    body: "Lamentamos informarte que tu pedido ha sido cancelado. Si tienes dudas, contáctanos por WhatsApp.",
  },
}

function buildEmailHtml(params: {
  customerName: string
  orderId: string
  status: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}) {
  const copy = STATUS_COPY[params.status]
  if (!copy) return null

  const itemsRows = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;color:#44403C;font-size:14px;">${item.name} ×${item.quantity}</td>
          <td style="padding:8px 0;color:#44403C;font-size:14px;text-align:right;">S/${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F5F4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F4;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#9B6B4A;padding:32px 40px;text-align:center;">
            <img src="https://www.aleymi.app/logo.png" alt="Aleymi" width="180" style="display:block;margin:0 auto 12px;border-radius:8px;" />
            <p style="margin:0;font-size:36px;">${copy.emoji}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 12px;color:#1C1917;font-size:24px;">${copy.heading}</h1>
            <p style="margin:0 0 24px;color:#78716C;font-size:15px;line-height:1.6;">
              Hola <strong>${params.customerName.split(" ")[0]}</strong>, ${copy.body}
            </p>

            <!-- Pedido ID -->
            <p style="margin:0 0 4px;color:#A8A29E;font-size:12px;font-family:sans-serif;">N° DE PEDIDO</p>
            <p style="margin:0 0 24px;color:#9B6B4A;font-family:monospace;font-size:13px;">${params.orderId}</p>

            <!-- Productos -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border-top:1px solid #F5F5F4;border-bottom:1px solid #F5F5F4;margin-bottom:16px;">
              ${itemsRows}
              <tr>
                <td style="padding:12px 0 8px;font-weight:700;color:#1C1917;font-size:15px;">Total</td>
                <td style="padding:12px 0 8px;font-weight:700;color:#9B6B4A;font-size:17px;text-align:right;">S/${params.total.toFixed(2)}</td>
              </tr>
            </table>

            <p style="margin:24px 0 0;color:#A8A29E;font-size:13px;font-family:sans-serif;">
              ¿Tienes alguna pregunta? Escríbenos por WhatsApp y te ayudamos con gusto.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAFAF8;padding:24px 40px;text-align:center;border-top:1px solid #F0EFED;">
            <p style="margin:0;color:#A8A29E;font-size:12px;font-family:sans-serif;">© ${new Date().getFullYear()} Aleymi · Con amor desde Lima</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerEmail, orderId, status, total, items } = body

    if (!customerEmail || !orderId || !status) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
    }

    const copy = STATUS_COPY[status]
    if (!copy) {
      // Estado sin email (ej: pendiente) — no se manda nada, respuesta OK
      return NextResponse.json({ skipped: true })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no configurado — email no enviado")
      return NextResponse.json({ skipped: true, reason: "no_api_key" })
    }

    const html = buildEmailHtml({ customerName, orderId, status, total, items })
    if (!html) return NextResponse.json({ skipped: true })

    const from =
      process.env.RESEND_FROM ?? "Aleymi <onboarding@resend.dev>"

    const { data, error } = await resend.emails.send({
      from,
      to: customerEmail,
      subject: copy.subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
