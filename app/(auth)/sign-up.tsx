import {View, Text, Alert, TouchableOpacity} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";
import {createUser} from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const fetchAuthenticatedUser = useAuthStore((state) => state.fetchAuthenticatedUser);

    const submit = async () => {
        const { name, email, password, phone } = form;

        if(!name || !email || !password) return Alert.alert('Erreur', 'Veuillez remplir tous les champs.');

        setIsSubmitting(true)

        try {
            await createUser({ email,  password,  name, phone });
            await fetchAuthenticatedUser();

            router.replace('/');
        } catch(error: any) {
            Alert.alert('Erreur', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleContinueAsGuest = () => {
        router.replace('/');
    };

    return (
        <View className="gap-8 bg-white rounded-3xl p-5 mt-5 border border-gray-100 shadow-sm shadow-black/10">
            <CustomInput
                placeholder="Entrez votre nom complet"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Nom complet"
            />
            <CustomInput
                placeholder="Entrez votre email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Ex: 77 123 45 67"
                value={form.phone}
                onChangeText={(text) => setForm((prev) => ({ ...prev, phone: text }))}
                label="Téléphone (facultatif)"
                keyboardType="phone-pad"
            />
            <CustomInput
                placeholder="Entrez votre mot de passe"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Mot de passe"
                secureTextEntry={true}
            />

            <CustomButton
                title="Créer mon compte"
                isLoading={isSubmitting}
                onPress={submit}
            />

            {/* Bouton continuer sans compte */}
            <TouchableOpacity 
                onPress={handleContinueAsGuest}
                className="items-center py-3"
            >
                <Text className="text-base font-medium" style={{color: '#E63946'}}>
                    Continuer sans compte
                </Text>
            </TouchableOpacity>

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Vous avez déjà un compte?
                </Text>
                <Link href="/sign-in" className="base-bold" style={{color: '#E63946'}}>
                    Se Connecter
                </Link>
            </View>
        </View>
    )
}

export default SignUp
