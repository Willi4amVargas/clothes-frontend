import { apiService } from './apiService'

export interface Client {
  id: number
  code: string
  description: string
  client_id: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  credit_days: number
  credit_limit: number
  discount: number
}

export interface CreateClientDto {
  code: string
  description: string
  client_id: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  credit_days: number
  credit_limit: number
  discount: number
}

export interface ClientReturn extends CreateClientDto {
  id: number
  dry_run?: boolean
  message?: string
}

class ClientService {
  getOne = async (id: number) => {
    return apiService.get<Client>(`/clients/${id}`, {
      withAuth: true,
    })
  }

  getAll = async () => {
    return apiService.get<Client[]>('/clients', {
      withAuth: true,
    })
  }

  create = async ({
    body,
    dryRun,
  }: {
    body: CreateClientDto
    dryRun: boolean
  }) => {
    return apiService.post<ClientReturn>('/clients', body, {
      withAuth: true,
      stringify: true,
      dryRun,
    })
  }

  update = async ({
    id,
    body,
    dryRun,
  }: {
    id: number
    body: Partial<Omit<Client, 'id'>>
    dryRun: boolean
  }) => {
    return apiService.put<ClientReturn>(`/clients/${id}`, body, {
      withAuth: true,
      stringify: true,
      dryRun,
    })
  }
}

export const clientService = new ClientService()
