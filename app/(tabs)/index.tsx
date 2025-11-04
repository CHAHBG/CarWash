import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { images, offers } from '@/constants';
import useAuthStore from '@/store/auth.store';

const RESTAURANT_PHONE = process.env.EXPO_PUBLIC_RESTAURANT_PHONE || '+221 77 587 53 47';
const RESTAURANT_LOCATION = process.env.EXPO_PUBLIC_RESTAURANT_LOCATION || 'TAMBACOUNDA, Sénégal';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const SAFE_AREA_EDGES: Edge[] = Platform.OS === 'ios' ? ['top', 'left', 'right'] : ['top', 'right', 'bottom', 'left'];

export default function Index() {
    const { isAuthenticated } = useAuthStore();
    const [showHeroCard, setShowHeroCard] = useState(true);
    const [showLoyaltyBanner, setShowLoyaltyBanner] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, damping: 12, stiffness: 110, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const horizontalPadding = Math.max(20, Math.min(24, width * 0.06));
    const baseTabHeight = width < 360 ? 56 : 64;
    const inferredTabPadding = insets.bottom > 0 ? Math.max(16, insets.bottom) : 18;
    const floatingGap = insets.bottom > 0 ? Math.max(12, insets.bottom / 2) : 14;
    const scrollBottomPadding = baseTabHeight + inferredTabPadding + floatingGap;
    const scrollTopPadding = Math.max(insets.top + 16, 28);

    const heroFacts = useMemo(
        () => [
            { label: 'Temps moyen livraison', value: '25 min' },
            { label: "Commandes aujourd'hui", value: '42' },
            { label: 'Points fidélité actifs', value: '1 280' },
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
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View className="flex-between flex-row w-full mb-4">
                        <View className="flex-start">
                            <Text className="small-bold" style={{ color: '#E63946' }}>Livraison à</Text>
                            <TouchableOpacity
                                className="flex-center flex-row gap-x-1 mt-0.5"
                                activeOpacity={0.8}
                                onPress={handleOpenMap}
                            >
                                <Text className="paragraph-bold text-dark-100">
                                    📍 {RESTAURANT_LOCATION.toLocaleUpperCase('fr-FR')}
                                </Text>
                                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                            </TouchableOpacity>
                        </View>

                        <CartButton />
                    </View>

                    {showHeroCard && (
                        <View
                            className="rounded-[28px] p-5 mb-4"
                            style={{ backgroundColor: '#FFEFF2', borderWidth: 1.5, borderColor: '#E0D8DC' }}
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1 pr-4">
                                    <Text className="text-2xl font-quicksand-bold text-dark-100 mb-1">Car Wash Restaurant</Text>
                                    <Text className="text-sm text-gray-600">
                                        Saveurs locales & cocktails rafraîchissants à {RESTAURANT_LOCATION}.
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowHeroCard(false)}
                                    activeOpacity={0.8}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                >
                                    <Text style={styles.heroClose}>×</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center justify-between mt-5">
                                <TouchableOpacity
                                    onPress={handleCall}
                                    className="flex-row items-center gap-2 px-5 py-2 rounded-full"
                                    style={styles.callButton}
                                    activeOpacity={0.85}
                                >
                                    <Text style={styles.callEmoji}>📞</Text>
                                    <Text className="text-sm font-semibold" style={{ color: '#E63946' }}>Appeler</Text>
                                </TouchableOpacity>
                                <Text className="text-xs text-gray-500">{RESTAURANT_PHONE}</Text>
                            </View>

                            <View className="flex-row mt-4 gap-3">
                                {heroFacts.map((fact) => (
                                    <View key={fact.label} className="flex-1 px-3 py-3 rounded-3xl bg-white border border-white/40">
                                        <Text className="text-sm font-quicksand-semibold" style={{ color: '#E63946' }}>
                                            {fact.value}
                                        </Text>
                                        <Text className="text-[11px] text-gray-500 mt-1">{fact.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {!isAuthenticated && showLoyaltyBanner && (
                        <View style={styles.loyaltyWrapper}>
                            <LoyaltyBanner showOnHome onDismiss={() => setShowLoyaltyBanner(false)} />
                        </View>
                    )}

                    <Text className="text-xl font-bold text-dark-100 mb-3">Nos offres spéciales</Text>
                </Animated.View>

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
