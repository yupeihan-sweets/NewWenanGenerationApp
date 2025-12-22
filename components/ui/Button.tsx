import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { AppColors } from '@/constants/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ variant = 'primary', fullWidth, children, onPress, disabled, loading, style, textStyle }, ref) => {
    const baseStyles: ViewStyle = {
      height: 48,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: AppColors.secondary,
      },
      secondary: {
        backgroundColor: AppColors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: AppColors.muted,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    const textVariantStyles: Record<string, TextStyle> = {
      primary: {
        color: AppColors.secondaryForeground,
        fontWeight: '700',
      },
      secondary: {
        color: AppColors.secondary,
        fontWeight: '700',
      },
      outline: {
        color: AppColors.secondary,
        fontWeight: '700',
      },
      ghost: {
        color: AppColors.grayMedium,
        fontWeight: '700',
      },
    };

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          baseStyles,
          variantStyles[variant],
          fullWidth && { width: '100%' },
          (disabled || loading) && { opacity: 0.5 },
          pressed && { transform: [{ scale: 0.95 }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textVariantStyles[variant].color} />
        ) : (
          <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
            {children}
          </Text>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default Button;

