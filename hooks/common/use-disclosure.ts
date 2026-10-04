import { useState, useCallback } from 'react';

export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Hook quản lý trạng thái mở/đóng (Modal, Dialog, Drawer, Dropdown) chuẩn mực và tái sử dụng cao.
 * @param defaultIsOpen Trạng thái mở ban đầu (mặc định: false)
 */
export function useDisclosure(defaultIsOpen: boolean = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setIsOpen,
  };
}
