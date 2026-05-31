import { useQuery } from '@tanstack/react-query'
import { paymentMethodsApi } from '@/api/endpoints/paymentMethods.api'
import { queryKeys } from '@/constants/queryKeys'

export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.paymentMethods.list(),
    queryFn:  () => paymentMethodsApi.getList().then(r => r.data.data),
  })
}
