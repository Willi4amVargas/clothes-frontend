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
  image_url?: string
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

export type ProductWithDetails = Products & {
  units: ProductsUnits[]
  stock: ProductsStock[]
}

export type GetInventoryParams = {
  units?: boolean
  stock?: boolean
  ids?: number[]
}

class InventoryService {
  getInventory = ({ units, stock, ids }: GetInventoryParams) => {
    const params = new URLSearchParams()

    if (units !== undefined) params.append('units', String(units))
    if (stock !== undefined) params.append('stock', String(stock))
    if (ids && ids.length > 0) params.append('ids', ids.join(','))

    const queryString = params.toString()
    const url = `/products${queryString ? `?${queryString}` : ''}`

    return apiService.get<ProductWithDetails[]>(url, {
      withAuth: false,
      dryRun: false,
    })
  }

  getInventoryDetails = (id: number | undefined) => {
    if (!id) throw new Error('ID is required')
    return apiService.get<ProductWithDetails>(`/products/${id}`)
  }

  createInventory = (
    body:
      | (Omit<Products, 'id'> & {
          products_units: Omit<ProductsUnits, 'id' | 'product_id'>[]
        })
      | undefined,
  ) => {
    if (!body) throw new Error('Body is required')
    return apiService.post<ProductWithDetails>('/products', body, {
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

  addInventoryImage = ({
    id,
    formData,
  }: {
    id: number
    formData: FormData
  }) => {
    console.log(formData)
    return apiService.post<{ message: string }>(
      `/products/${id}/image`,
      formData,
      {
        withAuth: true,
        dryRun: false,
        stringify: false,
        // headers: { 'Content-Type': 'multipart/form-data' }
      },
    )
  }

  deleteInventoryImage = (id: number) => {
    return apiService.delete<{ message: string }>(
      `/products/${id}/image`,
      {},
      {
        withAuth: true,
        dryRun: false,
      },
    )
  }
}

export const inventoryService = new InventoryService()
