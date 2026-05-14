import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { CategoryStackParamList } from '@/types/navigation'
import type { CategoryListItem } from './types'
import { styles } from './CategoryScreen.styles'

type Nav = NativeStackNavigationProp<CategoryStackParamList, 'CategoryMain'>

export default function CategoryScreen() {
  const navigation = useNavigation<Nav>()

  // TODO: 카테고리 목록 API 연동

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>카테고리</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CategoryEdit', {})}
        >
          <Text style={styles.addButtonText}>+ 추가</Text>
        </TouchableOpacity>
      </View>

      <FlatList<CategoryListItem>
        data={[]}
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>카테고리가 없습니다.</Text>}
      />
    </SafeAreaView>
  )
}
