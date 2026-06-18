import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { inventoryOperationService } from '#/services/inventoryOperationService'
import type { CreateInventoryOperationBody } from '#/services/inventoryOperationService'

export const useInventoryOperations = () => {
  const operations = useQuery({
    queryKey: ['inventory-operations'],
    queryFn: inventoryOperationService.getOperations,
  })

  return { operations }
}

export const useInventoryOperationDetails = (id: number | undefined) => {
  const operationDetails = useQuery({
    queryKey: ['inventory-operation-details', id],
    queryFn: () => inventoryOperationService.getOperationDetails(id),
    enabled: !!id,
  })

  return { operationDetails }
}

export const useCreateInventoryOperation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const createOperation = useMutation({
    mutationFn: ({ body, dryRun }: { body: CreateInventoryOperationBody; dryRun?: boolean }) =>
      inventoryOperationService.createOperation(body, dryRun),
    onSuccess: async (data, variables) => {
      if (variables.dryRun) {
        toast.info('Revise los cálculos antes de confirmar.', {
          toastId: 'create-operation-dryrun-success',
        })
      } else {
        toast.success(`Operación ${data.operation_type} creada con éxito`, {
          toastId: 'create-operation-success',
        })
        queryClient.invalidateQueries({ queryKey: ['inventory-operations'] })
        queryClient.invalidateQueries({ queryKey: ['inventory'] }) // To update stock
        await navigate({ to: '/inventory/operations' })
      }
    },
    onError: ({ message }) => {
      toast.error(message || 'Error al procesar la operación', {
        toastId: 'create-operation-error',
      })
    },
  })

  return { createOperation }
}
