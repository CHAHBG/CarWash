import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";
import { KitchenOrder, KitchenOrderItem } from "@/types/kitchen.types";

function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    guestInfo: null,

    setGuestInfo: (info) => set({ guestInfo: info }),

    addItem: (item) => {
        const customizations = item.customizations ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, customizations }],
            });
        }
    },

    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomization) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),

    createKitchenOrder: (customerInfo: { name: string; phone?: string; address?: string; type: 'dine-in' | 'takeaway' | 'delivery'; notes?: string }): KitchenOrder => {
        const cartItems = get().items;
        const orderNumber = `CW${Date.now().toString().slice(-6)}`;
        
        const kitchenItems: KitchenOrderItem[] = cartItems.map(item => ({
            id: `${item.id}_${Date.now()}`,
            menuItemId: item.id,
            name: item.name,
            quantity: item.quantity,
            customizations: (item.customizations || []).map(c => ({
                categoryName: c.category || 'Option',
                optionName: c.name || 'Personnalisation',
                optionIcon: c.icon || '🔸',
                quantity: 1,
            })),
            preparationTime: 15, // Default preparation time
            spiceLevel: 'medium', // Default spice level
        }));

        const totalPreparationTime = Math.max(...kitchenItems.map(item => item.preparationTime * item.quantity), 15);

        const order: KitchenOrder = {
            id: `order_${Date.now()}`,
            orderNumber,
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            deliveryAddress: customerInfo.address,
            items: kitchenItems,
            totalAmount: get().getTotalPrice(),
            status: 'pending',
            priority: 'normal',
            estimatedTime: totalPreparationTime,
            createdAt: new Date(),
            notes: customerInfo.notes,
            paymentStatus: 'pending',
            orderType: customerInfo.type,
        };

        return order;
    },
}));
