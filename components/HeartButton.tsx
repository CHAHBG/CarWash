import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import useFavoritesStore from '@/store/favorites.store';

interface HeartButtonProps {
    itemId: string;
    itemName: string;
    itemPrice: number;
    itemImage: string;
    itemCategory: string;
    size?: number;
    onToggle?: (isFavorite: boolean) => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({
    itemId,
    itemName,
    itemPrice,
    itemImage,
    itemCategory,
    size = 24,
    onToggle,
}) => {
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isItemFavorite = isFavorite(itemId);

    const handlePress = () => {
        // Animate the heart
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Toggle favorite status
        if (isItemFavorite) {
            removeFromFavorites(itemId);
            onToggle?.(false);
        } else {
            addToFavorites({
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage,
                category: itemCategory,
            });
            onToggle?.(true);
        }
    };

    useEffect(() => {
        // Reset animation when favorite status changes
        scaleAnim.setValue(1);
    }, [isItemFavorite, scaleAnim]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className="p-2"
        >
            <Animated.Text
                style={{
                    fontSize: size,
                    transform: [{ scale: scaleAnim }],
                }}
            >
                {isItemFavorite ? '❤️' : '🤍'}
            </Animated.Text>
        </TouchableOpacity>
    );
};

export default HeartButton;