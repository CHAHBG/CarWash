import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [
        {
            id: '1',
            title: 'Bienvenue !',
            message: 'Découvrez nos spécialités sénégalaises à TAMBACOUNDA',
            type: 'info',
            timestamp: new Date(),
            read: false,
        },
        {
            id: '2',
            title: 'Offre spéciale',
            message: 'Profitez de -20% sur votre première commande !',
            type: 'success',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            read: false,
        },
    ],
    unreadCount: 2,

    addNotification: (notificationData) => {
        const notification: Notification = {
            ...notificationData,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
        };
        
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: (id) => {
        set((state) => {
            const updatedNotifications = state.notifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            );
            const unreadCount = updatedNotifications.filter((n) => !n.read).length;
            
            return {
                notifications: updatedNotifications,
                unreadCount,
            };
        });
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((notification) => ({
                ...notification,
                read: true,
            })),
            unreadCount: 0,
        }));
    },

    removeNotification: (id) => {
        set((state) => {
            const updatedNotifications = state.notifications.filter((n) => n.id !== id);
            const unreadCount = updatedNotifications.filter((n) => !n.read).length;
            
            return {
                notifications: updatedNotifications,
                unreadCount,
            };
        });
    },

    clearAllNotifications: () => {
        set({
            notifications: [],
            unreadCount: 0,
        });
    },
}));

export default useNotificationStore;