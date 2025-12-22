import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { AppColors } from '@/constants/theme';
import { getFavoriteById } from '@/lib/favorites';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

export default function FavoriteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // 根据 id 获取收藏数据
  const favorite = getFavoriteById(id);
  
  // 如果收藏不存在，显示错误信息
  if (!favorite) {
    return (
      <Layout showNav={false}>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>收藏不存在</Text>
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
      await Clipboard.setStringAsync(favorite.text);
      Alert.alert('成功', '内容已复制！');
    } catch (error) {
      Alert.alert('错误', '复制失败，请重试');
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: favorite.text,
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
      '取消收藏',
      '确定要取消收藏这条内容吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            // TODO: 实现取消收藏逻辑
            Alert.alert('提示', '已取消收藏');
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
          <Text style={styles.headerTitle}>收藏详情</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Content Card */}
          <View style={[
            styles.contentCard,
            { backgroundColor: favorite.color },
            favorite.borderColor && { borderColor: favorite.borderColor, borderWidth: 2 },
          ]}>
            <Text style={styles.contentText}>{favorite.text}</Text>
            <Text style={styles.contentDate}>{favorite.date}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              onPress={handleCopy}
              style={styles.actionButton}
            >
              <Ionicons name="copy-outline" size={18} color={AppColors.white} style={styles.buttonIcon} />
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
              <Ionicons name="heart-dislike-outline" size={16} color={AppColors.error} />
              <Text style={styles.deleteText}>取消收藏</Text>
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
    backgroundColor: AppColors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: AppColors.white,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.grayLight,
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
  contentCard: {
    padding: 24,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 32,
    minHeight: 200,
  },
  contentText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  contentDate: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.gray,
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
    color: AppColors.white,
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
    color: AppColors.error,
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
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

