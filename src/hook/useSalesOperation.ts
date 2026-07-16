import { salesOperationService } from '#/services/salesOperationService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useSalesOperation = (id: number) => {
  const salesOperation = useQuery({
    queryKey: ['sales-operation', id],
    queryFn: () => salesOperationService.getOne(id),
  })
  return { salesOperation }
}

export const useSalesOperations = () => {
  const salesOperations = useQuery({
    queryKey: ['sales-operations'],
    queryFn: salesOperationService.getAll,
  })

  const createOperation = useMutation({
    mutationFn: salesOperationService.create,
    onSuccess: (data) => {
      toast.success('Operación ' + data.document_no + ' procesada con éxito')
    },
    onError: ({ message }) => {
      toast.error(message || 'Error al procesar la operación')
    },
  })

  const simulateOperation = useMutation({
    mutationFn: salesOperationService.simulate,
    onError: ({ message }) => {
      toast.error(message || 'Error al procesar la operación')
    },
  })

  return { salesOperations, createOperation, simulateOperation }
}
