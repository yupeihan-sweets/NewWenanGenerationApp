import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { recordsData } from '@/lib/records';

// 格式化日期显示（简化版，实际应该根据 date 字段格式化）
const formatDate = (date: string): string => {
  if (date.includes('分钟前') || date.includes('昨天') || date.includes('周一')) {
    return date;
  }
  // 如果是完整日期，可以转换为相对时间
  return date;
};

export default function RecordsScreen() {
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
          <Text style={styles.headerTitle}>创作记录</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="time-outline" size={20} color={AppColors.secondary} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {recordsData.map((record, index) => (
          <View key={record.id} style={styles.recordItem}>
            <View style={styles.timeline}>
              <View style={styles.timelineDot} />
              {index < recordsData.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.recordContent}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                <View style={styles.recordType}>
                  <Text style={styles.recordTypeText}>{record.type}</Text>
                </View>
              </View>

              <Card
                style={styles.recordCard}
                onPress={() => router.push(`/records/${record.id}` as any)}
              >
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordText} numberOfLines={2}>
                  {record.content}
                </Text>
              </Card>
            </View>
          </View>
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
    paddingBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: AppColors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.secondary,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  recordItem: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginRight: 24,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
    borderWidth: 4,
    borderColor: AppColors.white,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: AppColors.grayBorder,
  },
  recordContent: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.gray,
  },
  recordType: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: AppColors.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.primary + '33',
  },
  recordTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  recordCard: {
    padding: 20,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  recordText: {
    fontSize: 14,
    color: AppColors.grayMedium,
    lineHeight: 20,
  },
});

