import React, { memo, useMemo, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { makeStyles } from './PaginationBar.styles'

interface Props {
  page:         number
  totalPages:   number
  onPageChange: (page: number) => void
}

export default memo(function PaginationBar({ page, totalPages: rawTotalPages, onPageChange }: Props) {
  const totalPages = Math.max(1, rawTotalPages)
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [editing,   setEditing]   = useState(false)
  const [inputText, setInputText] = useState('')

  const handlePress = () => {
    setInputText(String(page))
    setEditing(true)
  }

  const handleSubmit = () => {
    const parsed = parseInt(inputText, 10)
    if (!isNaN(parsed)) {
      onPageChange(Math.min(Math.max(1, parsed), totalPages))
    }
    setEditing(false)
  }

  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        <Text style={styles.pageBtnText}>◀</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pageInfo} onPress={handlePress} disabled={editing}>
        {editing ? (
          <TextInput
            style={styles.pageInput}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSubmit}
            onBlur={handleSubmit}
            keyboardType="number-pad"
            returnKeyType="go"
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <Text style={styles.pageNum}>{page}</Text>
        )}
        <Text style={styles.pageSep}> / {totalPages}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
        onPress={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        <Text style={styles.pageBtnText}>▶</Text>
      </TouchableOpacity>
    </View>
  )
})
