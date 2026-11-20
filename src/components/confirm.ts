import { Alert, Platform } from 'react-native';

/**
 * Asks before a destructive action with the platform's own dialog: a native alert with a
 * destructive button on iOS/Android, the browser's confirm on web (react-native-web has no
 * Alert.alert). Calls `onConfirm` only if the user agrees.
 */
export function confirmDestructive({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
}) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
