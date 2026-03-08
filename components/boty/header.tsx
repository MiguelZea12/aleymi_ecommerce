"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search, User, Globe } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const { setIsOpen, itemCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 backdrop-blur-md rounded-lg py-0 my-0 animate-scale-fade-in bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)]" style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px' }}>
        <div className="flex items-center justify-between h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Tienda
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Nosotros
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Menú
            </Link>
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-serif text-3xl tracking-wider text-foreground">Aleymi</h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-foreground/70 hover:text-foreground boty-transition rounded-full text-xs font-medium"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'es' ? 'ES' : 'EN'}
            </button>
            <button
              type="button"
              className="p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account"
              className="hidden sm:block p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Cuenta"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-foreground/70 hover:text-foreground boty-transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0 -right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <CartDrawer />

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden boty-transition ${
            isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            <Link
              href="/shop"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Tienda
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Nosotros
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Menú
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              Cuenta
            </Link>
            <button
              type="button"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="sm:hidden flex items-center gap-1.5 text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              <Globe className="w-4 h-4" />
              {lang === 'es' ? 'Español' : 'English'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
