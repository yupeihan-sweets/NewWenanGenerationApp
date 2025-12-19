import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppColors } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

const Card = React.forwardRef<any, CardProps>(({ children, style, onPress }, ref) => {
  return (
    <View
      ref={ref}
      style={[styles.card, style]}
      onStartShouldSetResponder={() => !!onPress}
      onResponderRelease={onPress}
    >
      {children}
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Card;

