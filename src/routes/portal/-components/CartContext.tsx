import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: number
  brand: string
  title: string
  sku: string
  price: number
  quantity: number
  status: string
  statusColor: string
  dotColor: string
}

export type StorefrontView = 'shop' | 'checkout' | 'success'

interface CartContextType {
  cartItems: CartItem[]
  cartDrawerOpen: boolean
  setCartDrawerOpen: (open: boolean) => void
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  currentView: StorefrontView
  setCurrentView: (view: StorefrontView) => void
  orderData: any
  setOrderData: (data: any) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [currentView, setCurrentView] = useState<StorefrontView>('shop')
  const [orderData, setOrderData] = useState<any>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('precision_cart')
    if (saved) {
      try {
        setCartItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart data', e)
      }
    }
  }, [])

  // Sync cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('precision_cart', JSON.stringify(items))
  }

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    const existing = cartItems.find((item) => item.id === product.id)
    if (existing) {
      const updated = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
      saveCart(updated)
    } else {
      saveCart([...cartItems, { ...product, quantity: 1 }])
    }
    setCartDrawerOpen(true) // Automatically open drawer on add
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    )
    saveCart(updated)
  }

  const removeFromCart = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id)
    saveCart(updated)
  }

  const clearCart = () => {
    saveCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        currentView,
        setCurrentView,
        orderData,
        setOrderData,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
