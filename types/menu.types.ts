export interface CustomizationOption {
    id: string;
    name: string;
    price: number;
    image?: string;
    icon?: string;
    maxQuantity?: number;
    category: 'sauce' | 'topping' | 'side' | 'drink' | 'protein' | 'base';
}

export interface CustomizationCategory {
    id: string;
    name: string;
    description?: string;
    required: boolean;
    multiSelect: boolean;
    maxSelections?: number;
    options: CustomizationOption[];
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    customizations: CustomizationCategory[];
    preparationTime: number; // in minutes
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
    allergens?: string[];
    isVegetarian?: boolean;
    isPopular?: boolean;
}

export interface SelectedCustomization {
    optionId: string;
    quantity: number;
    price: number;
    category: string;
}

export interface CartMenuItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    selectedCustomizations: SelectedCustomization[];
    totalPrice: number;
    specialInstructions?: string;
}