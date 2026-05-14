import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container:  { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  title:      { fontSize: 28, fontWeight: '700', marginBottom: 32 },
  input:      { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 14, marginBottom: 12 },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  button:     { backgroundColor: '#4F6CF7', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  link:       { textAlign: 'center', color: '#6B7280', marginTop: 16 },
})
