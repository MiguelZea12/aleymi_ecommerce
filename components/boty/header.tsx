"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search, User, Globe, LogOut, ClipboardList, UserCircle2 } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { useLang } from "./language-context"
import { useAuth } from "./auth-context"

const t = {
  es: { shop: "Tienda", about: "Nosotros", menu: "Menú", account: "Cuenta", search: "Buscar", langLabel: "ES", langFull: "Español", myAccount: "Mi Cuenta", myOrders: "Mis Pedidos", logout: "Cerrar Sesión", greeting: "Hola" },
  en: { shop: "Shop", about: "About", menu: "Menu", account: "Account", search: "Search", langLabel: "EN", langFull: "English", myAccount: "My Account", myOrders: "My Orders", logout: "Sign Out", greeting: "Hello" },
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const { lang, toggleLang } = useLang()
  const { setIsOpen, itemCount } = useCart()
  const { user, profile, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = profile?.name
    ? profile.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?"

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
              {t[lang].shop}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              {t[lang].about}
            </Link>
            <Link
              href="/menu"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              {t[lang].menu}
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
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-foreground/70 hover:text-foreground boty-transition rounded-full text-xs font-medium"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5" />
              {t[lang].langLabel}
            </button>
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 boty-transition"
                    aria-label={t[lang].account}
                  >
                    {initials}
                  </button>
                  {isAccountOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-border/40 shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border/40">
                        <p className="text-xs text-muted-foreground">{t[lang].greeting}</p>
                        <p className="text-sm font-medium text-foreground truncate">{profile?.name}</p>
                      </div>
                      <Link
                        href="/cuenta"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-muted boty-transition"
                      >
                        <UserCircle2 className="w-4 h-4" />
                        {t[lang].myAccount}
                      </Link>
                      <Link
                        href="/cuenta?tab=pedidos"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-muted boty-transition"
                      >
                        <ClipboardList className="w-4 h-4" />
                        {t[lang].myOrders}
                      </Link>
                      <div className="border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => { logout(); setIsAccountOpen(false) }}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted w-full boty-transition"
                        >
                          <LogOut className="w-4 h-4" />
                          {t[lang].logout}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/cuenta"
                  className="hidden sm:block p-2 text-foreground/70 hover:text-foreground boty-transition"
                  aria-label={t[lang].account}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
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
              {t[lang].shop}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              {t[lang].about}
            </Link>
            <Link
              href="/menu"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              {t[lang].menu}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              {t[lang].account}
            </Link>
            <button
              type="button"
              onClick={toggleLang}
              className="sm:hidden flex items-center gap-1.5 text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition"
            >
              <Globe className="w-4 h-4" />
              {t[lang].langFull}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
