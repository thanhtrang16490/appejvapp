import { useState, useCallback } from 'react';

interface UseDisclosureProps {
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

/**
 * Hook để quản lý trạng thái đóng/mở của modal, drawer, dropdown, etc.
 * @param props Cấu hình mặc định và callbacks
 * @returns Các methods và state để điều khiển trạng thái
 */
export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const { defaultIsOpen = false, onOpen: onOpenProp, onClose: onCloseProp } = props;
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenProp?.();
  }, [onOpenProp]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseProp?.();
  }, [onCloseProp]);

  const onToggle = useCallback(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onOpen, onClose]);

  return { isOpen, onOpen, onClose, onToggle };
}
