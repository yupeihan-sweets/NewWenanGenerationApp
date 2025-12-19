import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '@/components/Layout';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// 场景到生成器路径的映射
const scenarioToGeneratorMap: Record<string, string | null> = {
  '朋友圈': '/generate/moments',
  '小红书': '/generate/xiaohongshu',
  '短视频': '/generate/video',
  '公众号': null, // 功能开发中
  '邮件': null,   // 功能开发中
  '周报': null,   // 功能开发中
  '其它': null,   // 功能开发中
};

const scenarios = [
  { title: '朋友圈', icon: '📷', desc: '日常分享' },
  { title: '小红书', icon: '💄', desc: '种草笔记' },
  { title: '短视频', icon: '🎬', desc: '剧本创作' },
  { title: '公众号', icon: '📰', desc: '文章大纲' },
  { title: '邮件', icon: '📧', desc: '商务沟通' },
  { title: '周报', icon: '📑', desc: '工作总结' },
  { title: '其它', icon: '✨', desc: '自由创作' },
];

export default function ScenariosScreen() {
  const router = useRouter();

  const handleScenarioPress = (title: string) => {
    const generatorPath = scenarioToGeneratorMap[title];
    
    if (generatorPath) {
      // 有对应的生成器，跳转
      router.push(generatorPath as any);
    } else {
      // 功能开发中，显示提示
      Alert.alert(
        '功能开发中',
        `${title}场景的生成功能正在开发中，敬请期待！`,
        [{ text: '知道了', style: 'default' }]
      );
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>全部场景</Text>
        <Text style={styles.subtitle}>在这里发现更多可能性</Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {scenarios.map((item, index) => {
            const hasGenerator = scenarioToGeneratorMap[item.title] !== null;
            
            return (
              <Pressable
                key={index}
                style={styles.scenarioItem}
                onPress={() => handleScenarioPress(item.title)}
              >
                <View style={styles.scenarioIcon}>
                  <Text style={styles.scenarioEmoji}>{item.icon}</Text>
                </View>
                <View style={styles.scenarioContent}>
                  <Text style={styles.scenarioTitle}>{item.title}</Text>
                  <Text style={styles.scenarioDesc}>{item.desc}</Text>
                </View>
                <View style={styles.scenarioArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 32,
  },
  list: {
    flex: 1,
  },
  scenarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    backgroundColor: AppColors.muted,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scenarioEmoji: {
    fontSize: 24,
  },
  scenarioContent: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.secondary,
    marginBottom: 4,
  },
  scenarioDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  scenarioArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

