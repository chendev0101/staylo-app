import { Text as RNText, type TextProps } from 'react-native';

import { cn } from './tokens';

const variants = {
  display: 'font-outfit-bold text-display',
  title: 'font-outfit-bold text-title',
  headline: 'font-outfit-semibold text-headline',
  body: 'font-outfit text-body',
  label: 'font-outfit-medium text-label',
  caption: 'font-outfit-medium text-caption',
  small: 'font-outfit-medium text-small',
  button: 'font-outfit-semibold text-button',
} as const;

const tones = {
  default: 'text-fg',
  muted: 'text-fg-muted',
  primary: 'text-primary',
  'on-primary': 'text-on-primary',
  'on-secondary': 'text-on-secondary',
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
  warning: 'text-warning',
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

type Props = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Layout only (margins, flex, alignment). Use variant/tone for appearance. */
  className?: string;
};

export function Text({ variant = 'body', tone = 'default', className, ...props }: Props) {
  return <RNText className={cn(variants[variant], tones[tone], className)} {...props} />;
}
