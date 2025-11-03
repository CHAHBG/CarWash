import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import React from 'react'
import {images} from "@/constants";
import {useCartStore} from "@/store/cart.store";
import {router} from "expo-router";

const CartButton = () => {
    const { getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    return (
        <TouchableOpacity className="cart-btn" onPress={()=> router.push('/cart')}>
            <Image source={images.bag} style={styles.icon} resizeMode="contain" />

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
    icon: {
        width: 22,
        height: 22,
    },
});
