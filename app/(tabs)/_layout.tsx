import {Tabs} from "expo-router";
import {TabBarIconProps} from "@/type";
import {Image, StyleSheet, Text, View, useWindowDimensions} from "react-native";
import {images} from "@/constants";
import cn from "clsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useMemo} from "react";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View style={styles.tabIcon}>
        <Image
            source={icon}
            style={styles.iconImage}
            resizeMode="contain"
            tintColor={focused ? '#FE8C00' : '#5D5F6D'}
        />
        <Text className={cn('text-xs font-bold', focused ? 'text-primary' : 'text-gray-200')}>
            {title}
        </Text>
    </View>
)

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const isCompactWidth = width < 360;
    const horizontalMargin = isCompactWidth ? 16 : Math.min(24, width * 0.08);
    const baseHeight = isCompactWidth ? 56 : 64;
    const bottomSpacing = Math.max(insets.bottom, 10);

    const tabBarStyle = useMemo(() => ({
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginHorizontal: horizontalMargin,
        paddingHorizontal: isCompactWidth ? 16 : 24,
        paddingTop: 8,
        paddingBottom: bottomSpacing,
        height: baseHeight + bottomSpacing,
        position: 'absolute' as const,
        bottom: bottomSpacing / 2,
        backgroundColor: 'white',
        shadowColor: '#1a1a1a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
    }), [horizontalMargin, isCompactWidth, bottomSpacing, baseHeight]);

    // Ne pas rediriger automatiquement - permettre l'accès en mode invité
    // if(!isAuthenticated) return <Redirect href="/sign-in" />

    return (
        <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle,
                tabBarItemStyle: {
                    paddingVertical: isCompactWidth ? 6 : 10,
                },
            }}>
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
        gap: 4,
    },
    iconImage: {
        width: 24,
        height: 24,
    },
});
