import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuItem, CustomizationCategory, SelectedCustomization } from '@/types/menu.types';

interface MenuItemCustomizationModalProps {
    visible: boolean;
    menuItem: MenuItem;
    onClose: () => void;
    onAddToCart: (item: MenuItem, customizations: SelectedCustomization[], quantity: number) => void;
}

const MenuItemCustomizationModal: React.FC<MenuItemCustomizationModalProps> = ({
    visible,
    menuItem,
    onClose,
    onAddToCart,
}) => {
    const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Reset state when modal closes
    React.useEffect(() => {
        if (!visible) {
            setSelectedCustomizations([]);
            setQuantity(1);
        }
    }, [visible]);

    const handleOptionSelect = (categoryId: string, optionId: string, optionPrice: number, category: CustomizationCategory) => {
        const existingIndex = selectedCustomizations.findIndex(
            (sc) => sc.optionId === optionId
        );

        if (!category.multiSelect) {
            // Single select - remove other options from this category first
            const filteredCustomizations = selectedCustomizations.filter((sc) => {
                const option = category.options.find(opt => opt.id === sc.optionId);
                return !option;
            });
            
            if (existingIndex === -1) {
                setSelectedCustomizations([
                    ...filteredCustomizations,
                    { optionId, quantity: 1, price: optionPrice, category: category.name }
                ]);
            }
        } else {
            // Multi select
            if (existingIndex >= 0) {
                // Remove if already selected
                setSelectedCustomizations(prev => 
                    prev.filter((_, index) => index !== existingIndex)
                );
            } else {
                // Check max selections
                const currentSelectionsInCategory = selectedCustomizations.filter((sc) => {
                    return category.options.some(opt => opt.id === sc.optionId);
                }).length;
                
                if (category.maxSelections && currentSelectionsInCategory >= category.maxSelections) {
                    Alert.alert(
                        'Limite atteinte', 
                        `Vous ne pouvez sélectionner que ${category.maxSelections} option(s) pour ${category.name}`
                    );
                    return;
                }
                
                setSelectedCustomizations(prev => [
                    ...prev,
                    { optionId, quantity: 1, price: optionPrice, category: category.name }
                ]);
            }
        }
    };

    const isOptionSelected = (optionId: string) => {
        return selectedCustomizations.some(sc => sc.optionId === optionId);
    };

    const calculateTotalPrice = () => {
        const customizationPrice = selectedCustomizations.reduce((sum, sc) => sum + (sc.price * sc.quantity), 0);
        return (menuItem.price + customizationPrice) * quantity;
    };

    const canAddToCart = () => {
        return menuItem.customizations.every(category => {
            if (!category.required) return true;
            return selectedCustomizations.some(sc => 
                category.options.some(opt => opt.id === sc.optionId)
            );
        });
    };

    const handleAddToCart = () => {
        if (!canAddToCart()) {
            Alert.alert('Options requises', 'Veuillez sélectionner toutes les options requises');
            return;
        }
        
        onAddToCart(menuItem, selectedCustomizations, quantity);
        onClose();
    };

    const renderCustomizationOption = (option: any, category: CustomizationCategory) => {
        const isSelected = isOptionSelected(option.id);
        
        return (
            <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionSelect(category.id, option.id, option.price, category)}
                className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-3 ${
                    isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 bg-white'
                }`}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
                        <Text className="text-2xl">{option.icon}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className={`font-quicksand-semibold text-base ${
                            isSelected ? 'text-primary' : 'text-gray-900'
                        }`}>
                            {option.name}
                        </Text>
                        {option.price !== 0 && (
                            <Text className="text-sm text-gray-500 mt-1">
                                {option.price > 0 ? '+' : ''}{option.price} FCFA
                            </Text>
                        )}
                    </View>
                </View>
                
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                }`}>
                    {isSelected && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50">
                <SafeAreaView className="flex-1" edges={['top']}>
                    <View className="flex-1 bg-white rounded-t-3xl mt-12">
                        {/* Header */}
                        <View className="p-6 border-b border-gray-100">
                            <View className="flex-row items-center justify-between mb-4">
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                                >
                                    <Text className="text-gray-600 font-bold text-lg">×</Text>
                                </TouchableOpacity>
                                <Text className="text-lg font-quicksand-bold text-gray-900">
                                    Personnaliser
                                </Text>
                                <View className="w-10" />
                            </View>
                            
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: menuItem.image }}
                                    className="w-16 h-16 rounded-2xl mr-4"
                                    resizeMode="cover"
                                />
                                <View className="flex-1">
                                    <Text className="text-xl font-quicksand-bold text-gray-900">
                                        {menuItem.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600 mt-1">
                                        {menuItem.description}
                                    </Text>
                                    <Text className="text-lg font-quicksand-bold text-primary mt-2">
                                        {menuItem.price} FCFA
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Customizations */}
                        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                            {menuItem.customizations && menuItem.customizations.length > 0 ? (
                                menuItem.customizations.map((category) => (
                                    <View key={category.id} className="mb-6">
                                        <View className="flex-row items-center justify-between mb-3">
                                            <Text className="text-lg font-quicksand-bold text-gray-900">
                                                {category.name}
                                                {category.required && (
                                                    <Text className="text-primary"> *</Text>
                                                )}
                                            </Text>
                                            {category.maxSelections && (
                                                <Text className="text-xs text-gray-500">
                                                    Max {category.maxSelections}
                                                </Text>
                                            )}
                                        </View>
                                        
                                        {category.description && (
                                            <Text className="text-sm text-gray-600 mb-4">
                                                {category.description}
                                            </Text>
                                        )}
                                        
                                        {category.options.map((option) => 
                                            renderCustomizationOption(option, category)
                                        )}
                                    </View>
                                ))
                            ) : (
                                <View className="items-center py-8">
                                    <Text className="text-gray-500">Aucune personnalisation disponible</Text>
                                </View>
                            )}
                            
                            <View className="h-32" />
                        </ScrollView>

                        {/* Footer */}
                        <View className="p-6 border-t border-gray-100 bg-white">
                            {/* Quantity Selector */}
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-base font-quicksand-semibold text-gray-900">
                                    Quantité
                                </Text>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                                    >
                                        <Text className="text-gray-600 font-bold text-lg">−</Text>
                                    </TouchableOpacity>
                                    <Text className="text-lg font-quicksand-bold text-gray-900 mx-4">
                                        {quantity}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-full bg-primary items-center justify-center"
                                    >
                                        <Text className="text-white font-bold text-lg">+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Add to Cart Button */}
                            <TouchableOpacity
                                onPress={handleAddToCart}
                                disabled={!canAddToCart()}
                                className={`py-4 rounded-2xl items-center ${
                                    canAddToCart() 
                                        ? 'bg-primary' 
                                        : 'bg-gray-300'
                                }`}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-quicksand-bold text-lg">
                                    Ajouter au panier • {calculateTotalPrice()} FCFA
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default MenuItemCustomizationModal;