import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const defaultContent = `春日的阳光大概是最好的滤镜了吧☀️
今天路过公园，看到樱花开得正盛，忍不住停下来拍了几张。
微风吹过，花瓣飘落的样子真的太治愈了~🌸
虽然生活忙碌，但也别忘了抬头看看身边的风景呀。

希望你今天也有好心情！💖

#春日 #樱花 #生活碎片 #治愈系风景 #好心情`;

export default function ResultScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [activeResult, setActiveResult] = useState(1);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    Alert.alert('成功', '复制成功！快去发布吧~');
  };

  const handleRegenerate = () => {
    Alert.alert('提示', '正在为您重新生成...');
    setTimeout(() => {
      setContent('这是重新生成的文案内容...\n\n带有一些新的惊喜✨');
    }, 1000);
  };

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
          <View style={styles.resultTabs}>
            <Pressable
              style={[styles.resultTab, activeResult === 1 && styles.resultTabActive]}
              onPress={() => setActiveResult(1)}
            >
              <Text style={[styles.resultTabText, activeResult === 1 && styles.resultTabTextActive]}>
                结果 1
              </Text>
            </Pressable>
            <Pressable
              style={[styles.resultTab, activeResult === 2 && styles.resultTabActive]}
              onPress={() => setActiveResult(2)}
            >
              <Text style={[styles.resultTabText, activeResult === 2 && styles.resultTabTextActive]}>
                结果 2
              </Text>
            </Pressable>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultCard}>
            <View style={styles.resultCardHeader}>
              <View style={styles.resultCardTitle}>
                <View style={styles.resultCardIndicator} />
                <Text style={styles.resultCardTitleText}>生成结果</Text>
              </View>
              <Pressable
                style={[styles.editButton, isEditing && styles.editButtonActive]}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Ionicons
                  name={isEditing ? 'checkmark' : 'create-outline'}
                  size={16}
                  color={isEditing ? '#FFFFFF' : '#9CA3AF'}
                />
              </Pressable>
            </View>

            {isEditing ? (
              <TextInput
                style={styles.textArea}
                multiline
                value={content}
                onChangeText={setContent}
                autoFocus
              />
            ) : (
              <View style={styles.contentView}>
                <Text style={styles.contentText}>{content}</Text>
                {!isEditing && (
                  <Pressable style={styles.copyFloatingButton} onPress={handleCopy}>
                    <Ionicons name="copy-outline" size={18} color={AppColors.secondary} />
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <Button fullWidth onPress={handleCopy} style={styles.copyButton}>
              <Text style={styles.buttonText}>复制文案</Text>
            </Button>

            <Pressable style={styles.regenerateButton} onPress={handleRegenerate}>
              <Ionicons name="refresh" size={18} color="#9CA3AF" />
              <Text style={styles.regenerateText}>不满意？重新生成</Text>
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
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTabs: {
    flexDirection: 'row',
    backgroundColor: AppColors.muted,
    padding: 4,
    borderRadius: 20,
  },
  resultTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  resultTabTextActive: {
    color: AppColors.secondary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: AppColors.primary + '33',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 300,
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCardIndicator: {
    width: 8,
    height: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 4,
    marginRight: 8,
  },
  resultCardTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.secondary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonActive: {
    backgroundColor: AppColors.secondary,
  },
  textArea: {
    width: '100%',
    minHeight: 300,
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.secondary,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  contentView: {
    minHeight: 300,
    position: 'relative',
  },
  contentText: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.secondary,
    lineHeight: 24,
  },
  copyFloatingButton: {
    position: 'absolute',
    top: 24,
    right: 64,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingBottom: 24,
  },
  copyButton: {
    marginBottom: 16,
    height: 56,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  regenerateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
});

