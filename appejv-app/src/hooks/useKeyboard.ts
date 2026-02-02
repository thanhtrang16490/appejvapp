import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEventListener, Platform } from 'react-native';

interface UseKeyboardReturn {
  keyboardHeight: number;
  keyboardVisible: boolean;
}

/**
 * Hook để quản lý sự kiện bàn phím và chiều cao của bàn phím
 * @returns Thông tin về trạng thái và chiều cao của bàn phím
 */
export function useKeyboard(): UseKeyboardReturn {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleKeyboardShow: KeyboardEventListener = event => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide: KeyboardEventListener = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    let showSubscription: any;
    let hideSubscription: any;

    if (Platform.OS === 'ios') {
      showSubscription = Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      hideSubscription = Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardHeight, keyboardVisible };
}
