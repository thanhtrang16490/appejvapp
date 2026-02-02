import React from 'react';
import { Tabs } from 'expo-router';
import { Image, View, StyleSheet } from 'react-native';

export default function CustomTabBarPublic() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#D9261C',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="product"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Image 
                source={require('../../assets/images/nav-icon-3.png')}
                style={[styles.icon, { tintColor: focused ? '#D9261C' : '#7B7D9D' }]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Image 
                source={require('../../assets/images/nav-icon-5.png')}
                style={[styles.icon, { tintColor: focused ? '#D9261C' : '#7B7D9D' }]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    backgroundColor: '#FFE8E8',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
}); 