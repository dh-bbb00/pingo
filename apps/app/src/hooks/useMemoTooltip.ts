import { useCallback, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

interface State { visible: boolean; bottom: number }

export function useMemoTooltip(memo: string | null | undefined) {
  const rowRef = useRef<any>(null)
  const [state, setState] = useState<State>({ visible: false, bottom: 0 })

  const show = useCallback(() => {
    if (!memo) return
    rowRef.current?.measure(
      (_x: number, _y: number, _w: number, _h: number, _px: number, pageY: number) => {
        setState({ visible: true, bottom: Dimensions.get('window').height - pageY + 8 })
      },
    )
  }, [memo])

  const hide = useCallback(() => setState(prev => ({ ...prev, visible: false })), [])

  return { rowRef, visible: state.visible, bottom: state.bottom, show, hide }
}
