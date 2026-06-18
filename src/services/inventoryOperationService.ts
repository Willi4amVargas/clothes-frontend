import { apiService } from './apiService'

export interface InventoryOperationDetail {
  main_id: number
  line: number
  product_id: number
  description_product: string
  amount: number
  unit: number
  unitary_cost: number
  aliquot: number
  total_cost: number
  total_tax: number
  total: number
}

export interface InventoryOperation {
  id: number
  operation_type: 'LOAD' | 'DOWNLOAD'
  description: string
  document_no: string
  emission_date: string
  total: number
  total_net: number
  total_tax: number
  user_id: number
  total_details: number
  total_amount: number
}

export interface InventoryOperationResponse extends InventoryOperation {
  inventory_operation_details?: InventoryOperationDetail[]
  dry_run?: boolean
  message?: string
}

export interface CreateInventoryOperationBody {
  operation_type: 'LOAD' | 'DOWNLOAD'
  description?: string
  inventory_operation_details: {
    product_id: number
    unit: number
    amount: number
  }[]
}

class InventoryOperationService {
  getOperations = () => {
    return apiService.get<InventoryOperation[]>('/inventory_operation', {
      withAuth: true,
      dryRun: false,
    })
  }

  getOperationDetails = (id: number | undefined) => {
    if (!id) throw new Error('ID is required')
    return apiService.get<
      InventoryOperation & {
        inventory_operation_details: InventoryOperationDetail[]
      }
    >(`/inventory_operation/${id}`, {
      withAuth: true,
      dryRun: false,
    })
  }

  createOperation = (body: CreateInventoryOperationBody, dryRun = false) => {
    return apiService.post<InventoryOperationResponse>('/inventory_operation', body, {
      withAuth: true,
      dryRun: dryRun,
    })
  }
}

export const inventoryOperationService = new InventoryOperationService()
