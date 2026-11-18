import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Icon, type IconName } from './icon';
import { cn } from './tokens';
import { useTokenColor } from './use-token-color';

type Props = Omit<TextInputProps, 'className' | 'placeholderTextColor' | 'style'> & {
  leadingIcon?: IconName;
  /** Optional trailing content, e.g. a filter IconButton. Ignored for secure fields. */
  trailing?: ReactNode;
  /** Layout only. */
  className?: string;
};

export function TextField({
  leadingIcon,
  trailing,
  className,
  secureTextEntry,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const placeholderColor = useTokenColor('fg-muted');
  const cursorColor = useTokenColor('primary');

  return (
    <View
      className={cn(
        'h-14 flex-row items-center gap-3 rounded-xl border bg-surface-muted px-4',
        focused ? 'border-primary' : 'border-transparent',
        className,
      )}>
      {leadingIcon && <Icon name={leadingIcon} size={20} tone="fg-muted" />}
      <TextInput
        {...inputProps}
        secureTextEntry={secureTextEntry && hidden}
        placeholderTextColor={placeholderColor}
        selectionColor={cursorColor}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className="h-full flex-1 font-outfit text-body text-fg"
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setHidden((h) => !h)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={hidden ? t('a11y.showPassword') : t('a11y.hidePassword')}>
          <Icon
            name={
              hidden
                ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                : { ios: 'eye', android: 'visibility', web: 'visibility' }
            }
            size={20}
            tone="fg-muted"
          />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}
