import {View, Text, FlatList, TouchableOpacity, Alert, Image, Linking, useWindowDimensions} from 'react-native'
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {useCartStore} from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import {useMemo, useState} from "react";
import useAuthStore from "@/store/auth.store";
import CustomInput from "@/components/CustomInput";
import { generateGuestId, validateGuestInfo } from "@/lib/guestUtils";
import { initiateOrangeMoneyPayment, initiateWavePayment, type PaymentResponse } from "@/lib/payments";

const DELIVERY_FEE = parseInt(process.env.EXPO_PUBLIC_DELIVERY_FEE || "2500");
const CURRENCY = process.env.EXPO_PUBLIC_CURRENCY || "FCFA";

type PaymentMethod = 'cash' | 'orange' | 'wave' | 'card';

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {
    const { items, getTotalItems, getTotalPrice, guestInfo, setGuestInfo } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const horizontalPadding = Math.max(16, Math.min(24, width * 0.06));
    
    // Formulaire invité
    const [guestName, setGuestName] = useState(guestInfo?.name || '');
    const [guestPhone, setGuestPhone] = useState(guestInfo?.phone || '');
    const [guestAddress, setGuestAddress] = useState(guestInfo?.address || '');

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const discount = 0;
    const finalTotal = totalPrice + DELIVERY_FEE - discount;

    const paymentMethods = useMemo(() => ([
        {
            id: 'cash' as PaymentMethod,
            name: 'Espèces',
            description: 'Paiement à la livraison',
            icon: '💵',
        },
        {
            id: 'orange' as PaymentMethod,
            name: 'Orange Money',
            description: 'Paiement sécurisé via API Orange',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Orange_logo.svg/512px-Orange_logo.svg.png',
        },
        {
            id: 'wave' as PaymentMethod,
            name: 'Wave',
            description: 'Confirmation instantanée sur votre application',
            logo: 'https://seeklogo.com/images/W/wave-mobile-money-logo-1F78C58D2E-seeklogo.com.png',
        },
        {
            id: 'card' as PaymentMethod,
            name: 'Carte bancaire',
            description: 'Paiement sécurisé par carte (bientôt)',
            icon: '💳',
        },
    ]), []);

    const processPayment = async (): Promise<PaymentResponse> => {
        const externalId = `order-${Date.now()}`;
        const metadata = {
            totalItems,
            totalPrice,
            deliveryFee: DELIVERY_FEE,
            customerType: isAuthenticated ? 'registered' : 'guest',
        };

        if (selectedPayment === 'cash') {
            return { success: true, status: 'success' };
        }

        if (selectedPayment === 'orange') {
            return await initiateOrangeMoneyPayment({
                amount: finalTotal,
                phoneNumber: isAuthenticated ? user?.phone ?? '' : guestPhone,
                externalId,
                customerName: isAuthenticated ? user?.name ?? '' : guestName,
                metadata,
            });
        }

        if (selectedPayment === 'wave') {
            return await initiateWavePayment({
                amount: finalTotal,
                phoneNumber: isAuthenticated ? user?.phone ?? '' : guestPhone,
                externalId,
                metadata,
            });
        }

        return {
            success: false,
            status: 'failed',
            message: "Mode de paiement indisponible pour le moment.",
        };
    };

    const handleOrder = async () => {
        // Si non connecté, valider les infos invité
        if (!isAuthenticated) {
            const validation = validateGuestInfo(guestName, guestPhone, guestAddress);
            
            if (!validation.isValid) {
                Alert.alert('Informations manquantes', validation.errors.join('\n'));
                return;
            }

            // Sauvegarder les infos invité
            const guestData = {
                guestId: generateGuestId(),
                name: guestName,
                phone: guestPhone,
                address: guestAddress
            };
            setGuestInfo(guestData);
        }

        setIsProcessing(true);

        try {
            const paymentResult = await processPayment();

            if (paymentResult.status === 'failed') {
                Alert.alert('Paiement interrompu', paymentResult.message || 'Une erreur est survenue pendant le paiement.');
                return;
            }

            if (paymentResult.deeplinkUrl) {
                Linking.openURL(paymentResult.deeplinkUrl).catch(() => {
                    Alert.alert('Paiement', "Impossible d'ouvrir l'application de paiement automatiquement.");
                });
            }

            if (paymentResult.status === 'pending') {
                Alert.alert(
                    'Paiement en cours',
                    paymentResult.message || 'Veuillez confirmer la transaction dans votre application de paiement.',
                    [{ text: 'Compris' }]
                );
            }

            const referenceText = paymentResult.reference ? `Référence paiement: ${paymentResult.reference}\n\n` : '';

            Alert.alert(
                'Commande confirmée',
                `${referenceText}${paymentResult.status === 'success' && paymentResult.message ? `${paymentResult.message}\n\n` : ''}Votre commande de ${finalTotal} ${CURRENCY} est en cours de préparation. Nous vous contacterons très vite !`,
                [{ text: 'Super !' }]
            );
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Impossible de finaliser le paiement.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingBottom: Math.max(32, insets.bottom + 32),
                    paddingHorizontal: horizontalPadding,
                    paddingTop: 20,
                }}
                ListHeaderComponent={() => <CustomHeader title="Votre Panier" />}
                ListEmptyComponent={() => (
                    <Text className="text-center text-gray-500 mt-10">
                        Votre panier est vide
                    </Text>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        {/* Formulaire invité si non connecté */}
                        {!isAuthenticated && (
                            <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                                <Text className="h3-bold text-dark-100 mb-4">
                                    Informations de Livraison
                                </Text>
                                <View className="gap-4">
                                    <CustomInput
                                        label="Nom complet"
                                        placeholder="Votre nom"
                                        value={guestName}
                                        onChangeText={setGuestName}
                                    />
                                    <CustomInput
                                        label="Téléphone"
                                        placeholder="77 123 45 67"
                                        value={guestPhone}
                                        onChangeText={setGuestPhone}
                                        keyboardType="phone-pad"
                                    />
                                    <CustomInput
                                        label="Adresse de livraison"
                                        placeholder="Quartier, rue, indication..."
                                        value={guestAddress}
                                        onChangeText={setGuestAddress}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Bannière fidélisation pour invités */}
                        {!isAuthenticated && (
                            <View className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex-row items-center">
                                <Text className="text-2xl mr-3">🎁</Text>
                                <View className="flex-1">
                                    <Text className="font-semibold text-dark-100">
                                        Connectez-vous pour cumuler des points!
                                    </Text>
                                    <Text className="text-sm text-gray-600 mt-1">
                                        Gagnez des réductions sur vos prochaines commandes
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Méthodes de paiement */}
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-4">
                                Mode de Paiement
                            </Text>
                            <View className="gap-3">
                                {paymentMethods.map((method) => (
                                    <TouchableOpacity
                                        key={method.id}
                                        onPress={() => setSelectedPayment(method.id)}
                                        className={cn(
                                            "flex-row items-center p-3 rounded-lg border-2",
                                            selectedPayment === method.id
                                                ? "border-primary bg-red-50"
                                                : "border-gray-200 bg-white"
                                        )}
                                        style={selectedPayment === method.id ? {borderColor: '#E63946'} : {}}
                                    >
                                        {method.logo ? (
                                            <Image source={{ uri: method.logo }} className="w-10 h-10 mr-3" resizeMode="contain" />
                                        ) : (
                                            <Text className="text-2xl mr-3">{method.icon}</Text>
                                        )}
                                        <View className="flex-1">
                                            <Text
                                                className={cn(
                                                    "text-base font-semibold",
                                                    selectedPayment === method.id ? "text-primary" : "text-dark-100"
                                                )}
                                                style={selectedPayment === method.id ? { color: '#E63946' } : {}}
                                            >
                                                {method.name}
                                            </Text>
                                            {method.description && (
                                                <Text className="text-xs text-gray-500 mt-1">
                                                    {method.description}
                                                </Text>
                                            )}
                                        </View>
                                        {selectedPayment === method.id && (
                                            <View className="w-6 h-6 rounded-full items-center justify-center" style={{backgroundColor: '#E63946'}}>
                                                <Text className="text-white text-xs">✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Résumé de paiement */}
                        <View className="border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Résumé de la Commande
                            </Text>

                            <PaymentInfoStripe
                                label={`Total Articles (${totalItems})`}
                                value={`${totalPrice} ${CURRENCY}`}
                            />
                            <PaymentInfoStripe
                                label={`Frais de Livraison`}
                                value={`${DELIVERY_FEE} ${CURRENCY}`}
                            />
                            {discount > 0 && (
                                <PaymentInfoStripe
                                    label={`Réduction`}
                                    value={`- ${discount} ${CURRENCY}`}
                                    valueStyle="!text-success"
                                />
                            )}
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total à Payer`}
                                value={`${finalTotal} ${CURRENCY}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton 
                            title={isAuthenticated ? "Commander maintenant" : "Payer sans compte"}
                            onPress={handleOrder}
                            isLoading={isProcessing}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart
