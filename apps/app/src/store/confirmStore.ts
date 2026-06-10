import { create } from 'zustand'
import { strings } from '@/constants/strings'

export interface ConfirmButton {
  text:     string
  style?:   'cancel' | 'destructive' | 'default'
  onPress?: () => void
}

interface ConfirmState {
  visible:  boolean
  title:    string
  message?: string
  buttons:  ConfirmButton[]
  show:     (title: string, message?: string, buttons?: ConfirmButton[]) => void
  hide:     () => void
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  visible:  false,
  title:    '',
  message:  undefined,
  buttons:  [],
  show: (title, message, buttons) =>
    set({ visible: true, title, message, buttons: buttons ?? [{ text: strings.common.confirm }] }),
  hide: () => set({ visible: false }),
}))

export const showConfirm = (title: string, message?: string, buttons?: ConfirmButton[]) =>
  useConfirmStore.getState().show(title, message, buttons)
