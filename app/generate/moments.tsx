import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const moods = ['开心 😄', 'emo 😔', '疲惫 😫', '充满希望 ✨', '无语 🙄'];

export default function MomentsGeneratorScreen() {
  const router = useRouter();
  const [topic, setTopic] = useState('');

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
            <Text style={styles.badgeText}>朋友圈生成器</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>记录精彩生活 📸</Text>
          <Text style={styles.subtitle}>简单的文字也能充满力量</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>今天发生了什么？</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={6}
              placeholder="例如：今天去看了樱花，虽然人很多，但是心情很好..."
              placeholderTextColor="#D1D5DB"
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>心情如何？</Text>
            <View style={styles.moodContainer}>
              {moods.map((mood, idx) => (
                <Pressable
                  key={idx}
                  style={styles.moodButton}
                >
                  <Text style={styles.moodText}>{mood}</Text>
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
            <Ionicons name="sparkles" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>立即生成</Text>
          </Button>
        </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
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
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 16,
    marginLeft: 4,
  },
  textArea: {
    width: '100%',
    minHeight: 160,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 24,
    fontSize: 14,
    color: AppColors.secondary,
    fontWeight: '500',
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderRadius: 16,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  generateButton: {
    height: 56,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

