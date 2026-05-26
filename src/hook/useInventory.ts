import { inventoryService } from '#/services/inventoryService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'

export const useInventory = () => {
  const navigate = useNavigate()

  const inventory = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryService.getInventory,
  })

  const createInventory = useMutation({
    mutationFn: inventoryService.createInventory,
    onSuccess: (data) => {
      inventory.refetch()
      toast.success('Producto ' + data.code + ' creado con éxito', {
        toastId: 'create-inventory-success',
      })
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'create-inventory-error',
      })
    },
  })

  const updateInventory = useMutation({
    mutationFn: inventoryService.updateInventory,
    onSuccess: (data) => {
      toast.info('Producto ' + data.code + ' actualizado con éxito')
      inventory.refetch()
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'update-inventory-error',
      })
    },
  })

  const deleteInventory = useMutation({
    mutationFn: inventoryService.deleteInventory,
    onSuccess: async (data) => {
      toast.success(data.message, {
        toastId: 'delete-inventory-success',
      })
      inventory.refetch()
      await navigate({ to: '/inventory' })
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'delete-inventory-error',
      })
    },
  })

  return { inventory, createInventory, updateInventory, deleteInventory }
}

export const useInventoryDetails = (id: number | undefined) => {
  const inventoryDetails = useQuery({
    queryKey: ['inventory-details', id],
    queryFn: () => inventoryService.getInventoryDetails(id),
  })

  return { inventoryDetails }
}
