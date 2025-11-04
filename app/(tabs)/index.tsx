import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Image,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import cn from 'clsx';
import { router } from 'expo-router';

import CartButton from '@/components/CartButton';
import LoyaltyBanner from '@/components/LoyaltyBanner';
import NotificationBell from '@/components/NotificationBell';
import OrderTrackingWidget from '@/components/OrderTrackingWidget';
import { images, offers } from '@/constants';
import useAuthStore from '@/store/auth.store';

const RESTAURANT_PHONE = process.env.EXPO_PUBLIC_RESTAURANT_PHONE || '+221 77 587 53 47';
const RESTAURANT_CITY = process.env.EXPO_PUBLIC_RESTAURANT_CITY || 'TAMBACOUNDA';
const RESTAURANT_COUNTRY = process.env.EXPO_PUBLIC_RESTAURANT_COUNTRY || 'Sénégal';
const RESTAURANT_LOCATION = `${RESTAURANT_CITY}, ${RESTAURANT_COUNTRY}`;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const SAFE_AREA_EDGES: Edge[] = Platform.OS === 'ios' ? ['top', 'left', 'right'] : ['top', 'right', 'bottom', 'left'];

export default function Index() {
    const { isAuthenticated } = useAuthStore();
    const [showHeroCard, setShowHeroCard] = useState(true);
    const [showLoyaltyBanner, setShowLoyaltyBanner] = useState(true);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Remove animation that causes elements to start at bottom
        // Content should be immediately visible
    }, []);

    const horizontalPadding = Math.max(20, Math.min(24, width * 0.06));
    const baseTabHeight = width < 360 ? 56 : 64;
    const inferredTabPadding = insets.bottom > 0 ? Math.max(16, insets.bottom) : 18;
    const floatingGap = insets.bottom > 0 ? Math.max(12, insets.bottom / 2) : 14;
    const scrollBottomPadding = baseTabHeight + inferredTabPadding + floatingGap;
    const scrollTopPadding = Math.max(insets.top + 16, 28);

    const heroFacts = useMemo(
        () => [
            { label: 'Temps moyen', value: '25 min' },
            { label: "Commandes aujourd'hui", value: '42' },
            { label: 'Points fidélité disponibles', value: '1 280' },
        ],
        [],
    );

    const handleCall = useCallback(() => {
        Linking.openURL(`tel:${RESTAURANT_PHONE.replace(/\s/g, '')}`);
    }, []);

    const handleOpenMap = useCallback(() => {
        const encodedLocation = encodeURIComponent(RESTAURANT_LOCATION);
        const url = Platform.OS === 'ios'
            ? `http://maps.apple.com/?q=${encodedLocation}`
            : `https://maps.google.com/?q=${encodedLocation}`;

        Linking.openURL(url).catch(() => {
            router.push('/profile');
        });
    }, []);

    const handleOfferPress = useCallback((category: string) => {
        router.push({ pathname: '/menu', params: { category } });
    }, []);

    const renderOffer = useCallback(
        (item: (typeof offers)[number], index: number) => {
            const isEven = index % 2 === 0;

            return (
                <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.88}
                    className={cn('offer-card mt-4', isEven ? 'flex-row-reverse' : 'flex-row')}
                    style={[styles.offerCard, { backgroundColor: item.color }]}
                    onPress={() => handleOfferPress(item.category)}
                >
                    <View className="h-full w-1/2">
                        <Image source={item.image} className="size-full" resizeMode="contain" />
                    </View>
                    <View className={cn('offer-card__info', isEven ? 'pl-10' : 'pr-10')}>
                        <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                        <Image source={images.arrowRight} style={styles.offerArrow} resizeMode="contain" tintColor="#ffffff" />
                    </View>
                </TouchableOpacity>
            );
        },
        [handleOfferPress],
    );

    return (
        <SafeAreaView edges={SAFE_AREA_EDGES} style={styles.screen}>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#FFFFFF" />

            <AnimatedScrollView
                contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : 'never'}
                contentContainerStyle={{
                    paddingHorizontal: horizontalPadding,
                    paddingTop: scrollTopPadding,
                    paddingBottom: scrollBottomPadding,
                }}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                bounces={Platform.OS === 'ios'}
            >
                <View>
                    <View className="flex-between flex-row w-full mb-4">
                        <View className="flex-start">
                            <Text className="small-bold" style={{ color: '#E63946' }}>Livraison à</Text>
                            <TouchableOpacity
                                className="flex-center flex-row gap-x-1 mt-0.5"
                                activeOpacity={0.8}
                                onPress={handleOpenMap}
                            >
                                <Text className="paragraph-bold text-dark-100">
                                    📍 {RESTAURANT_CITY.toUpperCase()}, {RESTAURANT_COUNTRY}
                                </Text>
                                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <NotificationBell />
                            <CartButton />
                        </View>
                    </View>

                    {showHeroCard && (
                        <View className="mb-6">
                            {/* Modern Hero Section */}
                            <View
                                className="rounded-3xl p-6 mb-4"
                                style={{ backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }}
                            >
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-1">
                                        <Text className="text-3xl font-quicksand-bold text-dark-100 mb-2">Car Wash Restaurant</Text>
                                        <Text className="text-base text-gray-600 leading-relaxed">
                                            Saveurs authentiques de {RESTAURANT_LOCATION} 🇸🇳
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setShowHeroCard(false)}
                                        className="p-2 rounded-full bg-gray-100"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-gray-400 text-lg font-bold">×</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Stats Grid */}
                                <View className="flex-row gap-3 mb-4">
                                    {heroFacts.map((fact, index) => (
                                        <View key={fact.label} className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <Text className="text-lg font-quicksand-bold text-primary mb-1">
                                                {fact.value}
                                            </Text>
                                            <Text className="text-xs text-gray-500 font-medium">
                                                {fact.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Action Buttons */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleCall}
                                        className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl"
                                        style={{ backgroundColor: '#E63946' }}
                                        activeOpacity={0.9}
                                    >
                                        <Text className="text-2xl">📞</Text>
                                        <Text className="text-white font-semibold">Commander</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleOpenMap}
                                        className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200"
                                        style={{ backgroundColor: '#F8F9FA' }}
                                        activeOpacity={0.9}
                                    >
                                        <Text className="text-2xl">📍</Text>
                                        <Text className="text-gray-700 font-semibold">Localiser</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Quick Categories */}
                            <View className="mb-4">
                                <Text className="text-lg font-quicksand-bold text-dark-100 mb-3">Catégories populaires</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3" contentContainerClassName="gap-3">
                                    {[
                                        { name: 'Plats Sénégalais', icon: '🍛', color: '#FFE4E1' },
                                        { name: 'Grillades', icon: '🔥', color: '#E8F5E8' },
                                        { name: 'Boissons', icon: '🥤', color: '#E1F0FF' },
                                        { name: 'Desserts', icon: '🍰', color: '#FFF0E6' },
                                    ].map((category) => (
                                        <TouchableOpacity
                                            key={category.name}
                                            className="px-4 py-3 rounded-2xl items-center min-w-[90px]"
                                            style={{ backgroundColor: category.color }}
                                            activeOpacity={0.8}
                                            onPress={() => router.push('/menu')}
                                        >
                                            <Text className="text-2xl mb-1">{category.icon}</Text>
                                            <Text className="text-xs font-medium text-gray-700 text-center">{category.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )}

                    {!isAuthenticated && showLoyaltyBanner && (
                        <View style={styles.loyaltyWrapper}>
                            <LoyaltyBanner showOnHome onDismiss={() => setShowLoyaltyBanner(false)} />
                        </View>
                    )}

                    <OrderTrackingWidget />

                    <Text className="text-xl font-bold text-dark-100 mb-3">Nos offres spéciales</Text>
                </View>

                {offers.map((item, index) => renderOffer(item, index))}

                <View style={{ height: insets.bottom + 32 }} />
            </AnimatedScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    offerCard: {
        borderRadius: 28,
        overflow: 'hidden',
    },
    offerArrow: {
        width: 40,
        height: 40,
        marginTop: 16,
    },
    loyaltyWrapper: {
        marginBottom: 16,
    },
    heroClose: {
        color: '#9DA3AF',
        fontSize: 22,
        lineHeight: 22,
    },
    callButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#ef476f',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.08,
        shadowRadius: 12,
        elevation: Platform.OS === 'ios' ? 0 : 3,
    },
    callEmoji: {
        fontSize: 16,
    },
});
