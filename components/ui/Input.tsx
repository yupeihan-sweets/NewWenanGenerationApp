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
      placeholderTextColor={AppColors.grayLighter}
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
    borderColor: AppColors.grayBorder,
    backgroundColor: AppColors.grayLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppColors.secondary,
    borderRadius: 16,
    fontWeight: '500',
  },
});

export default Input;

