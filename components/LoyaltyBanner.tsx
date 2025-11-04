/**
 * Composant de bannière de fidélisation
 * Incite les utilisateurs non connectés à créer un compte
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useAuthStore from '@/store/auth.store';

interface LoyaltyBannerProps {
    showOnHome?: boolean;
    onDismiss?: () => void;
}

const LOYALTY_POINTS = '1 280';

const LoyaltyBanner = ({ showOnHome = false, onDismiss }: LoyaltyBannerProps) => {
    const { isAuthenticated } = useAuthStore();

    // Ne pas afficher si l'utilisateur est connecté
    if (isAuthenticated) return null;

    const handleSignUp = () => {
        router.push('/sign-up');
    };
    return (
        <View
            className="border rounded-3xl p-5"
            style={{ backgroundColor: '#FFF6DF', borderColor: '#FCD34D' }}
        >
            <View className="flex-row items-start">
                <Text className="text-3xl mr-3">🎁</Text>
                <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base font-bold text-dark-100">
                            Points fidélité disponibles
                        </Text>
                        {showOnHome && (
                            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(230,57,70,0.12)' }}>
                                <Text className="text-xs font-semibold" style={{ color: '#E63946' }}>
                                    {LOYALTY_POINTS} pts
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-sm text-gray-700 mt-2">
                        {showOnHome
                            ? "Activez votre compte pour débloquer les avantages et suivre vos points."
                            : "En créant un compte, vos commandes génèrent automatiquement des récompenses."
                        }
                    </Text>
                </View>
                {onDismiss && (
                    <TouchableOpacity onPress={onDismiss} className="-mt-1 ml-2">
                        <Text className="text-gray-400 text-lg">×</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                onPress={handleSignUp}
                className="mt-4 py-3 rounded-full items-center"
                style={{ backgroundColor: '#E63946' }}
            >
                <Text className="text-white font-semibold text-base">
                    Créer mon compte
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/sign-in')}
                className="mt-2 py-2 items-center"
            >
                <Text className="text-sm" style={{ color: '#E63946' }}>
                    J&apos;ai déjà un compte
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoyaltyBanner;
