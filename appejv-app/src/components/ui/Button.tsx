import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CommonStyles } from '../../constants/Styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Button component với nhiều variants và sizes khác nhau
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...CommonStyles.button,
      backgroundColor: Colors.primary,
    };

    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = Colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = Colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = Colors.transparent;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = Colors.primary;
        break;
    }

    if (disabled) {
      baseStyle.backgroundColor = Colors.gray[400];
    }

    // Thêm style dựa trên size
    const sizeStyles = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 20,
      },
    };

    return [baseStyle, sizeStyles[size], style] as ViewStyle[];
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...CommonStyles.buttonText,
      color: Colors.white,
    };

    if (variant === 'outline') {
      baseStyle.color = Colors.primary;
    }

    if (disabled) {
      baseStyle.color = Colors.gray[600];
    }

    return [baseStyle, textStyle] as TextStyle[];
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={getButtonStyle()}>
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
