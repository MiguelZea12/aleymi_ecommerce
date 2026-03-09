"use client"

import { useState } from "react"
import { seedProducts } from "@/lib/firestore"
import { SEED_PRODUCTS } from "@/lib/seed-data"

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  const handleSeed = async () => {
    setStatus("loading")
    try {
      await seedProducts(SEED_PRODUCTS)
      setStatus("done")
    } catch (e) {
      console.error(e)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="font-serif text-3xl">Seed Productos a Firestore</h1>
        <p className="text-muted-foreground">Esto subirá los 10 productos a la base de datos.</p>
        <button
          type="button"
          onClick={handleSeed}
          disabled={status === "loading"}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium disabled:opacity-50"
        >
          {status === "idle" && "Subir Productos"}
          {status === "loading" && "Subiendo..."}
          {status === "done" && "¡Listo! ✓"}
          {status === "error" && "Error — Reintentar"}
        </button>
      </div>
    </div>
  )
}
