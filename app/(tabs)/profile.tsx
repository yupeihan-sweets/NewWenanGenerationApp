import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const menuItems = [
  { icon: 'heart-outline', label: '我的收藏', value: '4' },
  { icon: 'card-outline', label: '会员中心', value: '升级 PRO' },
  { icon: 'settings-outline', label: '通用设置', value: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            // AuthGuard 会自动检测到 session 变为 null 并跳转到登录页
            // 不需要手动调用 router.replace
          } catch (error) {
            console.error('退出登录失败:', error);
            Alert.alert('错误', '退出登录失败，请重试');
          }
        },
      },
    ]);
  };

  return (
    <Layout>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👩‍🎨</Text>
          <View style={styles.avatarBadge}>
            <Ionicons name="person" size={12} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.name}>创作达人</Text>
        <Text style={styles.id}>ID: {user?.id?.slice(0, 8) || '893021'}</Text>
      </View>

      <View style={styles.content}>
        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>生成次数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>收藏模板</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>PRO</Text>
              <Text style={styles.statLabel}>当前计划</Text>
            </View>
          </View>
        </Card>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (index === 0) {
                  // 我的收藏
                  router.push('/(tabs)/favorites' as any);
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={18} color={AppColors.secondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.value && (
                  <Text
                    style={[
                      styles.menuValue,
                      item.value === '升级 PRO' && styles.menuValuePro,
                    ]}
                  >
                    {item.value}
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={16} color="#F87171" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>退出登录</Text>
        </Pressable>

        <Text style={styles.version}>VERSION 2.0.1</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AppColors.muted,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.secondary,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginTop: -24,
  },
  statsCard: {
    paddingVertical: 24,
    marginBottom: 24,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 32,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  menuValuePro: {
    color: AppColors.primary,
    backgroundColor: AppColors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    marginBottom: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#D1D5DB',
  },
});

