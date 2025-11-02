import {Text, FlatList, TouchableOpacity, Platform} from 'react-native'
import {Category} from "@/type";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useMemo, useState} from "react";
import cn from "clsx";

const Filter = ({ categories }: { categories?: Category[] | null }) => {
    const searchParams = useLocalSearchParams<{ category?: string | string[] }>();
    const paramCategory = Array.isArray(searchParams.category)
        ? searchParams.category[0]
        : searchParams.category;
    const safeCategory = paramCategory && paramCategory.length > 0 ? paramCategory : 'all';
    const [active, setActive] = useState(safeCategory);

    useEffect(() => {
        setActive(safeCategory);
    }, [safeCategory]);

    const handlePress = (id: string) => {
        setActive(id);

        if (id === 'all') router.setParams({ category: undefined });
        else router.setParams({ category: id });
    };

    const filterData = useMemo(
        () => [
            { id: 'all', name: 'Tout', icon: '' },
            ...((categories ?? []).map((cat) => ({
                id: cat.slug ?? cat.$id,
                name: cat.name,
                icon: cat.icon ?? '',
            }))),
        ],
        [categories]
    );

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.id}
                    className={cn('filter', active === item.id ? 'bg-amber-500' : 'bg-white')}
                    style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787'} : {}}
                    onPress={() => handlePress(item.id)}
                >
                    <Text className={cn('body-medium', active === item.id ? 'text-white' : 'text-gray-200')}>
                        {item.icon ? `${item.icon} ${item.name}` : item.name}
                    </Text>
                </TouchableOpacity>
            )}
        />
    )
}
export default Filter
