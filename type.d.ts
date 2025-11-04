import { Models } from "react-native-appwrite";

export interface MenuItem extends Models.Document {
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    available?: boolean;
    featured?: boolean;
    order?: number;
    customizationPresetId?: string; // References customization_presets collection
    preparationTime?: number; // in minutes
}

export interface Category extends Models.Document {
    name: string;
    description: string;
    slug?: string;
    icon?: string;
}

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
    phone?: string;
    loyaltyPoints?: number;
    defaultAddress?: string;
}

export interface GuestUser {
    guestId: string;
    name: string;
    phone: string;
    address: string;
}

export interface OrderData {
    userId?: string | null;
    guestId?: string | null;
    guestName?: string;
    guestPhone?: string;
    guestAddress?: string;
    items: CartItemType[];
    total: number;
    deliveryFee: number;
    paymentMethod: 'cash' | 'orange' | 'wave' | 'card';
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
    category: string;
    icon: string;
}

export interface CartItemType {
    id: string; // menu item id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
}

export interface CartStore {
    items: CartItemType[];
    guestInfo: GuestUser | null;
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string, customizations?: CartCustomization[]) => void;
    increaseQty: (id: string, customizations?: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations?: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    setGuestInfo: (info: GuestUser | null) => void;
}

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

interface CustomHeaderProps {
    title?: string;
}

interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}

interface CreateUserPrams {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface GetMenuParams {
    category?: string;
    query?: string;
    limit?: number;
}
