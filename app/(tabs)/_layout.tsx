import { Tabs } from 'expo-router';
import { Image, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { images } from '@/constants';
import { TabBarIconProps } from '@/type';

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
        <Image
            source={icon}
            style={styles.iconImage}
            resizeMode="contain"
            tintColor={focused ? '#E63946' : '#7C7F8C'}
        />
        <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
            {title}
        </Text>
    </View>
);

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const isCompactWidth = width < 360;
    const horizontalMargin = isCompactWidth ? 16 : Math.min(24, width * 0.08);
    const baseHeight = isCompactWidth ? 56 : 64;
    const safeBottom = insets.bottom;
    const paddingBottom = safeBottom > 0 ? Math.max(18, safeBottom * 0.75) : 18;
    const floatingOffset = safeBottom > 0 ? Math.max(10, safeBottom * 0.55) : 12;

    const tabBarStyle = useMemo(() => ({
        borderRadius: 40,
        marginHorizontal: horizontalMargin,
        paddingHorizontal: isCompactWidth ? 18 : 28,
        paddingVertical: 6,
        height: baseHeight + paddingBottom,
        position: 'absolute' as const,
        bottom: floatingOffset,
        backgroundColor: 'transparent',
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        borderColor: 'rgba(231, 234, 242, 0.45)',
        overflow: 'hidden' as const,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: Platform.OS === 'ios' ? 0.18 : 0.12,
        shadowRadius: 24,
        elevation: Platform.OS === 'ios' ? 0 : 8,
        zIndex: 30,
    }), [horizontalMargin, isCompactWidth, paddingBottom, baseHeight, floatingOffset]);

    // Ne pas rediriger automatiquement - permettre l'accès en mode invité
    // if(!isAuthenticated) return <Redirect href="/sign-in" />

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle,
                tabBarAllowFontScaling: false,
                tabBarHideOnKeyboard: true,
                tabBarItemStyle: {
                    paddingVertical: isCompactWidth ? 6 : 10,
                },
                tabBarInactiveTintColor: '#7C7F8C',
                tabBarActiveTintColor: '#E63946',
                tabBarBackground: () => (
                    <BlurView
                        tint="light"
                        intensity={65}
                        style={[StyleSheet.absoluteFill, styles.tabBackground]}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon={images.home} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Search" icon={images.search} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='menu'
                options={{
                    href: null, // Cache de la barre de navigation mais accessible par routing
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Profile" icon={images.person} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='admin'
                options={{
                    title: 'Admin',
                    href: null, // Cache l'onglet de la navigation
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Admin" icon={images.person} focused={focused} />
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        gap: 4,
    },
    iconImage: {
        width: 24,
        height: 24,
    },
    tabIconActive: {
        backgroundColor: 'rgba(230, 57, 70, 0.12)',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: '#E63946',
        fontWeight: '600',
    },
    tabLabelInactive: {
        color: '#7C7F8C',
    },
    tabBackground: {
        borderRadius: 40,
        overflow: 'hidden',
    },
});
