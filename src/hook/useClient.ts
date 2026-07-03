import { clientService } from '#/services/clientService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useClient = (id: number) => {
  const client = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getOne(id),
  })
  return { client }
}

export const useClients = () => {
  const clients = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getAll,
  })

  const createClient = useMutation({
    mutationFn: clientService.create,
    onSuccess: (data) => {
      clients.refetch()
      toast.success('Cliente ' + data.code + ' creado con éxito', {
        toastId: 'create-client-success',
      })
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'create-client-error',
      })
    },
  })

  const updateClient = useMutation({
    mutationFn: clientService.update,
    onSuccess: (data) => {
      clients.refetch()
      toast.info('Cliente ' + data.code + ' actualizado con éxito', {
        toastId: 'update-client-success',
      })
    },
    onError: ({ message }) => {
      toast.error(message, {
        toastId: 'update-client-error',
      })
    },
  })
  return { clients, createClient, updateClient }
}
