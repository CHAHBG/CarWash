import {View, Text, Alert, TouchableOpacity, Image} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState, useEffect} from "react";
import {signIn} from "@/lib/appwrite";
import * as Sentry from '@sentry/react-native'
import { isBiometricAvailable, authenticateWithBiometric } from '@/lib/authServices';
import {images} from "@/constants";
import useAuthStore from "@/store/auth.store";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<string>('');
    const fetchAuthenticatedUser = useAuthStore((state) => state.fetchAuthenticatedUser);

    useEffect(() => {
        checkBiometric();
    }, []);

    const checkBiometric = async () => {
        const result = await isBiometricAvailable();
        setBiometricAvailable(result.available);
        setBiometricType(result.type || '');
    };

    const submit = async () => {
        const { email, password } = form;

        if(!email || !password) return Alert.alert('Erreur', 'Veuillez entrer une adresse email et un mot de passe valides.');

        setIsSubmitting(true)

        try {
            await signIn({ email, password });
            await fetchAuthenticatedUser();

            router.replace('/');
        } catch(error: any) {
            Alert.alert('Erreur', error.message);
            Sentry.captureEvent(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleContinueAsGuest = () => {
        router.replace('/');
    };

    const handleBiometricSignIn = async () => {
        const result = await authenticateWithBiometric();
        
        if (result.success && result.authenticated) {
            router.replace('/');
        } else if (result.error) {
            Alert.alert('Erreur', result.error);
        }
    };

    return (
        <View className="px-6 pt-6 pb-12">
            <View className="rounded-3xl overflow-hidden mb-7" style={{backgroundColor: '#FDF2F4'}}>
                <View className="flex-row items-center px-5 py-6">
                    <View className="flex-1">
                        <Text className="text-xs font-semibold uppercase" style={{color: '#E63946'}}>
                            Bienvenue
                        </Text>
                        <Text className="text-2xl font-quicksand-bold text-dark-100 mt-1">
                            Ravie de vous revoir 👋
                        </Text>
                        <Text className="text-sm text-gray-500 mt-3">
                            Connectez-vous pour suivre vos commandes, cumuler des points et profiter des offres exclusives.
                        </Text>
                    </View>
                    <Image source={images.loginGraphic} style={{ width: 88, height: 88 }} resizeMode="contain" />
                </View>
            </View>

            {biometricAvailable && (
                <TouchableOpacity
                    onPress={handleBiometricSignIn}
                    className="flex-row items-center justify-between px-5 py-4 rounded-2xl mb-6"
                    style={{ backgroundColor: '#101828', opacity: 0.95 }}
                >
                    <Text className="text-white text-base font-semibold">Connexion rapide</Text>
                    <Text className="text-white/80 text-sm">🔒 {biometricType}</Text>
                </TouchableOpacity>
            )}

            <View className="bg-white border border-gray-100 rounded-3xl px-5 py-6 shadow-sm shadow-black/10">
                <Text className="text-lg font-quicksand-bold text-dark-100 mb-5">Connexion par email</Text>

                <View className="gap-5">
                    <CustomInput
                        placeholder="votre.email@example.com"
                        value={form.email}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                        label="Adresse email"
                        keyboardType="email-address"
                    />
                    <CustomInput
                        placeholder="Votre mot de passe"
                        value={form.password}
                        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                        label="Mot de passe"
                        secureTextEntry={true}
                    />
                </View>

                <CustomButton
                    title="Se connecter"
                    isLoading={isSubmitting}
                    onPress={submit}
                    style="mt-7"
                />
            </View>

            <TouchableOpacity 
                onPress={handleContinueAsGuest}
                className="items-center py-4 mt-5"
            >
                <Text className="text-base font-semibold" style={{color: '#E63946'}}>
                    Continuer comme invité
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                    Vous pourrez créer un compte plus tard.
                </Text>
            </TouchableOpacity>

            <View className="flex justify-center mt-6 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Pas encore de compte ?
                </Text>
                <Link href="/sign-up" className="base-bold" style={{color: '#E63946'}}>
                    Inscrivez-vous
                </Link>
            </View>
        </View>
    )
}

export default SignIn
