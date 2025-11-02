import {FlatList, Text, View, TouchableOpacity, Image} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import {getCategories, getMenu} from "@/lib/appwrite";
import {useState, useEffect} from "react";
import CartButton from "@/components/CartButton";
import cn from "clsx";
import {MenuItem} from "@/type";
import { useCartStore } from "@/store/cart.store";
import { useLocalSearchParams } from "expo-router";

const Menu = () => {
    const params = useLocalSearchParams<{category?: string}>();
    const [selectedCategory, setSelectedCategory] = useState<string>(params.category || '');
    
    useEffect(() => {
        if (params.category !== undefined) {
            setSelectedCategory(params.category);
        }
    }, [params.category]);
    
    // Mapper les catégories spéciales vers plusieurs catégories réelles
    const getCategoryFilter = (category: string): string[] => {
        if (category === 'boissons') {
            return ['jus', 'cafe']; // Jus Naturel + Café
        }
        if (category === 'grillades') {
            return ['poulet-grille']; // Poulet Grillé
        }
        if (category === '') {
            return []; // Tous les produits
        }
        return [category]; // Catégorie simple
    };
    
    const categoryFilters = getCategoryFilter(selectedCategory);
    
    const { data: menu, loading } = useAppwrite({ 
        fn: getMenu, 
        params: { 
            category: '', // Charger tous les produits
            query: '', 
            limit: 100 
        } 
    });
    
    const { data: categories } = useAppwrite({ fn: getCategories });
    const { addItem } = useCartStore();

    // Filtrer les données côté client selon la catégorie sélectionnée
    const filteredMenu = menu?.filter((item: any) => {
        if (selectedCategory === '') return true; // Tout afficher
        if (categoryFilters.length > 0) {
            return categoryFilters.includes(item.category);
        }
        return item.category === selectedCategory;
    }) || [];

    const handleAddToCart = (item: MenuItem) => {
        addItem({
            id: item.$id,
            name: item.name,
            price: item.price,
            image_url: item.image || '',
            customizations: []
        });
    };

    const CategoryFilter = () => (
        <View className="mb-6">
            <View className="flex-row flex-wrap gap-3">
                <TouchableOpacity
                    className={cn(
                        "px-5 py-3 rounded-full",
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
                            "px-5 py-3 rounded-full",
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
            </View>
        </View>
    );

    const MenuItemCard = ({ item }: { item: MenuItem }) => (
        <TouchableOpacity 
            className="bg-white rounded-3xl mb-5 overflow-hidden"
            activeOpacity={0.7}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 8,
            }}
        >
            <View className="flex-row h-40">
                {/* Image - Prend toute la hauteur */}
                <View className="w-36 bg-gray-100 items-center justify-center overflow-hidden">
                    {item.image ? (
                        <Image 
                            source={{ uri: item.image }} 
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text className="text-6xl">🍽️</Text>
                    )}
                </View>

                {/* Contenu */}
                <View className="flex-1 p-4 justify-between">
                    <View>
                        <Text className="text-xl font-extrabold text-gray-900 mb-2" numberOfLines={1}>
                            {item.name}
                        </Text>
                        
                        <Text className="text-xs text-gray-500 leading-5" numberOfLines={3}>
                            {item.description}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-extrabold" style={{color: '#E63946'}}>
                                {item.price}
                            </Text>
                            <Text className="text-xs text-gray-500 font-medium">FCFA</Text>
                        </View>

                        <TouchableOpacity
                            className="px-6 py-3 rounded-full"
                            style={{backgroundColor: '#E63946'}}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                            }}
                        >
                            <Text className="text-white text-sm font-extrabold">
                                Ajouter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1" style={{backgroundColor: '#F9FAFB'}}>
            <FlatList
                data={filteredMenu}
                renderItem={({ item }) => <MenuItemCard item={item as MenuItem} />}
                keyExtractor={item => item.$id}
                contentContainerClassName="px-5 pb-32"
                ListHeaderComponent={() => (
                    <View className="my-6">
                        <View className="flex-between flex-row w-full mb-6">
                            <View className="flex-start">
                                <Text className="text-3xl font-extrabold text-gray-900">
                                    MENU DU JOUR
                                </Text>
                                <Text className="text-base text-gray-500 mt-1 font-medium">
                                    Nos délicieux plats
                                </Text>
                            </View>

                            <CartButton />
                        </View>

                        <CategoryFilter />
                    </View>
                )}
                ListEmptyComponent={() => (
                    !loading && (
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-500 text-center">
                                Aucun produit disponible
                            </Text>
                        </View>
                    )
                )}
            />
        </SafeAreaView>
    )
}

export default Menu
