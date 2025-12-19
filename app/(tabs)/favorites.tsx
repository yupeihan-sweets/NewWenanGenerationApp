import Layout from '@/components/Layout';
import { AppColors } from '@/constants/theme';
import { favoritesData } from '@/lib/favorites';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <Layout>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={AppColors.secondary} />
          </Pressable>
          <Text style={styles.headerTitle}>我的收藏</Text>
        </View>
        <Ionicons name="heart" size={24} color={AppColors.secondary} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {favoritesData.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.favoriteCard,
              { backgroundColor: item.color },
              item.borderColor && { borderColor: item.borderColor, borderWidth: 2 },
            ]}
            onPress={() => router.push(`/favorites/${item.id}` as any)}
          >
            <Text style={styles.favoriteText}>{item.text}</Text>
            <Text style={styles.favoriteDate}>{item.date}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.secondary,
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  favoriteCard: {
    width: '47%',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  favoriteDate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
});

