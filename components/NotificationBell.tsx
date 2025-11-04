import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useNotificationStore from '@/store/notification.store';

interface NotificationBellProps {
    size?: number;
    color?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
    size = 24, 
    color = '#374151' 
}) => {
    const { unreadCount } = useNotificationStore();

    const handlePress = () => {
        // For now, we'll just show an alert. Later this could navigate to a notifications screen
        router.push('/profile');
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="relative p-2"
            activeOpacity={0.8}
        >
            <View className="relative">
                <Text 
                    className="font-bold"
                    style={{ fontSize: size, color }}
                >
                    🔔
                </Text>
                
                {unreadCount > 0 && (
                    <View 
                        className="absolute -top-1 -right-1 rounded-full items-center justify-center min-w-[18px] h-[18px] px-1"
                        style={{ backgroundColor: '#E63946' }}
                    >
                        <Text 
                            className="text-white font-bold text-xs"
                            numberOfLines={1}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default NotificationBell;