import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 60 },
  header:       { fontSize: 22, fontWeight: '700', padding: 20 },
  actions:      { flexDirection: 'row', gap: 12, padding: 20, position: 'absolute', bottom: 40, left: 0, right: 0 },
  editButton:   { flex: 1, borderWidth: 1, borderColor: '#4F6CF7', padding: 16, borderRadius: 8, alignItems: 'center' },
  editText:     { color: '#4F6CF7', fontWeight: '600' },
  deleteButton: { flex: 1, backgroundColor: '#EF4444', padding: 16, borderRadius: 8, alignItems: 'center' },
  deleteText:   { color: '#FFFFFF', fontWeight: '600' },
})
