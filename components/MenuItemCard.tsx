import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MenuItem, SelectedCustomization } from '@/types/menu.types';
import MenuItemCustomizationModal from './MenuItemCustomizationModal';
import HeartButton from './HeartButton';
import { useCartStore } from '@/store/cart.store';

interface MenuItemCardProps {
    item: MenuItem;
    onPress?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);
    const addToCart = useCartStore((state) => state.addItem);

    const handlePress = () => {
        if (item.customizations.length > 0) {
            setShowCustomizationModal(true);
        } else {
            // Add directly to cart if no customizations
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image,
            });
        }
        onPress?.();
    };

    const handleAddToCart = (menuItem: MenuItem, customizations: SelectedCustomization[], quantity: number) => {
        const customizationPrice = customizations.reduce((sum, c) => sum + (c.price * c.quantity), 0);
        const totalItemPrice = menuItem.price + customizationPrice;

        addToCart({
            id: menuItem.id,
            name: menuItem.name,
            price: totalItemPrice,
            image_url: menuItem.image,
            customizations: customizations.map(c => ({
                id: c.optionId,
                name: c.optionId, // Option name will be displayed in cart
                price: c.price,
                type: 'customization',
                category: c.category,
                icon: '🔧',
            })),
        });
    };

    const getSpiceLevelEmoji = (level?: string) => {
        switch (level) {
            case 'mild': return '😊';
            case 'medium': return '🌶️';
            case 'hot': return '🔥';
            case 'very-hot': return '🥵';
            default: return '';
        }
    };

    return (
        <>
            <TouchableOpacity
                onPress={handlePress}
                className="bg-white rounded-3xl p-4 mb-4 border border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 4,
                }}
                activeOpacity={0.95}
            >
                <View className="relative">
                    <Image
                        source={{ uri: item.image }}
                        className="w-full h-48 rounded-2xl"
                        resizeMode="cover"
                    />
                    
                    {/* Badges */}
                    <View className="absolute top-3 left-3 flex-row gap-2">
                        {item.isPopular && (
                            <View className="px-3 py-1 rounded-full bg-orange-500">
                                <Text className="text-white text-xs font-semibold">⭐ Populaire</Text>
                            </View>
                        )}
                        {item.isVegetarian && (
                            <View className="px-3 py-1 rounded-full bg-green-500">
                                <Text className="text-white text-xs font-semibold">🌱 Végétarien</Text>
                            </View>
                        )}
                    </View>

                    {/* Heart Button */}
                    <View className="absolute top-3 right-3">
                        <HeartButton
                            itemId={item.id}
                            itemName={item.name}
                            itemPrice={item.price}
                            itemImage={item.image}
                            itemCategory={item.category}
                            size={20}
                        />
                    </View>

                    {/* Preparation Time */}
                    <View className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70">
                        <Text className="text-white text-xs font-semibold">
                            ⏱️ {item.preparationTime} min
                        </Text>
                    </View>
                </View>

                <View className="mt-4">
                    <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1 mr-3">
                            <Text className="text-lg font-quicksand-bold text-gray-900 leading-tight">
                                {item.name}
                            </Text>
                            <Text className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {item.description}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xl font-quicksand-bold text-primary">
                                {item.price} FCFA
                            </Text>
                        </View>
                    </View>

                    {/* Additional Info */}
                    <View className="flex-row items-center justify-between mt-3">
                        <View className="flex-row items-center gap-3">
                            {item.spiceLevel && (
                                <View className="flex-row items-center">
                                    <Text className="text-lg mr-1">
                                        {getSpiceLevelEmoji(item.spiceLevel)}
                                    </Text>
                                    <Text className="text-xs text-gray-500 capitalize">
                                        {item.spiceLevel}
                                    </Text>
                                </View>
                            )}
                            
                            {item.allergens && item.allergens.length > 0 && (
                                <View className="flex-row items-center">
                                    <Text className="text-xs text-orange-600 font-semibold">
                                        ⚠️ Allergènes
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handlePress}
                            className="px-4 py-2 rounded-full bg-primary"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold text-sm">
                                {item.customizations.length > 0 ? 'Personnaliser' : 'Ajouter'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            <MenuItemCustomizationModal
                visible={showCustomizationModal}
                menuItem={item}
                onClose={() => setShowCustomizationModal(false)}
                onAddToCart={handleAddToCart}
            />
        </>
    );
};

export default MenuItemCard;