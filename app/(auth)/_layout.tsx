import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Image} from 'react-native';
import {useMemo} from 'react';
import {Slot} from 'expo-router';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {images} from '@/constants';

export default function AuthLayout() {

    // Retirer la redirection automatique - permettre l'accès même si authentifié
    // if(isAuthenticated) return <Redirect href="/" />

    const heroStats = useMemo(() => ([
        { label: 'Clients satisfaits', value: '2k+' },
        { label: 'Commandes livrées', value: '8k+' },
        { label: 'Note moyenne', value: '4.9/5' },
    ]), []);

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            style={{ flex: 1, backgroundColor: '#F7F8FA' }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
                >
                    <View className="px-6 pt-12 pb-10 bg-white rounded-b-[32px] shadow-sm shadow-black/10">
                        <View className="flex-row items-center">
                            <Image source={images.logo} style={{ width: 64, height: 64 }} resizeMode="contain" />
                            <View className="ml-3">
                                <Text className="text-base font-quicksand-semibold text-gray-500">
                                    Car Wash Restaurant
                                </Text>
                                <Text className="text-2xl font-quicksand-bold text-dark-100">
                                    Authentification
                                </Text>
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mt-6"
                            contentContainerClassName="gap-3"
                        >
                            {heroStats.map((item) => (
                                <View
                                    key={item.label}
                                    className="px-4 py-3 rounded-2xl"
                                    style={{ backgroundColor: '#FDF2F4' }}
                                >
                                    <Text className="text-lg font-quicksand-bold" style={{ color: '#E63946' }}>
                                        {item.value}
                                    </Text>
                                    <Text className="text-xs text-gray-500 mt-1">{item.label}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View className="mt-8">
                        <Slot />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
