import {FlatList, Text, View, useWindowDimensions} from 'react-native'
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import {getCategories, getMenu} from "@/lib/appwrite";
import {useLocalSearchParams} from "expo-router";
import {useEffect} from "react";
import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import {Category, MenuItem} from "@/type";

import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";

const Search = () => {
    const params = useLocalSearchParams<{ query?: string | string[]; category?: string | string[] }>();
    const limit = 20;
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isNarrowScreen = width < 360;
    const horizontalPadding = Math.max(16, Math.min(24, width * 0.06));
    const columnGap = isNarrowScreen ? 12 : 16;
    const cardOffset = columnGap * 0.6;
    const cardWidth = (width - horizontalPadding * 2 - columnGap) / 2;
    const bottomPadding = Math.max(24, insets.bottom + 24);

    const activeCategory = Array.isArray(params.category)
        ? params.category[0]
        : params.category ?? '';
    const searchQuery = Array.isArray(params.query) ? params.query[0] : params.query ?? '';

    const { data, refetch, loading } = useAppwrite({
        fn: getMenu,
        params: { category: activeCategory, query: searchQuery, limit },
    });
    const { data: categories } = useAppwrite({ fn: getCategories });
    const categoryList = Array.isArray(categories) ? (categories as unknown as Category[]) : null;

    useEffect(() => {
        refetch({ category: activeCategory, query: searchQuery, limit });
    }, [activeCategory, searchQuery, limit, refetch]);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={data ?? []}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            width: cardWidth,
                            marginBottom: columnGap,
                            marginTop: index % 2 === 1 ? cardOffset : 0,
                        }}
                    >
                        <MenuCard item={item as MenuItem} />
                    </View>
                )}
                keyExtractor={item => item.$id}
                numColumns={2}
                columnWrapperStyle={{
                    columnGap,
                    justifyContent: 'space-between',
                }}
                contentContainerStyle={{
                    paddingHorizontal: horizontalPadding,
                    paddingBottom: bottomPadding,
                    paddingTop: 20,
                }}
                ListHeaderComponent={() => (
                    <View className="mb-6 gap-5">
                        <View className="flex-between flex-row w-full">
                            <View className="flex-start">
                                <Text className="small-bold uppercase" style={{color: '#E63946'}}>Rechercher</Text>
                                <View className="flex-start flex-row gap-x-1 mt-0.5">
                                    <Text className="paragraph-semibold text-dark-100">Trouvez votre plat favori</Text>
                                </View>
                            </View>

                            <CartButton />
                        </View>

                        <SearchBar />

                        <Filter categories={categoryList} />
                    </View>
                )}
                ListEmptyComponent={() => !loading && <Text className="text-center text-gray-500">Aucun résultat trouvé</Text>}
            />
        </SafeAreaView>
    )
}

export default Search
