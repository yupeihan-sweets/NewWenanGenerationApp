import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { AppColors } from '@/constants/theme';

export interface InputProps extends TextInputProps {
  style?: ViewStyle;
}

const Input = React.forwardRef<TextInput, InputProps>(({ style, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      placeholderTextColor="#D1D5DB"
      {...props}
    />
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: '100%',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppColors.secondary,
    borderRadius: 16,
    fontWeight: '500',
  },
});

export default Input;

