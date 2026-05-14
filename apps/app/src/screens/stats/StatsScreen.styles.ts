import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#FFFFFF' },
  header:        { fontSize: 22, fontWeight: '700', padding: 20 },
  tabBar:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tab:           { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: '#4F6CF7' },
  tabText:       { color: '#9CA3AF', fontWeight: '500' },
  tabTextActive: { color: '#4F6CF7', fontWeight: '700' },
  content:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder:   { color: '#9CA3AF' },
})
