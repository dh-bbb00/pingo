import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 60 },
  header:       { fontSize: 22, fontWeight: '700', padding: 20 },
  section:      { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label:        { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  value:        { fontSize: 16, color: '#111827' },
  menuItem:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuLabel:    { fontSize: 16 },
  chevron:      { fontSize: 20, color: '#9CA3AF' },
  logoutButton: { margin: 20, marginTop: 'auto', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  logoutText:   { color: '#EF4444', fontWeight: '600' },
})
