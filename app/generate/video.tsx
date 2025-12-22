import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const styles_list = ['搞笑', '干货', '治愈', '悬疑', '快节奏', '唯美'];
const durations = [15, 30, 45, 60];

export default function VideoScriptGeneratorScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(30);
  const [selectedStyle, setSelectedStyle] = useState<string>('');

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
            <Text style={styles.badgeText}>短视频脚本</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>专业脚本创作 🎬</Text>
          <Text style={styles.subtitle}>包含画面、台词和运镜建议</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>视频主题</Text>
            <Input placeholder="例如：沉浸式护肤、搞笑段子..." />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>预估时长</Text>
            <View style={styles.durationContainer}>
              {durations.map((d) => (
                <Pressable
                  key={d}
                  style={[
                    styles.durationButton,
                    duration === d && styles.durationButtonActive,
                  ]}
                  onPress={() => setDuration(d)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      duration === d && styles.durationTextActive,
                    ]}
                  >
                    {d}s
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>风格基调</Text>
            <View style={styles.stylesGrid}>
              {styles_list.map((style, idx) => (
                <Pressable
                  key={idx}
                  style={[
                    styles.styleButton,
                    selectedStyle === style && styles.styleButtonActive,
                  ]}
                  onPress={() => setSelectedStyle(style)}
                >
                  <Text
                    style={[
                      styles.styleText,
                      selectedStyle === style && styles.styleTextActive,
                    ]}
                  >
                    {style}
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
            <Ionicons name="videocam" size={20} color={AppColors.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>生成分镜脚本</Text>
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
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: AppColors.grayBorder,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonActive: {
    borderColor: AppColors.secondary,
    backgroundColor: AppColors.secondary + '0D',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.gray,
  },
  durationTextActive: {
    color: AppColors.secondary,
  },
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  styleButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: AppColors.grayBorder,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleButtonActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '0D',
  },
  styleText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.gray,
  },
  styleTextActive: {
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

