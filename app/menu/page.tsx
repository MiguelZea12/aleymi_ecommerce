"use client"

import Link from "next/link"
import { Phone, Clock, Star } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Logo } from "@/components/boty/logo"
import { Footer } from "@/components/boty/footer"
import { useLang } from "@/components/boty/language-context"

type MenuItem = {
  name: string
  nameEn: string
  qty: string
  price: string
}

const menuItems: MenuItem[] = [
  { name: "Bolas de carne", nameEn: "Meatballs", qty: "50", price: "15.00" },
  { name: "Dedos de queso o mortadela", nameEn: "Cheese or mortadella fingers", qty: "50", price: "15.00" },
  { name: "Mini empanadillas (queso, pollo, carne, piña)", nameEn: "Mini empanadas (cheese, chicken, beef, pineapple)", qty: "50", price: "15.00" },
  { name: "Mini sanduchitos (queso cheddar, lechuga, jamón)", nameEn: "Mini sandwiches (cheddar cheese, lettuce, ham)", qty: "50", price: "16.00" },
  { name: "Mini hamburguesas", nameEn: "Mini burgers", qty: "50", price: "17.50" },
  { name: "Mini Hot dog", nameEn: "Mini hot dogs", qty: "50", price: "17.50" },
  { name: "Mini salchichas en salsa BBQ", nameEn: "Mini sausages in BBQ sauce", qty: "50", price: "10.50" },
  { name: "Tartaletas (pollo o camarón)", nameEn: "Tartlets (chicken or shrimp)", qty: "50", price: "18.50" },
]

const bandejas: MenuItem[] = [
  { name: "Bandejas completas surtidas de 100 piqueos", nameEn: "Full assorted trays of 100 bites", qty: "", price: "29.00" },
  { name: "Bandejas personalizadas con piqueos a elección desde", nameEn: "Custom trays with bites of your choice from", qty: "", price: "2.75" },
]

export default function MenuPage() {
  const { lang } = useLang()

  const isEs = lang === "es"

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      <Header />

      <div className="pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">

          {/* ── HEADER CARD ── */}
          <div
            className="relative rounded-3xl overflow-hidden mb-10 p-10 md:p-14 text-center"
            style={{ background: "linear-gradient(135deg, #E8F6F4 0%, #FDEDF0 100%)" }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #7DC9BF, transparent)" }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #F0B4B8, transparent)" }}
            />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-[0.25em] uppercase mb-6 font-medium"
                style={{ background: "rgba(125,201,191,0.2)", color: "#4A9E98" }}
              >
                <Star className="w-3 h-3 fill-current" />
                {isEs ? "Taller y Delicias" : "Workshop & Delights"}
              </div>

              <div className="flex justify-center mb-4">
                <Logo height={130} href={null} />
              </div>
              <div
                className="text-2xl md:text-3xl font-serif italic mb-6"
                style={{ color: "#7DC9BF" }}
              >
                {isEs ? "Menú" : "Menu"}
              </div>

              <p
                className="text-sm leading-relaxed max-w-sm mx-auto"
                style={{ color: "#6B5344" }}
              >
                {isEs
                  ? "Clientes como usted hacen que mi trabajo sea especial. ¡Muchas gracias por su confianza en nosotros!"
                  : "Customers like you make my work special. Thank you so much for your trust in us!"}
              </p>
            </div>
          </div>

          {/* ── MENU ITEMS ── */}
          <div
            className="rounded-3xl overflow-hidden mb-6"
            style={{ background: "white", boxShadow: "0 2px 24px rgba(60,40,20,0.07)" }}
          >
            {/* Section title */}
            <div
              className="px-8 py-5 border-b"
              style={{ borderColor: "#F0E8E2", background: "#FDFAF8" }}
            >
              <h2
                className="font-serif text-xl tracking-wide"
                style={{ color: "#3D2B1F" }}
              >
                {isEs ? "Bocaditos" : "Bites"}
              </h2>
            </div>

            {/* Items */}
            <div className="divide-y" style={{ borderColor: "#F0E8E2" }}>
              {menuItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-8 py-5 group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Quantity badge */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{ background: "linear-gradient(135deg, #E8F6F4, #FDEDF0)", color: "#4A9E98" }}
                    >
                      {item.qty}
                    </div>
                    <span
                      className="text-sm md:text-base leading-snug"
                      style={{ color: "#3D2B1F" }}
                    >
                      {isEs ? item.name : item.nameEn}
                    </span>
                  </div>

                  {/* Dotted line */}
                  <div
                    className="hidden md:flex flex-1 border-b border-dashed mx-4"
                    style={{ borderColor: "#D8C8C0", minWidth: 32 }}
                  />

                  <span
                    className="flex-shrink-0 font-semibold text-base tabular-nums"
                    style={{ color: "#4A9E98" }}
                  >
                    $ {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── BANDEJAS ── */}
          <div
            className="rounded-3xl overflow-hidden mb-8"
            style={{ background: "linear-gradient(135deg, #E8F6F4 0%, #FDEDF0 100%)", boxShadow: "0 2px 24px rgba(60,40,20,0.07)" }}
          >
            <div className="px-8 py-5 border-b" style={{ borderColor: "rgba(125,201,191,0.3)" }}>
              <h2
                className="font-serif text-xl tracking-wide"
                style={{ color: "#3D2B1F" }}
              >
                {isEs ? "Bandejas" : "Trays"}
              </h2>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(125,201,191,0.2)" }}>
              {bandejas.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-8 py-5"
                >
                  <span
                    className="text-sm md:text-base leading-snug flex-1"
                    style={{ color: "#3D2B1F" }}
                  >
                    {isEs ? item.name : item.nameEn}
                  </span>
                  <div
                    className="hidden md:flex flex-1 border-b border-dashed mx-4"
                    style={{ borderColor: "#C0D8D4", minWidth: 32 }}
                  />
                  <span
                    className="flex-shrink-0 font-semibold text-base tabular-nums"
                    style={{ color: "#4A9E98" }}
                  >
                    $ {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── NOTA ── */}
          <div
            className="rounded-2xl px-8 py-6 mb-8"
            style={{ background: "#FFF8F2", border: "1px solid #F0D8CC" }}
          >
            <h3
              className="font-medium text-sm mb-3 underline underline-offset-2"
              style={{ color: "#3D2B1F" }}
            >
              {isEs ? "Nota:" : "Note:"}
            </h3>
            <ul className="space-y-2">
              <li
                className="text-sm leading-relaxed italic flex items-start gap-2"
                style={{ color: "#6B5344" }}
              >
                <span className="mt-1" style={{ color: "#F0B4B8" }}>•</span>
                {isEs
                  ? "Todos nuestros bocaditos incluyen salsas para degustar."
                  : "All our bites include dipping sauces."}
              </li>
              <li
                className="text-sm leading-relaxed italic flex items-start gap-2"
                style={{ color: "#6B5344" }}
              >
                <span className="mt-1" style={{ color: "#F0B4B8" }}>•</span>
                {isEs
                  ? "Los pedidos se receptan con dos días de anticipación con previo abono."
                  : "Orders must be placed two days in advance with a deposit."}
              </li>
            </ul>
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide boty-transition font-medium text-white"
              style={{ background: "#7DC9BF" }}
            >
              {isEs ? "Hacer un Pedido" : "Place an Order"}
            </Link>
            <a
              href="tel:+593"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide boty-transition font-medium"
              style={{ background: "#FFF0F2", color: "#C47880", border: "1px solid #F0B4B8" }}
            >
              <Phone className="w-4 h-4" />
              {isEs ? "Contactar" : "Contact Us"}
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
