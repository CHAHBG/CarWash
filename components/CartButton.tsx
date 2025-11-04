import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import React, { useCallback } from 'react'
import {useCartStore} from "@/store/cart.store";
import {router} from "expo-router";
import * as Haptics from 'expo-haptics';

const CartButton = () => {
    const totalItems = useCartStore((state) => state.getTotalItems());

    const handlePress = useCallback(() => {
        void Haptics.selectionAsync();
        router.push('/cart');
    }, []);

    return (
        <TouchableOpacity className="cart-btn" onPress={handlePress} activeOpacity={0.9}>
            <Text style={styles.emojiIcon}>🛒</Text>

            {totalItems > 0 && (
                <View className="cart-badge">
                    <Text className="small-bold text-white">{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}
export default CartButton

const styles = StyleSheet.create({
    emojiIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
});
