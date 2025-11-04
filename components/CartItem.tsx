import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMemo } from "react";
import * as Haptics from 'expo-haptics';

import {images} from "@/constants";

const CURRENCY = process.env.EXPO_PUBLIC_CURRENCY || "FCFA";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(value));

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();

    const customizationLabel = useMemo(() => {
        if (!item.customizations?.length) return '';
        return item.customizations.map((c) => c.name).join(' • ');
    }, [item.customizations]);

    const unitPrice = useMemo(() => {
        const customTotal = item.customizations?.reduce((sum, current) => sum + current.price, 0) ?? 0;
        return item.price + customTotal;
    }, [item.customizations, item.price]);

    const lineTotal = useMemo(() => unitPrice * item.quantity, [unitPrice, item.quantity]);

    const handleDecrease = () => {
        decreaseQty(item.id, item.customizations ?? []);
        void Haptics.selectionAsync();
    };

    const handleIncrease = () => {
        increaseQty(item.id, item.customizations ?? []);
        void Haptics.selectionAsync();
    };

    const handleRemove = () => {
        removeItem(item.id, item.customizations ?? []);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    return (
        <View className="cart-item">
            <View className="flex flex-row items-center gap-x-3">
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                <View>
                    <Text className="base-bold text-dark-100">{item.name}</Text>
                    <Text className="paragraph-bold mt-1" style={{color: '#E63946'}}>
                        {formatCurrency(unitPrice)} {CURRENCY}
                    </Text>
                    {Boolean(customizationLabel) && (
                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
                            + {customizationLabel}
                        </Text>
                    )}
                    <Text className="text-[11px] text-gray-400 mt-2 uppercase tracking-wide">
                        Total: {formatCurrency(lineTotal)} {CURRENCY}
                    </Text>

                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                            onPress={handleDecrease}
                            className="cart-item__actions"
                            activeOpacity={0.9}
                        >
                            <Image
                                source={images.minus}
                                style={styles.actionIcon}
                                resizeMode="contain"
                                tintColor={"#E63946"}
                            />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={handleIncrease}
                            className="cart-item__actions"
                            activeOpacity={0.9}
                        >
                            <Image
                                source={images.plus}
                                style={styles.actionIcon}
                                resizeMode="contain"
                                tintColor={"#E63946"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleRemove}
                className="flex-center"
                activeOpacity={0.85}
            >
                <Image source={images.trash} style={styles.deleteIcon} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    actionIcon: {
        width: 14,
        height: 14,
    },
    deleteIcon: {
        width: 22,
        height: 22,
    },
});
