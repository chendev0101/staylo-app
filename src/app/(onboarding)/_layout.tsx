import { Stack } from 'expo-router';

// Entering the group always starts at the intro.
export const unstable_settings = { initialRouteName: 'intro' };

export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
