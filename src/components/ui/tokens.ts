/**
 * Names of the color tokens defined in src/global.css (`--color-<name>`).
 * Values live only in global.css; this is just the list of names for typed props.
 */
export type ColorToken =
  | 'primary'
  | 'on-primary'
  | 'secondary'
  | 'on-secondary'
  | 'fg'
  | 'fg-muted'
  | 'bg'
  | 'surface'
  | 'surface-muted'
  | 'border'
  | 'success'
  | 'success-soft'
  | 'danger'
  | 'danger-soft'
  | 'info'
  | 'info-soft'
  | 'warning'
  | 'warning-soft';

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
