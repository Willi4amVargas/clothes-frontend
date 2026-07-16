import { apiService } from '#/services/apiService'

export type SalesOperationType = 'SALE' | 'QUOTATION' | 'ORDER'

export type SalesOperationDetailPayload = {
  product_id: number
  unit: number
  amount: number
}

export type SalesOperationPayload = {
  operation_type: SalesOperationType
  description: string
  client_id: number
  seller: string
  credit: number
  cash: number
  pending: boolean
  sales_operation_details: SalesOperationDetailPayload[]
}

export type SalesOperationDetailResponse = {
  main_id: number
  line: number
  product_id: number
  description_product: string
  amount: number
  unit: number
  unitary_cost: number
  sale_aliquot: number
  buy_aliquot: number
  price: number
  total_net_cost: number
  total_tax_cost: number
  total_cost: number
  percent_discount: number
  discount: number
  total_net: number
  total_tax: number
  total: number
}

export type SalesOperationResponse = {
  id?: number
  operation_type: SalesOperationType
  document_no: string
  emission_date?: string
  client_id: number
  seller: string
  credit_days: number
  description: string
  user_id: number
  total_amount: number
  percent_discount: number
  discount: number
  total_net: number
  total_exempt: number
  total_tax: number
  total: number
  credit: number
  cash: number
  total_net_cost: number
  total_tax_cost: number
  total_cost: number
  total_count_details: number
  pending: boolean
  dry_run?: boolean
  message?: string
  sales_operation_details?: SalesOperationDetailResponse[] // from dry_run=true
}

export const salesOperationService = {
  simulate: async (payload: SalesOperationPayload) => {
    return apiService.post<SalesOperationResponse>('/sales_operation?dry_run=true', payload, {
      dryRun: true,
    })
  },
  create: async (payload: SalesOperationPayload) => {
    return apiService.post<SalesOperationResponse>('/sales_operation', payload, {
      dryRun: false,
    })
  },
  getAll: async () => {
    return apiService.get<SalesOperationResponse[]>('/sales_operation')
  },
  getOne: async (id: number) => {
    return apiService.get<SalesOperationResponse>(`/sales_operation/${id}`)
  }
}
