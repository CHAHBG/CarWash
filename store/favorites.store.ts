import { create } from 'zustand';

export interface FavoriteItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    addedAt: Date;
}

interface FavoritesState {
    favorites: FavoriteItem[];
    addToFavorites: (item: Omit<FavoriteItem, 'addedAt'>) => void;
    removeFromFavorites: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],

    addToFavorites: (item) => {
        const newFavorite: FavoriteItem = {
            ...item,
            addedAt: new Date(),
        };
        set((state) => ({
            favorites: [...state.favorites, newFavorite],
        }));
    },

    removeFromFavorites: (id) => {
        set((state) => ({
            favorites: state.favorites.filter((item) => item.id !== id),
        }));
    },

    isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
    },

    clearFavorites: () => {
        set({ favorites: [] });
    },
}));

export default useFavoritesStore;