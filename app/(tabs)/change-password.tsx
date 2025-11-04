import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { updatePassword } from '@/lib/appwrite';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChangePassword = async () => {
        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            Alert.alert('Erreur', 'Tous les champs sont requis');
            return;
        }

        if (formData.newPassword.length < 8) {
            Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(formData.currentPassword, formData.newPassword);
            
            Alert.alert(
                'Succès',
                'Mot de passe modifié avec succès',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error: any) {
            Alert.alert(
                'Erreur',
                error.message || 'Impossible de modifier le mot de passe'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                >
                    <Text className="text-gray-600 font-bold text-lg">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-quicksand-bold text-gray-900">
                    Changer le mot de passe
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
                {/* Current Password */}
                <View className="mb-4">
                    <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                        Mot de passe actuel <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={formData.currentPassword}
                        onChangeText={(text) =>
                            setFormData({ ...formData, currentPassword: text })
                        }
                        placeholder="Entrez votre mot de passe actuel"
                        secureTextEntry
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* New Password */}
                <View className="mb-4">
                    <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                        Nouveau mot de passe <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={formData.newPassword}
                        onChangeText={(text) =>
                            setFormData({ ...formData, newPassword: text })
                        }
                        placeholder="Au moins 8 caractères"
                        secureTextEntry
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Confirm Password */}
                <View className="mb-6">
                    <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                        Confirmer le mot de passe <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        value={formData.confirmPassword}
                        onChangeText={(text) =>
                            setFormData({ ...formData, confirmPassword: text })
                        }
                        placeholder="Répétez le nouveau mot de passe"
                        secureTextEntry
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Info Box */}
                <View className="bg-blue-50 p-4 rounded-xl mb-6">
                    <Text className="text-sm font-quicksand-semibold text-blue-900 mb-2">
                        💡 Conseils de sécurité
                    </Text>
                    <Text className="text-sm text-blue-800 mb-1">
                        • Utilisez au moins 8 caractères
                    </Text>
                    <Text className="text-sm text-blue-800 mb-1">
                        • Mélangez lettres, chiffres et symboles
                    </Text>
                    <Text className="text-sm text-blue-800">
                        • Évitez les mots de passe évidents
                    </Text>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity
                    onPress={handleChangePassword}
                    disabled={loading}
                    className="py-4 rounded-2xl items-center mb-8"
                    style={{ backgroundColor: loading ? '#FCA5A5' : '#E63946' }}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-quicksand-bold text-lg">
                            Modifier le mot de passe
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;
