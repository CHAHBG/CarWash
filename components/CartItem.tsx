import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {images} from "@/constants";

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();

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
                        {item.price} FCFA
                    </Text>

                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                            onPress={() => decreaseQty(item.id, item.customizations ?? [])}
                            className="cart-item__actions"
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
                            onPress={() => increaseQty(item.id, item.customizations ?? [])}
                            className="cart-item__actions"
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
                onPress={() => removeItem(item.id, item.customizations ?? [])}
                className="flex-center"
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
