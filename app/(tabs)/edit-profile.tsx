import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '@/store/auth.store';
import { updateUserProfile } from '@/lib/appwrite';

const EditProfile = () => {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        defaultAddress: user?.defaultAddress || '',
        avatar: user?.avatar || '',
    });

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setFormData({ ...formData, avatar: result.assets[0].uri });
            }
        } catch {
            Alert.alert('Erreur', 'Impossible de charger l\'image');
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Erreur', 'Le nom est requis');
            return;
        }

        setLoading(true);
        try {
            // Update user profile in Appwrite
            await updateUserProfile(user?.accountId || '', {
                name: formData.name,
                phone: formData.phone,
                defaultAddress: formData.defaultAddress,
                avatar: formData.avatar,
            });

            // Update local state
            if (user) {
                setUser({
                    ...user,
                    name: formData.name,
                    phone: formData.phone,
                    defaultAddress: formData.defaultAddress,
                    avatar: formData.avatar,
                });
            }

            Alert.alert('Succès', 'Profil mis à jour avec succès', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil');
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
                    Modifier le profil
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View className="items-center py-8">
                    <View className="relative">
                        <View
                            className="w-32 h-32 rounded-full items-center justify-center overflow-hidden"
                            style={{ backgroundColor: '#F1FAEE' }}
                        >
                            {formData.avatar ? (
                                <Image
                                    source={{ uri: formData.avatar }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text className="text-5xl font-bold" style={{ color: '#E63946' }}>
                                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="absolute bottom-0 right-0 w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#E63946' }}
                        >
                            <Text className="text-white text-lg">📷</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 mt-3">
                        Appuyez pour changer la photo
                    </Text>
                </View>

                {/* Form Fields */}
                <View className="mb-6">
                    {/* Name */}
                    <View className="mb-4">
                        <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                            Nom complet <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Entrez votre nom"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Email (Read only) */}
                    <View className="mb-4">
                        <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                            Email
                        </Text>
                        <TextInput
                            value={formData.email}
                            editable={false}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-quicksand-medium bg-gray-50 text-gray-500"
                        />
                        <Text className="text-xs text-gray-500 mt-1">
                            L&apos;email ne peut pas être modifié
                        </Text>
                    </View>

                    {/* Phone */}
                    <View className="mb-4">
                        <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                            Téléphone
                        </Text>
                        <TextInput
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            placeholder="Ex: +221 77 123 45 67"
                            keyboardType="phone-pad"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Default Address */}
                    <View className="mb-4">
                        <Text className="text-sm font-quicksand-semibold text-gray-700 mb-2">
                            Adresse de livraison
                        </Text>
                        <TextInput
                            value={formData.defaultAddress}
                            onChangeText={(text) => setFormData({ ...formData, defaultAddress: text })}
                            placeholder="Ex: Rue 10, Plateau, Dakar"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-quicksand-medium"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className="py-4 rounded-2xl items-center mb-8"
                    style={{ backgroundColor: loading ? '#FCA5A5' : '#E63946' }}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-quicksand-bold text-lg">
                            Enregistrer les modifications
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;
