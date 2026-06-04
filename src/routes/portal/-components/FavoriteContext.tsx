import React, { createContext, useContext, useState, useEffect } from 'react'

export interface FavoriteItem {
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

interface FavoriteContextType {
  favoriteItems: FavoriteItem[]
  favoriteModalOpen: boolean
  setFavoriteModalOpen: (open: boolean) => void
  addToFavorite: (product: Omit<FavoriteItem, 'quantity'>) => void
  updateQuantity: (id: number, quantity: number) => void
  removeFromFavorites: (id: number) => void
  clearFavorites: () => void
  orderData: any
  setOrderData: (data: any) => void
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('precision_favorites')
    if (saved) {
      try {
        setFavoriteItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse favorites data', e)
      }
    }
  }, [])

  useEffect(() => {
    if (favoriteItems.length > 0 || localStorage.getItem('precision_favorites')) {
      localStorage.setItem('precision_favorites', JSON.stringify(favoriteItems))
    }
  }, [favoriteItems])

  const addToFavorite = (product: Omit<FavoriteItem, 'quantity'>) => {
    setFavoriteItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id)
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    // setFavoriteModalOpen(true) // Abre el modal/drawer automáticamente
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromFavorites(id)
      return
    }
    setFavoriteItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const removeFromFavorites = (id: number) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearFavorites = () => {
    setFavoriteItems([])
  }

  return (
    <FavoriteContext.Provider
      value={{
        favoriteItems,
        favoriteModalOpen,
        setFavoriteModalOpen,
        addToFavorite,
        updateQuantity,
        removeFromFavorites,
        clearFavorites,
        orderData,
        setOrderData,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoriteContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider')
  }
  return context
}