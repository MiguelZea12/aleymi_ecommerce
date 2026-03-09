export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  badge: string | null
  category: "bocaditos" | "bandejas"
  sizes: string[]
  details: string
  howToUse: string
  ingredients: string
  delivery: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  // Para bandejas personalizadas
  customization?: BandejaCustomization
}

export interface BandejaCustomization {
  selectedItems: BandejaItem[]
  suggestion?: string
}

export interface BandejaItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export type PaymentMethod = "transferencia" | "efectivo" | "tarjeta"

export type OrderStatus = "pendiente" | "confirmado" | "en_preparacion" | "listo" | "entregado" | "cancelado"

export interface Order {
  id?: string
  userId?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  customer: CustomerInfo
  createdAt: Date
  updatedAt: Date
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
  city: string
  notes?: string
  eventDate?: string
}
