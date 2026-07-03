import { reportsService } from '#/services/reportsService'
import { useQuery } from '@tanstack/react-query'

export const useClientReports = (id: number) => {
  const clientSales = useQuery({
    queryKey: ['client-sales', id],
    queryFn: () => reportsService.getClientSales({ id }),
  })
  return { clientSales }
}
