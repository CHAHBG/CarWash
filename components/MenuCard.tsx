import {Text, TouchableOpacity, Image, Platform, View} from 'react-native'
import {MenuItem} from "@/type";
import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item: { $id, image, name, price }}: { item: MenuItem}) => {
    // Images should blend with the card, so we render them as the header section
    const imageUrl = image?.trim() ?? '';
    const { addItem } = useCartStore();

    const shadowStyle = Platform.OS === 'android'
        ? { elevation: 6, shadowColor: '#878787' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
        };

    const handleAddToCart = () => {
        addItem({ id: $id, name, price, image_url: imageUrl, customizations: [] });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            className="bg-white rounded-3xl overflow-hidden"
            style={shadowStyle}
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: '100%', height: 140 }}
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-[140px] items-center justify-center bg-gray-100">
                    <Text className="text-4xl">🍽️</Text>
                </View>
            )}

            <View className="w-full px-4 py-4 gap-y-3">
                <Text
                    className="text-base font-quicksand-bold text-dark-100"
                    numberOfLines={2}
                >
                    {name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-quicksand-bold" style={{ color: '#E63946' }}>
                        {price} FCFA
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: '#E63946' }}
                        onPress={handleAddToCart}
                    >
                        <Text className="text-white text-xs font-quicksand-bold">Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default MenuCard
