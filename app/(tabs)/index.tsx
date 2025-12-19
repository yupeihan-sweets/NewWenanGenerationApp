import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { AppColors } from '@/constants/theme';
import { recordsData } from '@/lib/records';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const quickActions = [
  { title: '朋友圈', desc: '分享每一刻', icon: 'camera-outline', path: '/generate/moments', color: AppColors.primary + '33', iconColor: AppColors.secondary },
  { title: '小红书', desc: '种草笔记', icon: 'create-outline', path: '/generate/xiaohongshu', color: AppColors.primary + '66', iconColor: AppColors.secondary },
  { title: '短视频', desc: '创意脚本', icon: 'videocam-outline', path: '/generate/video', color: AppColors.secondary, iconColor: '#FFFFFF' },
  { title: '全部', desc: '更多场景', icon: 'sparkles', path: '/(tabs)/scenarios', color: '#F3F4F6', iconColor: '#6B7280' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>HELLO, CREATOR</Text>
            <Text style={styles.headerTitle}>开始你的创作之旅 ✨</Text>
          </View>
          <Pressable
            style={styles.avatarButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.avatarEmoji}>😎</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/templates')}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <Text style={styles.searchText}>搜索你需要的灵感...</Text>
        </Pressable>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速开始</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, idx) => (
              <Pressable
                key={idx}
                style={styles.quickActionItem}
                onPress={() => router.push(action.path as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.iconColor} />
                </View>
                <Text style={styles.quickActionLabel}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Banner Card */}
        <Pressable
          style={styles.banner}
          onPress={() => router.push('/templates/1')}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>PRO TIP</Text>
            </View>
            <Text style={styles.bannerTitle}>不知道写什么？</Text>
            <Text style={styles.bannerSubtitle}>试试我们的热门模板</Text>
          </View>
        </Pressable>

        {/* Recent */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近创作</Text>
            <Pressable onPress={() => router.push('/records')}>
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>查看全部</Text>
                <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
              </View>
            </Pressable>
          </View>

          {recordsData.length > 0 && (
            <Card 
              style={styles.recentCard} 
              onPress={() => router.push(`/records/${recordsData[0].id}` as any)}
            >
              <View style={styles.recentCardContent}>
                <View style={styles.recentCardIcon}>
                  <Text style={styles.recentCardEmoji}>
                    {recordsData[0].type === '朋友圈' ? '📷' : 
                     recordsData[0].type === '小红书' ? '💄' : 
                     recordsData[0].type === '短视频' ? '🎬' : '✨'}
                  </Text>
                </View>
                <View style={styles.recentCardText}>
                  <Text style={styles.recentCardTitle}>{recordsData[0].title}</Text>
                  <Text style={styles.recentCardTime}>{recordsData[0].date}</Text>
                </View>
                <View style={styles.recentCardArrow}>
                  <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                </View>
              </View>
            </Card>
          )}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.secondary,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.secondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  banner: {
    width: '100%',
    height: 160,
    backgroundColor: AppColors.secondary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    position: 'relative',
    zIndex: 10,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginBottom: 12,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  recentCard: {
    padding: 16,
  },
  recentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recentCardIcon: {
    width: 48,
    height: 48,
    backgroundColor: AppColors.muted,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCardEmoji: {
    fontSize: 20,
  },
  recentCardText: {
    flex: 1,
  },
  recentCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 4,
  },
  recentCardTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentCardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
