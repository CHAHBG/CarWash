import {View, Text, TouchableOpacity, Image, ScrollView, Alert, Switch, StyleSheet} from 'react-native'
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import { 
    isBiometricAvailable, 
    enableBiometricAuth, 
    disableBiometricAuth 
} from '@/lib/authServices';

const styles = StyleSheet.create({
    guestIllustration: {
        width: 192,
        height: 192,
    },
    profileAvatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    primaryIcon: {
        width: 20,
        height: 20,
    },
    chevron: {
        width: 16,
        height: 16,
    },
});

const Profile = () => {
    const { user, isAuthenticated, signOut } = useAuthStore();
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<string>('');
    const insets = useSafeAreaInsets();
    const bottomSpacing = Math.max(32, insets.bottom + 16);

    useEffect(() => {
        checkBiometric();
    }, []);

    const checkBiometric = async () => {
        const result = await isBiometricAvailable();
        setBiometricAvailable(result.available);
        setBiometricType(result.type || 'Biométrique');
        
        // Vérifier si déjà activé pour cet utilisateur
        // TODO: Charger depuis le profil utilisateur
    };

    const handleToggleBiometric = async (value: boolean) => {
        if (!user) return;

        if (value) {
            // Activer
            const result = await enableBiometricAuth(user.accountId, 'session_token_placeholder');
            if (result.success) {
                setBiometricEnabled(true);
                Alert.alert('Activé', `${biometricType} activé pour une connexion rapide`);
            } else {
                Alert.alert('Erreur', result.error || 'Impossible d\'activer');
            }
        } else {
            // Désactiver
            await disableBiometricAuth(user.accountId);
            setBiometricEnabled(false);
            Alert.alert('Désactivé', `${biometricType} désactivé`);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            "Déconnexion",
            "Voulez-vous vraiment vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnecter",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/sign-in');
                    }
                }
            ]
        );
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="bg-white h-full">
                <View className="p-5 flex-1 justify-center items-center">
                    <Image 
                        source={images.emptyState} 
                        style={styles.guestIllustration}
                        className="mb-6"
                        resizeMode="contain"
                    />
                    <Text className="h2-bold text-dark-100 mb-3 text-center">
                        Créez votre compte
                    </Text>
                    <Text className="paragraph-regular text-gray-500 mb-6 text-center px-4">
                        Connectez-vous pour accéder à votre profil, suivre vos commandes et profiter des avantages de fidélité.
                    </Text>
                    
                    <TouchableOpacity
                        onPress={() => router.push('/sign-in')}
                        className="px-8 py-4 rounded-xl mb-3"
                        style={{backgroundColor: '#E63946'}}
                    >
                        <Text className="text-white font-bold text-base">Se connecter</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => router.push('/sign-up')}
                        className="px-8 py-4 rounded-xl border-2"
                        style={{borderColor: '#E63946'}}
                    >
                        <Text className="font-bold text-base" style={{color: '#E63946'}}>
                            Créer un compte
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView className="px-5 pt-5" contentContainerStyle={{ paddingBottom: bottomSpacing }}>
                {/* Welcome Message */}
                <View className="bg-gradient-to-r p-5 rounded-2xl mb-6" style={{backgroundColor: '#F1FAEE'}}>
                    <Text className="text-lg font-quicksand-semibold" style={{color: '#E63946'}}>
                        👋 Ravi de vous revoir,
                    </Text>
                    <Text className="text-2xl font-quicksand-bold text-gray-900 mt-1">
                        {user?.name || 'Utilisateur'}
                    </Text>
                </View>

                {/* En-tête du profil */}
                <View className="items-center mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/edit-profile' as any)}
                        activeOpacity={0.8}
                    >
                        <View 
                            className="rounded-full items-center justify-center mb-3"
                            style={[styles.profileAvatar, {backgroundColor: '#F1FAEE'}]}
                        >
                            {user?.avatar ? (
                                <Image 
                                    source={{ uri: user.avatar }} 
                                    style={styles.profileAvatar}
                                />
                            ) : (
                                <Text className="text-4xl font-bold" style={{color: '#E63946'}}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            )}
                        </View>
                        <View className="absolute bottom-2 right-0 w-8 h-8 rounded-full items-center justify-center" style={{backgroundColor: '#E63946'}}>
                            <Text className="text-white text-xs">✏️</Text>
                        </View>
                    </TouchableOpacity>
                    <Text className="paragraph-regular text-gray-500 mt-2">{user?.email}</Text>
                    {user?.phone && (
                        <Text className="text-sm text-gray-500">📱 {user.phone}</Text>
                    )}
                </View>

                {/* Options du profil */}
                <View className="mb-4">
                    <Text className="paragraph-bold text-dark-100 mb-3">Mon Compte</Text>
                    
                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2"
                        onPress={() => router.push('/edit-profile' as any)}
                    >
                        <View className="flex-row items-center">
                            <Image source={images.person} style={styles.primaryIcon} className="mr-3" resizeMode="contain" />
                            <Text className="paragraph-semibold text-dark-100">Modifier mon profil</Text>
                        </View>
                        <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2"
                        onPress={() => router.push('/change-password' as any)}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-lg mr-3">🔒</Text>
                            <Text className="paragraph-semibold text-dark-100">Changer le mot de passe</Text>
                        </View>
                        <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2"
                        onPress={() => Alert.alert('En développement', 'Cette fonctionnalité sera bientôt disponible')}
                    >
                        <View className="flex-row items-center">
                            <Image source={images.bag} style={styles.primaryIcon} className="mr-3" resizeMode="contain" />
                            <Text className="paragraph-semibold text-dark-100">Mes commandes</Text>
                        </View>
                        <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl"
                        onPress={() => Alert.alert('En développement', 'Cette fonctionnalité sera bientôt disponible')}
                    >
                        <View className="flex-row items-center">
                            <Image source={images.star} style={styles.primaryIcon} className="mr-3" resizeMode="contain" tintColor="#FDB022" />
                            <Text className="paragraph-semibold text-dark-100">Points de fidélité</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="font-bold mr-2" style={{color: '#E63946'}}>
                                {user?.loyaltyPoints || 0} pts
                            </Text>
                            <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Sécurité */}
                {biometricAvailable && (
                    <View className="mb-4">
                        <Text className="paragraph-bold text-dark-100 mb-3">Sécurité</Text>
                        <View className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl">
                            <View className="flex-1 mr-4">
                                <Text className="paragraph-semibold text-dark-100">{biometricType || 'Biométrique'}</Text>
                                <Text className="text-xs text-gray-500 mt-1">
                                    Activez la connexion rapide avec {biometricType || 'votre appareil'}
                                </Text>
                            </View>
                            <Switch
                                value={biometricEnabled}
                                onValueChange={handleToggleBiometric}
                                thumbColor={biometricEnabled ? '#E63946' : '#f4f3f4'}
                                trackColor={{ false: '#d1d5db', true: '#fecaca' }}
                            />
                        </View>
                    </View>
                )}

                {/* Support */}
                <View className="mb-4">
                    <Text className="paragraph-bold text-dark-100 mb-3">Support</Text>
                    
                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-2"
                        onPress={() => Alert.alert('En développement', 'Cette fonctionnalité sera bientôt disponible')}
                    >
                        <View className="flex-row items-center">
                            <Image source={images.phone} style={styles.primaryIcon} className="mr-3" resizeMode="contain" />
                            <Text className="paragraph-semibold text-dark-100">Nous contacter</Text>
                        </View>
                        <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl"
                        onPress={() => Alert.alert('En développement', 'Cette fonctionnalité sera bientôt disponible')}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-lg mr-3">❓</Text>
                            <Text className="paragraph-semibold text-dark-100">Aide & FAQ</Text>
                        </View>
                        <Image source={images.arrowRight} style={styles.chevron} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                {/* Déconnexion */}
                <TouchableOpacity 
                    className="flex-row items-center justify-center py-4 px-4 rounded-xl mt-6 mb-8"
                    style={{backgroundColor: '#FEE2E2'}}
                    onPress={handleSignOut}
                >
                    <Image source={images.logout} style={styles.primaryIcon} className="mr-3" resizeMode="contain" tintColor="#DC2626" />
                    <Text className="paragraph-bold" style={{color: '#DC2626'}}>Se déconnecter</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile
