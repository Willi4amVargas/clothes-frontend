import { apiService } from './apiService'

export interface ClientSales {
  id: number
  cash: number
  client_id: number
  credit: number
  credit_days: number
  description: string
  discount: number
  document_no: string
  emission_date: string
  operation_type: 'SALE' | 'QUOTATION' | 'ORDER'
  pending: boolean
  percent_discount: number
  seller: string
  total: number
  total_amount: number
  total_cost: number
  total_count_details: number
  total_exempt: number
  total_net: number
  total_net_cost: number
  total_tax: number
  total_tax_cost: number
  user_id: number
}

class ReportsService {
  constructor(private baseRoute: string = '/reports') {}
  getClientSales = ({ id }: { id: number }) => {
    return apiService.get<ClientSales[] | { message: string }>(
      `${this.baseRoute}/clients/${id}/sales`,
      {
        withAuth: true,
      },
    )
  }
}

export const reportsService = new ReportsService()
