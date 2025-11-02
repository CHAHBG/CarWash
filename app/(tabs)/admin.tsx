import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { checkData, seedAllData, importCategories, importMenu } from '@/lib/seedCarWash';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ categoriesCount: number; menuCount: number } | null>(null);

  const handleCheckData = async () => {
    setLoading(true);
    try {
      const result = await checkData();
      setStats(result);
      Alert.alert(
        '📊 Données actuelles',
        `Catégories: ${result?.categoriesCount || 0}\nProduits: ${result?.menuCount || 0}`
      );
    } catch (error: any) {
      Alert.alert('❌ Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCategories = async () => {
    Alert.alert(
      '⚠️ Confirmation',
      'Importer 15 catégories ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Importer',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await importCategories();
              Alert.alert(
                '✅ Succès',
                `${result.success}/${result.total} catégories importées`
              );
              handleCheckData();
            } catch (error: any) {
              Alert.alert('❌ Erreur', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleImportMenu = async () => {
    Alert.alert(
      '⚠️ Confirmation',
      'Importer 65 produits ?\nCela peut prendre 1-2 minutes.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Importer',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await importMenu();
              Alert.alert(
                '✅ Succès',
                `${result.success}/${result.total} produits importés`
              );
              handleCheckData();
            } catch (error: any) {
              Alert.alert('❌ Erreur', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleImportAll = async () => {
    Alert.alert(
      '⚠️ Confirmation',
      'Importer TOUT ?\n• 15 catégories\n• 65 produits\n\nCela peut prendre 2-3 minutes.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout importer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await seedAllData();
              Alert.alert(
                '✅ Import terminé',
                `Catégories: ${result.categoriesResult.success}/${result.categoriesResult.total}\nProduits: ${result.menuResult.success}/${result.menuResult.total}`
              );
              handleCheckData();
            } catch (error: any) {
              Alert.alert('❌ Erreur', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <Text className="text-3xl font-bold mt-6 mb-2">Admin</Text>
        <Text className="text-gray-600 mb-6">Gestion de la base de données</Text>

        {/* Stats */}
        {stats && (
          <View className="bg-blue-50 rounded-2xl p-4 mb-6">
            <Text className="text-lg font-semibold mb-2">📊 Données actuelles</Text>
            <Text className="text-gray-700">Catégories: {stats.categoriesCount}</Text>
            <Text className="text-gray-700">Produits: {stats.menuCount}</Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View className="bg-yellow-50 rounded-2xl p-4 mb-6 flex-row items-center">
            <ActivityIndicator size="small" color="#f59e0b" />
            <Text className="ml-3 text-yellow-800">Opération en cours...</Text>
          </View>
        )}

        {/* Instructions */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold mb-2">📝 Instructions</Text>
          <Text className="text-xs text-gray-600 mb-1">
            1. Vérifier d&apos;abord les données existantes
          </Text>
          <Text className="text-xs text-gray-600 mb-1">
            2. Importer les catégories (15)
          </Text>
          <Text className="text-xs text-gray-600 mb-1">
            3. Importer les produits (65)
          </Text>
          <Text className="text-xs text-gray-600">
            Ou utiliser &quot;Tout importer&quot; pour importer en une fois
          </Text>
        </View>

        {/* Buttons */}
        <View className="mb-4">
          <CustomButton
            title="📊 Vérifier les données"
            onPress={handleCheckData}
            style="bg-white border border-gray-300"
            textStyle="text-gray-800"
            isLoading={loading}
          />
        </View>

        <View className="mb-4">
          <CustomButton
            title="📁 Importer les catégories (15)"
            onPress={handleImportCategories}
            style="bg-blue-600"
            isLoading={loading}
          />
        </View>

        <View className="mb-4">
          <CustomButton
            title="🍔 Importer les produits (65)"
            onPress={handleImportMenu}
            style="bg-green-600"
            isLoading={loading}
          />
        </View>

        <View className="mb-6">
          <CustomButton
            title="🚀 Tout importer (15 + 65)"
            onPress={handleImportAll}
            style="bg-red-600"
            isLoading={loading}
          />
        </View>

        {/* Warnings */}
        <View className="bg-orange-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-orange-800 mb-2">⚠️ Important</Text>
          <Text className="text-xs text-orange-700 mb-1">
            • Assurez-vous que les collections existent dans Appwrite
          </Text>
          <Text className="text-xs text-orange-700 mb-1">
            • N&apos;importez pas plusieurs fois (risque de doublons)
          </Text>
          <Text className="text-xs text-orange-700">
            • L&apos;import peut prendre 2-3 minutes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin;
