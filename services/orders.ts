/**
 * Service de gestion des commandes
 * Support pour commandes utilisateur authentifié et invité
 */

import { databases, appwriteConfig } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';
import { OrderData, CartItemType, GuestUser, User } from '@/type';


/**
 * Créer une commande (authentifié ou invité)
 */
export const createOrder = async (
    user: User | null,
    guestInfo: GuestUser | null,
    items: CartItemType[],
    paymentMethod: 'cash' | 'orange' | 'wave' | 'card',
    deliveryFee: number
): Promise<string> => {
    try {
        const totalPrice = items.reduce((sum, item) => {
            const customPrice = item.customizations?.reduce((s, c) => s + c.price, 0) ?? 0;
            return sum + item.quantity * (item.price + customPrice);
        }, 0);

        const orderData: OrderData = {
            userId: user?.$id || null,
            guestId: guestInfo?.guestId || null,
            guestName: guestInfo?.name,
            guestPhone: guestInfo?.phone,
            guestAddress: guestInfo?.address,
            items,
            total: totalPrice + deliveryFee,
            deliveryFee,
            paymentMethod,
            status: 'pending'
        };

        // Convertir les items en JSON string pour Appwrite
        const orderDocument = {
            userId: orderData.userId,
            guestId: orderData.guestId,
            guestName: orderData.guestName,
            guestPhone: orderData.guestPhone,
            guestAddress: orderData.guestAddress,
            items: JSON.stringify(orderData.items),
            total: orderData.total,
            deliveryFee: orderData.deliveryFee,
            paymentMethod: orderData.paymentMethod,
            status: orderData.status,
            createdAt: new Date().toISOString()
        };

        const collectionId = appwriteConfig.ordersCollectionId;
        
        if (!collectionId) {
            throw new Error('Orders collection ID not configured');
        }

        const response = await databases.createDocument(
            appwriteConfig.databaseId,
            collectionId,
            ID.unique(),
            orderDocument
        );

        return response.$id;
    } catch (error: any) {
        console.error('Create order error:', error);
        throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
};

/**
 * Récupérer les commandes d'un utilisateur authentifié
 */
export const getUserOrders = async (userId: string) => {
    try {
        const collectionId = appwriteConfig.ordersCollectionId;
        
        if (!collectionId) {
            throw new Error('Orders collection ID not configured');
        }

        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId,
            [
                // Query.equal('userId', userId)
            ]
        );

        return response.documents;
    } catch (error: any) {
        console.error('Get user orders error:', error);
        throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
};

/**
 * Récupérer une commande invité par numéro de téléphone
 */
export const getGuestOrders = async (phone: string) => {
    try {
        const collectionId = appwriteConfig.ordersCollectionId;
        
        if (!collectionId) {
            throw new Error('Orders collection ID not configured');
        }

        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId,
            [
                // Query.equal('guestPhone', phone)
            ]
        );

        return response.documents;
    } catch (error: any) {
        console.error('Get guest orders error:', error);
        throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
};

/**
 * Lier les commandes invité à un compte utilisateur
 * Utilisé quand un invité crée un compte après avoir commandé
 */
export const linkGuestOrdersToUser = async (
    userId: string,
    phone: string
): Promise<number> => {
    try {
        const guestOrders = await getGuestOrders(phone);
        let linkedCount = 0;

        for (const order of guestOrders) {
            // Ne lier que si pas déjà lié
            if (!order.userId) {
                await databases.updateDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.ordersCollectionId,
                    order.$id,
                    { userId }
                );
                linkedCount++;
            }
        }

        return linkedCount;
    } catch (error: any) {
        console.error('Link guest orders error:', error);
        throw new Error(`Erreur lors de la liaison des commandes: ${error.message}`);
    }
};

/**
 * Mettre à jour le statut d'une commande
 */
export const updateOrderStatus = async (
    orderId: string,
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
) => {
    try {
        const response = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            orderId,
            { status }
        );

        return response;
    } catch (error: any) {
        console.error('Update order status error:', error);
        throw new Error(`Erreur lors de la mise à jour de la commande: ${error.message}`);
    }
};
