import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { AppColors } from '@/constants/theme';
import { getTemplateById } from '@/lib/templates';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // 根据 id 获取模板数据
  const template = getTemplateById(id);
  
  // 如果模板不存在，显示错误信息
  if (!template) {
    return (
      <Layout showNav={false}>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>模板不存在</Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>返回</Text>
            </Pressable>
          </View>
        </View>
      </Layout>
    );
  }

  return (
    <Layout showNav={false}>
      <View style={styles.container}>
        {/* Header with Pink Background */}
        <View style={styles.headerSection}>
          <View style={styles.headerEmoji}>
            <Text style={styles.emojiText}>{template.emoji}</Text>
          </View>
          
          <View style={styles.headerButtons}>
            <Pressable
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={AppColors.secondary} />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <Ionicons name="star-outline" size={20} color={AppColors.secondary} />
            </Pressable>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{template.category}</Text>
            </View>
            <Text style={styles.templateTitle}>{template.title}</Text>
            <Text style={styles.templateSubtitle}>{template.description}</Text>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          <View style={styles.contentCard}>
            {/* Template Introduction */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={18} color={AppColors.secondary} />
                <Text style={styles.sectionTitle}>模板介绍</Text>
              </View>
              <Text style={styles.sectionText}>
                {template.introduction}
              </Text>
            </View>

            {/* Features List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>包含内容</Text>
              <View style={styles.featuresList}>
                {template.features.map((item, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="checkmark" size={12} color={AppColors.secondary} />
                    </View>
                    <Text style={styles.featureText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Use Button */}
            <Button
              fullWidth
              onPress={() => router.push(template.generatorPath as any)}
              style={styles.useButton}
            >
              <Text style={styles.buttonText}>立即使用</Text>
            </Button>
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
  headerSection: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  headerEmoji: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 40,
    opacity: 0.1,
  },
  emojiText: {
    fontSize: 144,
    fontWeight: '900',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    zIndex: 10,
    marginTop: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  templateTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  templateSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.secondary + 'CC',
  },
  contentSection: {
    flex: 1,
    marginTop: -24,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
    minHeight: 500,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 20,
  },
  featuresList: {
    gap: 12,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  useButton: {
    height: 56,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
