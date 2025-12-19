import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    backgroundColor: '#F3F4F6',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxWidth: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
  contentWithNav: {
    paddingBottom: 80, // 为底部导航留出空间
  },
});

export default Layout;

