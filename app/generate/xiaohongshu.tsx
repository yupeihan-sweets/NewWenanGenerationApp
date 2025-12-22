import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const targetAudience = ['学生党', '上班族', '宝妈'];

export default function XiaohongshuGeneratorScreen() {
  const router = useRouter();
  const [selectedAudience, setSelectedAudience] = useState<string>('');

  return (
    <Layout showNav={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={AppColors.secondary} />
          </Pressable>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>小红书生成器</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>打造爆款笔记 🔥</Text>
          <Text style={styles.subtitle}>输入你的种草关键词</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>产品/主题</Text>
            <Input placeholder="例如：YSL新款口红、平价蓝牙耳机..." />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>卖点/关键词</Text>
            <Input placeholder="显白、持久、学生党..." />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>目标人群</Text>
            <View style={styles.audienceContainer}>
              {targetAudience.map((audience, idx) => (
                <Pressable
                  key={idx}
                  style={[
                    styles.audienceButton,
                    selectedAudience === audience && styles.audienceButtonActive,
                  ]}
                  onPress={() => setSelectedAudience(audience)}
                >
                  <Text
                    style={[
                      styles.audienceText,
                      selectedAudience === audience && styles.audienceTextActive,
                    ]}
                  >
                    {audience}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            fullWidth
            onPress={() => router.push('/result')}
            style={styles.generateButton}
          >
            <Ionicons name="sparkles" size={20} color={AppColors.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>创建专属笔记</Text>
          </Button>
        </View>
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
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: AppColors.muted,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  placeholder: {
    width: 40,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  audienceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  audienceButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: AppColors.grayBorder,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audienceButtonActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '0D',
  },
  audienceText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.gray,
  },
  audienceTextActive: {
    color: AppColors.secondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.grayBorder,
  },
  generateButton: {
    height: 56,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

