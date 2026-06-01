import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fixedExpensesApi, type CreateFixedExpensePayload } from '@/api/endpoints/fixedExpenses.api'
import { queryKeys } from '@/constants/queryKeys'

export function useFixedExpenses() {
  return useQuery({
    queryKey: queryKeys.fixedExpenses.list(),
    queryFn:  async () => {
      const r = await fixedExpensesApi.getList()
      return r.data.data
    },
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFixedExpensePayload) => fixedExpensesApi.create(payload),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses.all }),
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateFixedExpensePayload> }) =>
      fixedExpensesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses.all }),
  })
}

export function useDeleteFixedExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fixedExpensesApi.delete(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.fixedExpenses.all }),
  })
}
