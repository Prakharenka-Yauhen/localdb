import { ReactElement } from 'react';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tabStyle: Record<string, any> = {
    headerTitleAlign: "center",
    headerShown: false,
    headerStyle: {
        backgroundColor: 'green',
    },
    headerTitleStyle: {
        color: 'white',
    },
}

export default function TabLayout(): ReactElement {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName={"home"}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
            ...tabStyle,
            title: 'Watermelon DB',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sqlite"
        options={{
            ...tabStyle,
            title: 'SQLite DB',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="berequests"
        options={{
            ...tabStyle,
            title: 'BE requests',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
