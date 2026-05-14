import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { strings } from '@/constants/strings'

const s = strings.adminMore

export default function AdminMoreScreen() {
  const { logout } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
  },
  logoutButton: {
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
  },
})
