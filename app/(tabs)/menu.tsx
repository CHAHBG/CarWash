import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAppwrite from '@/lib/useAppwrite';
import { getCategories, getMenu } from '@/lib/appwrite';
import MenuItemCard from '@/components/MenuItemCard';
import { MenuItem as DBMenuItem } from '@/type';
import { MenuItem as EnrichedMenuItem } from '@/types/menu.types';
import { getCustomizationsForItem } from '@/lib/customizationData';
import CartButton from '@/components/CartButton';
import cn from 'clsx';

const Menu = () => {
    const params = useLocalSearchParams<{category?: string}>();
    const [selectedCategory, setSelectedCategory] = useState<string>(params.category || '');
    const insets = useSafeAreaInsets();
    
    useEffect(() => {
        if (params.category !== undefined) {
            setSelectedCategory(params.category);
        }
    }, [params.category]);
    
    // Fetch all menu items
    const { data: menu, loading } = useAppwrite({ 
        fn: getMenu, 
        params: { 
            category: '', 
            query: '', 
            limit: 100 
        } 
    });
    
    const { data: categories } = useAppwrite({ fn: getCategories });
    
    // Convert database menu items to enriched menu items with customizations
    const convertToEnrichedMenuItem = (item: DBMenuItem): EnrichedMenuItem => {
        // Use local customizations (database presets can be added later)
        // For now, keep using the smart local assignment
        const customizations = getCustomizationsForItem(item.name, item.category);
        
        return {
            id: item.$id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            customizations: customizations,
            preparationTime: item.preparationTime || 15,
            isPopular: item.featured || false,
        };
    };
    
    // Filter items based on selected category
    const filteredMenu = (menu as DBMenuItem[] | undefined)?.filter((item) => {
        if (selectedCategory === '') return true;
        return item.category === selectedCategory;
    }).map(convertToEnrichedMenuItem) || [];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar 
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
                backgroundColor="#F9FAFB" 
            />
            
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    >
                        <Text className="text-gray-600 font-bold text-lg">←</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-quicksand-bold text-gray-900">Notre Menu</Text>
                    <CartButton />
                </View>
            </View>

            {/* Categories */}
            <View className="mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="py-4"
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                >
                    <TouchableOpacity
                        className={cn(
                            "px-5 py-3 rounded-full mr-3",
                            selectedCategory === '' 
                                ? "border-2" 
                                : "bg-white border border-gray-200"
                        )}
                        style={selectedCategory === '' ? {
                            backgroundColor: '#E63946',
                            borderColor: '#E63946',
                        } : {}}
                        onPress={() => setSelectedCategory('')}
                    >
                        <Text className={cn(
                            "text-sm font-semibold",
                            selectedCategory === '' ? "text-white" : "text-gray-700"
                        )}>
                            Tout
                        </Text>
                    </TouchableOpacity>

                    {categories?.map((cat: any) => {
                        const isActive = selectedCategory === cat.slug;
                        return (
                            <TouchableOpacity
                                key={cat.$id}
                                className={cn(
                                    "px-5 py-3 rounded-full mr-3",
                                    isActive ? "border-2" : "bg-white border border-gray-200"
                                )}
                                style={isActive ? {
                                    backgroundColor: '#E63946',
                                    borderColor: '#E63946',
                                } : {}}
                                onPress={() => setSelectedCategory(cat.slug)}
                            >
                                <Text className={cn(
                                    "text-sm font-bold",
                                    isActive ? "text-white" : "text-gray-700"
                                )}>
                                    {cat.icon} {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Menu Items */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                    paddingBottom: insets.bottom + 100,
                    paddingTop: 8 
                }}
            >
                {loading ? (
                    <View className="flex-1 items-center justify-center py-12">
                        <ActivityIndicator size="large" color="#E63946" />
                        <Text className="text-gray-600 mt-4">Chargement du menu...</Text>
                    </View>
                ) : filteredMenu.length > 0 ? (
                    <View>
                        <Text className="text-lg font-quicksand-bold text-gray-900 mb-4">
                            {filteredMenu.length} plat{filteredMenu.length > 1 ? 's' : ''} disponible{filteredMenu.length > 1 ? 's' : ''}
                        </Text>
                        {filteredMenu.map((item: EnrichedMenuItem) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </View>
                ) : (
                    <View className="items-center py-12">
                        <Text className="text-6xl mb-4">🍽️</Text>
                        <Text className="text-lg font-quicksand-semibold text-gray-600 text-center">
                            Aucun plat disponible
                        </Text>
                        <Text className="text-sm text-gray-500 text-center mt-2">
                            {selectedCategory ? 'dans cette catégorie pour le moment' : 'pour le moment'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Menu;
