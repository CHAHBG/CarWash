import { create } from 'zustand';

export interface OrderStatus {
    id: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    statusText: string;
    estimatedTime?: string;
    timestamp: Date;
}

export interface Order {
    id: string;
    customerName: string;
    items: {
        id: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    currentStatus: OrderStatus['status'];
    statusHistory: OrderStatus[];
    createdAt: Date;
    deliveryAddress?: string;
    phoneNumber?: string;
    notes?: string;
}

interface OrderTrackingState {
    orders: Order[];
    activeOrder: Order | null;
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'statusHistory' | 'currentStatus'>) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus['status'], estimatedTime?: string) => void;
    getOrderById: (id: string) => Order | undefined;
    setActiveOrder: (order: Order | null) => void;
}

const getStatusText = (status: OrderStatus['status']): string => {
    switch (status) {
        case 'pending':
            return 'Commande reçue';
        case 'confirmed':
            return 'Commande confirmée';
        case 'preparing':
            return 'En préparation';
        case 'ready':
            return 'Prête à emporter';
        case 'delivered':
            return 'Livrée';
        case 'cancelled':
            return 'Annulée';
        default:
            return 'Statut inconnu';
    }
};

const useOrderTrackingStore = create<OrderTrackingState>((set, get) => ({
    orders: [
        // Mock order for demo
        {
            id: '1',
            customerName: 'Client Demo',
            items: [
                { id: '1', name: 'Thieboudienne', quantity: 1, price: 2500 },
                { id: '2', name: 'Bissap', quantity: 2, price: 500 },
            ],
            total: 3500,
            currentStatus: 'preparing',
            statusHistory: [
                {
                    id: '1',
                    status: 'pending',
                    statusText: 'Commande reçue',
                    timestamp: new Date(Date.now() - 20 * 60 * 1000),
                },
                {
                    id: '2',
                    status: 'confirmed',
                    statusText: 'Commande confirmée',
                    timestamp: new Date(Date.now() - 15 * 60 * 1000),
                },
                {
                    id: '3',
                    status: 'preparing',
                    statusText: 'En préparation',
                    estimatedTime: '15 min',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000),
                },
            ],
            createdAt: new Date(Date.now() - 20 * 60 * 1000),
            deliveryAddress: 'TAMBACOUNDA Centre',
            phoneNumber: '+221 77 123 45 67',
        },
    ],
    activeOrder: null,

    addOrder: (orderData) => {
        const order: Order = {
            ...orderData,
            id: `order_${Date.now()}`,
            createdAt: new Date(),
            currentStatus: 'pending',
            statusHistory: [
                {
                    id: `status_${Date.now()}`,
                    status: 'pending',
                    statusText: getStatusText('pending'),
                    timestamp: new Date(),
                },
            ],
        };

        set((state) => ({
            orders: [order, ...state.orders],
            activeOrder: order,
        }));
    },

    updateOrderStatus: (orderId, status, estimatedTime) => {
        set((state) => {
            const updatedOrders = state.orders.map((order) => {
                if (order.id === orderId) {
                    const newStatusEntry: OrderStatus = {
                        id: `status_${Date.now()}`,
                        status,
                        statusText: getStatusText(status),
                        estimatedTime,
                        timestamp: new Date(),
                    };

                    return {
                        ...order,
                        currentStatus: status,
                        statusHistory: [...order.statusHistory, newStatusEntry],
                    };
                }
                return order;
            });

            const updatedActiveOrder = state.activeOrder?.id === orderId 
                ? updatedOrders.find(o => o.id === orderId) || null
                : state.activeOrder;

            return {
                orders: updatedOrders,
                activeOrder: updatedActiveOrder,
            };
        });
    },

    getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
    },

    setActiveOrder: (order) => {
        set({ activeOrder: order });
    },
}));

export default useOrderTrackingStore;