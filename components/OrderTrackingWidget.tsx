import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useOrderTrackingStore from '@/store/orderTracking.store';

const OrderTrackingWidget: React.FC = () => {
    const { activeOrder } = useOrderTrackingStore();

    if (!activeOrder) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#F59E0B';
            case 'confirmed':
                return '#3B82F6';
            case 'preparing':
                return '#E63946';
            case 'ready':
                return '#10B981';
            case 'delivered':
                return '#059669';
            default:
                return '#6B7280';
        }
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'confirmed':
                return '✅';
            case 'preparing':
                return '👨‍🍳';
            case 'ready':
                return '🛎️';
            case 'delivered':
                return '🚚';
            default:
                return '📦';
        }
    };

    const currentStatusEntry = activeOrder.statusHistory[activeOrder.statusHistory.length - 1];

    return (
        <TouchableOpacity
            className="bg-white rounded-3xl p-5 mb-4 border border-gray-100"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
            }}
            activeOpacity={0.9}
            onPress={() => router.push('/profile')} // Navigate to order details
        >
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-quicksand-bold text-dark-100">
                    Commande en cours
                </Text>
                <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${getStatusColor(activeOrder.currentStatus)}20` }}
                >
                    <Text 
                        className="text-xs font-semibold"
                        style={{ color: getStatusColor(activeOrder.currentStatus) }}
                    >
                        #{activeOrder.id.slice(-6)}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-3">
                    {getStatusEmoji(activeOrder.currentStatus)}
                </Text>
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">
                        {currentStatusEntry.statusText}
                    </Text>
                    {currentStatusEntry.estimatedTime && (
                        <Text className="text-xs text-gray-500 mt-1">
                            Temps estimé: {currentStatusEntry.estimatedTime}
                        </Text>
                    )}
                </View>
            </View>

            <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">
                    {activeOrder.items.length} article{activeOrder.items.length > 1 ? 's' : ''} • {activeOrder.total} FCFA
                </Text>
                <Text className="text-xs font-medium" style={{ color: '#E63946' }}>
                    Voir détails →
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default OrderTrackingWidget;