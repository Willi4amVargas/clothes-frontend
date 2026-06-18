import { userService } from '#/services/userService'
import { useQuery } from '@tanstack/react-query'

export const useUsers = (id: number) => {
  const userBasic = useQuery({
    queryKey: ['user-basic-info'],
    queryFn: () => userService.userBasicInfo(id),
  })

  return { userBasic }
}
