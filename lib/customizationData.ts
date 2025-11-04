import { CustomizationCategory, CustomizationOption } from '@/types/menu.types';
import { images } from '@/constants';

// Sauce customizations
export const sauceOptions: CustomizationOption[] = [
    {
        id: 'ketchup',
        name: 'Ketchup',
        price: 0,
        icon: '🍅',
        category: 'sauce',
    },
    {
        id: 'mayo',
        name: 'Mayonnaise',
        price: 0,
        icon: '🥚',
        category: 'sauce',
    },
    {
        id: 'mustard',
        name: 'Moutarde',
        price: 0,
        icon: '🌭',
        category: 'sauce',
    },
    {
        id: 'bbq',
        name: 'Sauce BBQ',
        price: 200,
        icon: '🔥',
        category: 'sauce',
    },
    {
        id: 'yassa',
        name: 'Sauce Yassa',
        price: 300,
        icon: '🌶️',
        category: 'sauce',
    },
];

// Topping customizations with local images
export const toppingOptions: CustomizationOption[] = [
    {
        id: 'onions',
        name: 'Oignons',
        price: 200,
        image: images.onions,
        icon: '🧅',
        category: 'topping',
        maxQuantity: 3,
    },
    {
        id: 'tomatoes',
        name: 'Tomates',
        price: 200,
        image: images.tomatoes,
        icon: '🍅',
        category: 'topping',
        maxQuantity: 3,
    },
    {
        id: 'cheese',
        name: 'Fromage',
        price: 300,
        image: images.cheese,
        icon: '🧀',
        category: 'topping',
        maxQuantity: 2,
    },
    {
        id: 'avocado',
        name: 'Avocat',
        price: 400,
        image: images.avocado,
        icon: '🥑',
        category: 'topping',
        maxQuantity: 2,
    },
    {
        id: 'bacon',
        name: 'Bacon',
        price: 500,
        image: images.bacon,
        icon: '🥓',
        category: 'topping',
        maxQuantity: 2,
    },
    {
        id: 'mushrooms',
        name: 'Champignons',
        price: 300,
        image: images.mushrooms,
        icon: '🍄',
        category: 'topping',
        maxQuantity: 2,
    },
    {
        id: 'cucumber',
        name: 'Concombre',
        price: 150,
        image: images.cucumber,
        icon: '🥒',
        category: 'topping',
        maxQuantity: 3,
    },
];

// Side customizations with local images
export const sideOptions: CustomizationOption[] = [
    {
        id: 'fries',
        name: 'Frites',
        price: 500,
        image: images.fries,
        icon: '🍟',
        category: 'side',
    },
    {
        id: 'salad',
        name: 'Salade',
        price: 400,
        image: images.salad,
        icon: '🥗',
        category: 'side',
    },
    {
        id: 'onion-rings',
        name: 'Rondelles d\'Oignon',
        price: 600,
        image: images.onionRings,
        icon: '🍱',
        category: 'side',
    },
    {
        id: 'coleslaw',
        name: 'Coleslaw',
        price: 400,
        image: images.coleslaw,
        icon: '🥬',
        category: 'side',
    },
];

// Drink customizations
export const drinkOptions: CustomizationOption[] = [
    {
        id: 'water',
        name: 'Eau',
        price: 300,
        image: images.drinks,
        icon: '💧',
        category: 'drink',
    },
    {
        id: 'coca',
        name: 'Coca-Cola',
        price: 500,
        image: images.drinks,
        icon: '🥤',
        category: 'drink',
    },
    {
        id: 'juice',
        name: 'Jus Bissap',
        price: 600,
        image: images.drinks,
        icon: '🧃',
        category: 'drink',
    },
    {
        id: 'ginger',
        name: 'Jus Gingembre',
        price: 700,
        image: images.drinks,
        icon: '🌿',
        category: 'drink',
    },
];

// Protein options
export const proteinOptions: CustomizationOption[] = [
    {
        id: 'chicken',
        name: 'Poulet Grillé',
        price: 800,
        image: images.grilledChicken,
        icon: '🍗',
        category: 'protein',
    },
    {
        id: 'beef',
        name: 'Bœuf',
        price: 1000,
        icon: '🥩',
        category: 'protein',
    },
    {
        id: 'fish',
        name: 'Poisson',
        price: 900,
        icon: '🐟',
        category: 'protein',
    },
];

// Predefined customization categories
export const burgerCustomizations: CustomizationCategory[] = [
    {
        id: 'sauces',
        name: 'Sauces',
        description: 'Choisissez vos sauces',
        required: false,
        multiSelect: true,
        maxSelections: 3,
        options: sauceOptions,
    },
    {
        id: 'toppings',
        name: 'Garnitures',
        description: 'Personnalisez avec des garnitures',
        required: false,
        multiSelect: true,
        maxSelections: 5,
        options: toppingOptions,
    },
    {
        id: 'sides',
        name: 'Accompagnements',
        description: 'Choisissez un accompagnement',
        required: false,
        multiSelect: false,
        options: sideOptions,
    },
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: drinkOptions,
    },
];

export const yassaCustomizations: CustomizationCategory[] = [
    {
        id: 'protein',
        name: 'Protéine',
        description: 'Choisissez votre protéine',
        required: true,
        multiSelect: false,
        options: proteinOptions,
    },
    {
        id: 'spice',
        name: 'Niveau de Piquant',
        description: 'À quel point voulez-vous le piquant?',
        required: false,
        multiSelect: false,
        options: [
            { id: 'mild', name: 'Doux', price: 0, icon: '😌', category: 'base' },
            { id: 'medium', name: 'Moyen', price: 0, icon: '🌶️', category: 'base' },
            { id: 'hot', name: 'Piquant', price: 0, icon: '🔥', category: 'base' },
            { id: 'very-hot', name: 'Très Piquant', price: 0, icon: '🌋', category: 'base' },
        ],
    },
    {
        id: 'sides',
        name: 'Accompagnements',
        description: 'Choisissez un accompagnement',
        required: false,
        multiSelect: false,
        options: sideOptions,
    },
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: drinkOptions,
    },
];

export const thiebouCustomizations: CustomizationCategory[] = [
    {
        id: 'fish-type',
        name: 'Type de Poisson',
        description: 'Choisissez votre poisson',
        required: true,
        multiSelect: false,
        options: [
            { id: 'thiof', name: 'Thiof', price: 0, icon: '🐟', category: 'protein' },
            { id: 'yete', name: 'Yété', price: 200, icon: '🐠', category: 'protein' },
            { id: 'sole', name: 'Sole', price: 300, icon: '🐡', category: 'protein' },
        ],
    },
    {
        id: 'vegetables',
        name: 'Légumes',
        description: 'Ajoutez des légumes supplémentaires',
        required: false,
        multiSelect: true,
        maxSelections: 4,
        options: [
            { id: 'carrot', name: 'Carotte', price: 100, icon: '🥕', category: 'topping' },
            { id: 'cabbage', name: 'Chou', price: 100, icon: '🥬', category: 'topping' },
            { id: 'eggplant', name: 'Aubergine', price: 150, icon: '🍆', category: 'topping' },
            { id: 'okra', name: 'Gombo', price: 150, icon: '🌱', category: 'topping' },
        ],
    },
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: drinkOptions,
    },
];

// Helper function to get customizations by menu item name or category
export const getCustomizationsForItem = (itemName: string, category: string): CustomizationCategory[] => {
    const lowerName = itemName.toLowerCase();
    
    // Check for specific items
    if (lowerName.includes('burger') || lowerName.includes('sandwich')) {
        return burgerCustomizations;
    }
    
    if (lowerName.includes('yassa')) {
        return yassaCustomizations;
    }
    
    if (lowerName.includes('thieb') || lowerName.includes('ceeb')) {
        return thiebouCustomizations;
    }
    
    // Default customizations based on category
    switch (category.toLowerCase()) {
        case 'burgers':
        case 'sandwichs':
            return burgerCustomizations;
        case 'plats':
        case 'traditionnel':
            return [
                {
                    id: 'sides',
                    name: 'Accompagnements',
                    description: 'Choisissez un accompagnement',
                    required: false,
                    multiSelect: false,
                    options: sideOptions,
                },
                {
                    id: 'drinks',
                    name: 'Boissons',
                    description: 'Ajoutez une boisson',
                    required: false,
                    multiSelect: false,
                    options: drinkOptions,
                },
            ];
        default:
            return [
                {
                    id: 'drinks',
                    name: 'Boissons',
                    description: 'Ajoutez une boisson',
                    required: false,
                    multiSelect: false,
                    options: drinkOptions,
                },
            ];
    }
};
