export interface KitchenOrderItem {
    id: string;
    menuItemId: string;
    name: string;
    quantity: number;
    customizations: {
        categoryName: string;
        optionName: string;
        optionIcon: string;
        quantity: number;
    }[];
    specialInstructions?: string;
    preparationTime: number;
    allergens?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
}

export interface KitchenOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    deliveryAddress?: string;
    items: KitchenOrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    priority: 'normal' | 'urgent' | 'vip';
    estimatedTime: number; // total preparation time in minutes
    createdAt: Date;
    confirmedAt?: Date;
    startedPreparingAt?: Date;
    readyAt?: Date;
    deliveredAt?: Date;
    notes?: string;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    orderType: 'dine-in' | 'takeaway' | 'delivery';
}

export interface KitchenStats {
    totalOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    completedToday: number;
    averagePreparationTime: number;
    currentWaitTime: number;
}

// Helper function to format order for kitchen display
export const formatOrderForKitchen = (order: KitchenOrder): string => {
    const items = order.items.map(item => {
        const customizationsText = item.customizations.length > 0 
            ? `\n  Personnalisation: ${item.customizations.map(c => `${c.optionIcon} ${c.optionName}`).join(', ')}`
            : '';
        
        const spiceText = item.spiceLevel && item.spiceLevel !== 'mild' 
            ? `\n  Piment: ${item.spiceLevel.toUpperCase()}`
            : '';
            
        const specialText = item.specialInstructions 
            ? `\n  Note: ${item.specialInstructions}`
            : '';
            
        return `${item.quantity}x ${item.name}${customizationsText}${spiceText}${specialText}`;
    }).join('\n\n');

    return `
COMMANDE #${order.orderNumber}
=====================================
Client: ${order.customerName}
${order.customerPhone ? `Tel: ${order.customerPhone}` : ''}
${order.deliveryAddress ? `Adresse: ${order.deliveryAddress}` : ''}
Type: ${order.orderType.toUpperCase()}
Heure: ${order.createdAt.toLocaleTimeString('fr-FR')}
Temps estimé: ${order.estimatedTime} min
Priority: ${order.priority.toUpperCase()}

ARTICLES:
${items}

${order.notes ? `\nNOTES SPÉCIALES:\n${order.notes}` : ''}

Total: ${order.totalAmount} FCFA
=====================================
    `.trim();
};