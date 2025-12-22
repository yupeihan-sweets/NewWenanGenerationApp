import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, showNav && styles.contentWithNav]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.grayBorder,
  },
  wrapper: {
    flex: 1,
    backgroundColor: AppColors.white,
    maxWidth: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: AppColors.white,
  },
  contentWithNav: {
    paddingBottom: 80, // 为底部导航留出空间
  },
});

export default Layout;

