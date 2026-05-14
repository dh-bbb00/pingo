import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#FFFFFF' },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  header:        { fontSize: 22, fontWeight: '700' },
  addButton:     { backgroundColor: '#4F6CF7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#FFFFFF', fontWeight: '600' },
  empty:         { textAlign: 'center', color: '#9CA3AF', marginTop: 80 },
})
