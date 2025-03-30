import { useQueryClient } from '@tanstack/react-query'

interface Props {
  queryKey: string[]
}

export function useInvalidateQuery({ queryKey }: Props) {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey, type: 'all' })

  return { invalidate }
}
