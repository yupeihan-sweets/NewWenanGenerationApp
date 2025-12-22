import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const categories = ['全部', '生活', '职场', '营销', '情感', '娱乐'];

const templates = [
  { id: 1, title: '节日祝福', icon: '🎉', category: '生活' },
  { id: 2, title: '请假理由', icon: '📝', category: '职场' },
  { id: 3, title: '好物种草', icon: '💄', category: '营销' },
  { id: 4, title: '表白情书', icon: '💌', category: '情感' },
  { id: 5, title: '周报总结', icon: '📊', category: '职场' },
  { id: 6, title: '旅行日记', icon: '✈️', category: '生活' },
];

export default function TemplatesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('全部');

  const filtered = activeTab === '全部' ? templates : templates.filter(t => t.category === activeTab);

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>灵感库</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={AppColors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜搜看？"
            placeholderTextColor={AppColors.gray}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {categories.map(cat => (
            <Pressable
              key={cat}
              style={[
                styles.tab,
                activeTab === cat && styles.tabActive,
              ]}
              onPress={() => setActiveTab(cat)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === cat && styles.tabTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(item => (
          <Card
            key={item.id}
            style={styles.templateCard}
            onPress={() => router.push(`/templates/${item.id}` as any)}
          >
            <Text style={styles.templateIcon}>{item.icon}</Text>
            <Text style={styles.templateTitle}>{item.title}</Text>
          </Card>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: AppColors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.grayLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  tabsContainer: {
    marginBottom: 8,
  },
  tabsContent: {
    gap: 12,
    paddingRight: 24,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: AppColors.grayBorder,
    backgroundColor: AppColors.white,
  },
  tabActive: {
    backgroundColor: AppColors.secondary,
    borderColor: AppColors.secondary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.gray,
  },
  tabTextActive: {
    color: AppColors.white,
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  templateCard: {
    width: '47%',
    height: 144,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.grayLight,
  },
  templateIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    textAlign: 'center',
  },
});

