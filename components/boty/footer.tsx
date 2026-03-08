"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { useLang } from "./language-context"

const footerLinks = {
  es: {
    tienda: {
      title: "Tienda",
      links: [
        { name: "Todos los Productos", href: "/shop" },
        { name: "Bocaditos Salados", href: "/shop?category=salados" },
        { name: "Bocaditos Dulces", href: "/shop?category=dulces" },
        { name: "Tablas", href: "/shop?category=tablas" },
        { name: "Packs Especiales", href: "/shop" },
      ],
    },
    nosotros: {
      title: "Nosotros",
      links: [
        { name: "Nuestra Historia", href: "/" },
        { name: "Ingredientes", href: "/" },
        { name: "Catering", href: "/" },
        { name: "Blog", href: "/" },
      ],
    },
    soporte: {
      title: "Soporte",
      links: [
        { name: "Contáctanos", href: "/" },
        { name: "Preguntas Frecuentes", href: "/" },
        { name: "Envíos", href: "/" },
        { name: "Devoluciones", href: "/" },
      ],
    },
    tagline: "Bocaditos artesanales preparados con los mejores ingredientes para tus momentos especiales.",
    rights: "Todos los derechos reservados.",
    privacy: "Política de Privacidad",
    terms: "Términos de Servicio",
  },
  en: {
    tienda: {
      title: "Shop",
      links: [
        { name: "All Products", href: "/shop" },
        { name: "Savory Bites", href: "/shop?category=salados" },
        { name: "Sweet Bites", href: "/shop?category=dulces" },
        { name: "Boards", href: "/shop?category=tablas" },
        { name: "Special Packs", href: "/shop" },
      ],
    },
    nosotros: {
      title: "About",
      links: [
        { name: "Our Story", href: "/" },
        { name: "Ingredients", href: "/" },
        { name: "Catering", href: "/" },
        { name: "Blog", href: "/" },
      ],
    },
    soporte: {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/" },
        { name: "FAQ", href: "/" },
        { name: "Shipping", href: "/" },
        { name: "Returns", href: "/" },
      ],
    },
    tagline: "Artisan bites made with the finest ingredients for your special moments.",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
}

export function Footer() {
  const { lang } = useLang()
  const fl = footerLinks[lang]
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[200px] sm:text-[200px] md:text-[400px] lg:text-[400px] xl:text-[400px] font-bold text-white/20 whitespace-nowrap leading-none">
          Aleymi
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-3xl text-foreground mb-4">Aleymi</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {fl.tagline}
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/Kerroudjm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">{fl.tienda.title}</h3>
            <ul className="space-y-3">
              {fl.tienda.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">{fl.nosotros.title}</h3>
            <ul className="space-y-3">
              {fl.nosotros.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-medium text-foreground mb-4">{fl.soporte.title}</h3>
            <ul className="space-y-3">
              {fl.soporte.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aleymi. {fl.rights}
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                {fl.privacy}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                {fl.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
