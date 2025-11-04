import { MenuItem } from '@/types/menu.types';

export const sampleMenuItems: MenuItem[] = [
    {
        id: 'burger-001',
        name: 'Burger Tambacounda',
        description: 'Délicieux burger avec viande locale, légumes frais et sauce spéciale',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'burgers',
        preparationTime: 15,
        spiceLevel: 'medium',
        isPopular: true,
        customizations: [
            {
                id: 'burger-protein',
                name: 'Choix de viande',
                description: 'Sélectionnez votre protéine',
                required: true,
                multiSelect: false,
                options: [
                    { id: 'beef', name: 'Bœuf local', price: 0, icon: '🥩', category: 'protein' },
                    { id: 'chicken', name: 'Poulet fermier', price: -500, icon: '🐔', category: 'protein' },
                    { id: 'fish', name: 'Poisson capitaine', price: 200, icon: '🐟', category: 'protein' },
                ]
            },
            {
                id: 'burger-toppings',
                name: 'Garnitures',
                description: 'Personnalisez votre burger',
                required: false,
                multiSelect: true,
                maxSelections: 5,
                options: [
                    { id: 'onions', name: 'Oignons', price: 0, icon: '🧅', category: 'topping' },
                    { id: 'tomatoes', name: 'Tomates', price: 0, icon: '🍅', category: 'topping' },
                    { id: 'lettuce', name: 'Salade', price: 0, icon: '🥬', category: 'topping' },
                    { id: 'cheese', name: 'Fromage', price: 300, icon: '🧀', category: 'topping' },
                    { id: 'avocado', name: 'Avocat', price: 500, icon: '🥑', category: 'topping' },
                    { id: 'pickles', name: 'Cornichons', price: 200, icon: '🥒', category: 'topping' },
                ]
            },
            {
                id: 'burger-sauces',
                name: 'Sauces',
                description: 'Choisissez vos sauces préférées',
                required: false,
                multiSelect: true,
                maxSelections: 3,
                options: [
                    { id: 'ketchup', name: 'Ketchup', price: 0, icon: '🍅', category: 'sauce' },
                    { id: 'mustard', name: 'Moutarde', price: 0, icon: '🟡', category: 'sauce' },
                    { id: 'mayo', name: 'Mayonnaise', price: 0, icon: '⚪', category: 'sauce' },
                    { id: 'spicy', name: 'Sauce piquante', price: 100, icon: '🌶️', category: 'sauce' },
                    { id: 'barbecue', name: 'Sauce BBQ', price: 150, icon: '🥩', category: 'sauce' },
                ]
            },
            {
                id: 'burger-sides',
                name: 'Accompagnements',
                description: 'Ajoutez un accompagnement',
                required: false,
                multiSelect: false,
                options: [
                    { id: 'fries', name: 'Frites maison', price: 800, icon: '🍟', category: 'side' },
                    { id: 'plantain', name: 'Bananes plantain', price: 600, icon: '🍌', category: 'side' },
                    { id: 'salad', name: 'Salade verte', price: 700, icon: '🥗', category: 'side' },
                ]
            }
        ]
    },
    {
        id: 'thieb-001',
        name: 'Thieboudienne',
        description: 'Plat national sénégalais avec riz, poisson et légumes',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'plats-locaux',
        preparationTime: 25,
        spiceLevel: 'medium',
        isPopular: true,
        isVegetarian: false,
        customizations: [
            {
                id: 'thieb-fish',
                name: 'Type de poisson',
                required: true,
                multiSelect: false,
                options: [
                    { id: 'thiof', name: 'Thiof', price: 0, icon: '🐟', category: 'protein' },
                    { id: 'capitaine', name: 'Capitaine', price: 300, icon: '🐠', category: 'protein' },
                    { id: 'dorade', name: 'Dorade', price: 500, icon: '🐟', category: 'protein' },
                ]
            },
            {
                id: 'thieb-vegetables',
                name: 'Légumes',
                description: 'Sélectionnez vos légumes préférés',
                required: false,
                multiSelect: true,
                options: [
                    { id: 'carrot', name: 'Carotte', price: 0, icon: '🥕', category: 'topping' },
                    { id: 'cabbage', name: 'Chou', price: 0, icon: '🥬', category: 'topping' },
                    { id: 'eggplant', name: 'Aubergine', price: 100, icon: '🍆', category: 'topping' },
                    { id: 'okra', name: 'Gombo', price: 150, icon: '🌿', category: 'topping' },
                    { id: 'sweet-potato', name: 'Patate douce', price: 200, icon: '🍠', category: 'topping' },
                ]
            },
            {
                id: 'thieb-spice',
                name: 'Niveau de piment',
                required: true,
                multiSelect: false,
                options: [
                    { id: 'mild', name: 'Doux', price: 0, icon: '😊', category: 'sauce' },
                    { id: 'medium', name: 'Moyen', price: 0, icon: '🌶️', category: 'sauce' },
                    { id: 'hot', name: 'Piquant', price: 0, icon: '🔥', category: 'sauce' },
                ]
            }
        ]
    },
    {
        id: 'yassa-001',
        name: 'Yassa Poulet',
        description: 'Poulet mariné aux oignons et citron, riz parfumé',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400',
        category: 'plats-locaux',
        preparationTime: 20,
        spiceLevel: 'mild',
        customizations: [
            {
                id: 'yassa-protein',
                name: 'Choix de protéine',
                required: true,
                multiSelect: false,
                options: [
                    { id: 'chicken', name: 'Poulet', price: 0, icon: '🐔', category: 'protein' },
                    { id: 'fish', name: 'Poisson', price: 200, icon: '🐟', category: 'protein' },
                    { id: 'beef', name: 'Bœuf', price: 500, icon: '🥩', category: 'protein' },
                ]
            },
            {
                id: 'yassa-rice',
                name: 'Type de riz',
                required: false,
                multiSelect: false,
                options: [
                    { id: 'white', name: 'Riz blanc', price: 0, icon: '🍚', category: 'base' },
                    { id: 'broken', name: 'Riz brisé', price: 100, icon: '🌾', category: 'base' },
                ]
            }
        ]
    }
];

export const customizationIcons = {
    beef: '🥩',
    chicken: '🐔',
    fish: '🐟',
    onions: '🧅',
    tomatoes: '🍅',
    lettuce: '🥬',
    cheese: '🧀',
    avocado: '🥑',
    pickles: '🥒',
    ketchup: '🍅',
    mustard: '🟡',
    mayo: '⚪',
    spicy: '🌶️',
    barbecue: '🥩',
    fries: '🍟',
    plantain: '🍌',
    salad: '🥗',
    mild: '😊',
    medium: '🌶️',
    hot: '🔥',
};