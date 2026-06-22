import type { GetInventoryParams } from '#/services/inventoryService'
import { inventoryService } from '#/services/inventoryService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'

export const useInventoryMultiple = (params: GetInventoryParams) => {
  const inventory = useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryService.getInventory(params),
  })
  return { inventory }
}

export const useInventory = () => {
  const navigate = useNavigate()

  const inventory = useQuery({
    queryKey: ['inventory'],
    queryFn: () =>
      inventoryService.getInventory({
        units: true,
        stock: true,
      }),
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

  const addInventoryImage = useMutation({
    mutationFn: inventoryService.addInventoryImage,
    onSuccess: (data) => {
      toast.success(data.message, {
        toastId: 'add-inventory-image-success',
      })
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'add-inventory-image-error',
      })
    },
  })

  const removeInventoryImage = useMutation({
    mutationFn: inventoryService.deleteInventoryImage,
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'remove-inventory-image-error',
      })
    },
  })

  return {
    inventory,
    createInventory,
    updateInventory,
    deleteInventory,
    addInventoryImage,
    removeInventoryImage,
  }
}

export const useInventoryDetails = (id: number | undefined) => {
  const inventoryDetails = useQuery({
    queryKey: ['inventory-details', id],
    queryFn: () => inventoryService.getInventoryDetails(id),
  })

  return { inventoryDetails }
}
