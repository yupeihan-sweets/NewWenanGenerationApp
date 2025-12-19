import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { AppColors } from '@/constants/theme';
import { getRecordById } from '@/lib/records';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // 根据 id 获取记录数据
  const record = getRecordById(id);
  
  // 如果记录不存在，显示错误信息
  if (!record) {
    return (
      <Layout showNav={false}>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>记录不存在</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>返回</Text>
            </Pressable>
          </View>
        </View>
      </Layout>
    );
  }

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(record.content);
      Alert.alert('成功', '内容已复制！');
    } catch (error) {
      Alert.alert('错误', '复制失败，请重试');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${record.title}\n\n${record.content}`,
      });
      if (result.action === Share.sharedAction) {
        // 分享成功
      }
    } catch (error) {
      Alert.alert('错误', '分享失败，请重试');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '删除记录',
      '确定要删除这条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            // TODO: 实现删除逻辑
            Alert.alert('提示', '记录已删除');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <Layout showNav={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={AppColors.secondary} />
          </Pressable>
          <Text style={styles.headerTitle}>详情</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title and Meta */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{record.title}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>{record.date}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>{record.type}</Text>
            </View>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{record.content}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              onPress={handleCopy}
              style={styles.actionButton}
            >
              <Ionicons name="copy-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>复制</Text>
            </Button>
            <Button
              variant="outline"
              onPress={handleShare}
              style={styles.actionButton}
            >
              <Ionicons name="share-outline" size={18} color={AppColors.secondary} style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>分享</Text>
            </Button>
          </View>

          {/* Delete Button */}
          <View style={styles.deleteContainer}>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color="#F87171" />
              <Text style={styles.deleteText}>删除记录</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  contentCard: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 300,
    marginBottom: 32,
  },
  contentText: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.secondary,
    lineHeight: 28,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonTextOutline: {
    color: AppColors.secondary,
  },
  deleteContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
