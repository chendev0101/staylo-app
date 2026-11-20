import { Platform } from 'react-native';

/**
 * Extra top space for tab screens on web. There, NativeTabs renders a floating pill at the
 * top of the page (about 64px tall including its offset) instead of the native bottom bar,
 * so content must start below it. Native tab bars sit at the bottom and need nothing here.
 */
export const WEB_TAB_BAR_INSET = Platform.OS === 'web' ? 72 : 0;
