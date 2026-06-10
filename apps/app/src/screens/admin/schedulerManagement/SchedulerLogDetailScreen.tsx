import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import type { SchedulerLogType } from '@/api/endpoints/schedulerLogs.api'
import TypeDetailView from './components/TypeDetailView'
import IdDetailView from './components/IdDetailView'

type Props = NativeStackScreenProps<AdminMoreStackParamList, 'SchedulerLogDetail'>

export default function SchedulerLogDetailScreen({ route }: Props) {
  const params = route.params
  if (!('id' in params)) {
    return <TypeDetailView type={params.type as SchedulerLogType} year={params.year} month={params.month} />
  }
  return <IdDetailView id={params.id} />
}
