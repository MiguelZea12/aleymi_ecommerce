"use client"

import { useState, useEffect } from "react"
import { getProducts, getProductById } from "@/lib/firestore"
import { SEED_PRODUCTS } from "@/lib/seed-data"
import type { Product } from "@/lib/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data.length > 0 ? data : SEED_PRODUCTS)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts(SEED_PRODUCTS)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { products, loading }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data ?? SEED_PRODUCTS.find((p) => p.id === id) ?? null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(SEED_PRODUCTS.find((p) => p.id === id) ?? null)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [id])

  return { product, loading }
}
