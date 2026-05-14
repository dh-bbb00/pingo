import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header:    { fontSize: 22, fontWeight: '700', padding: 20 },
  menuItem:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuLabel: { fontSize: 16 },
  chevron:   { fontSize: 20, color: '#9CA3AF' },
})
