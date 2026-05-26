import { apiService } from './apiService'

export interface Products {
  id: number
  code: string
  description: string
  mark: string
  model: string
  referenc: string
  discount: number
  status: boolean
  origin: string
  buy_tax: number
  sale_tax: number
}

export interface ProductsUnits {
  id: number
  unit: string
  product_id: number
  cost: number
  price: number
}

export interface ProductsStock {
  product_id: number
  unit: number
  stock: number
}

class InventoryService {
  getInventory = () => {
    return apiService.get<Products[]>('/products', {
      withAuth: true,
      dryRun: false,
    })
  }

  getInventoryDetails = (id: number | undefined) => {
    if (!id) throw new Error('ID is required')
    return apiService.get<
      Products & { units: ProductsUnits[]; stock: ProductsStock[] }
    >(`/products/${id}`)
  }

  createInventory = (
    body: Omit<Products, 'id'> & {
      products_units: Omit<ProductsUnits, 'id' | 'product_id'>[]
    },
  ) => {
    if (!body) throw new Error('Body is required')
    return apiService.post<
      Products & { units: ProductsUnits[]; stock: ProductsStock[] }
    >('/products', body, {
      withAuth: true,
      dryRun: false,
    })
  }

  updateInventory = async ({
    id,
    body,
  }: {
    id: number
    body: Partial<Omit<Products, 'id'>> & {
      products_units?: Omit<ProductsUnits, 'product_id'>[]
    }
  }) => {
    return apiService.put<
      Products & { products_units: ProductsUnits[] | undefined }
    >(`/products/${id}`, body, {
      withAuth: true,
      dryRun: false,
    })
  }

  deleteInventory = (id: number) => {
    return apiService.delete<{ message: string }>(
      `/products/${id}`,
      {},
      {
        withAuth: true,
        dryRun: false,
      },
    )
  }
}

export const inventoryService = new InventoryService()
