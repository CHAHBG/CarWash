import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { sendPhoneOTP, verifyPhoneOTP } from '@/lib/authServices';
import useAuthStore from '@/store/auth.store';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';

const SignInPhone = () => {
  const [phone, setPhone] = useState('+221 ');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [userId, setUserId] = useState<string>('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser, setIsAuthenticated } = useAuthStore();

  // Formater le numéro de téléphone pendant la saisie
  const formatPhoneNumber = (text: string) => {
    // Garder uniquement les chiffres et le +
    let cleaned = text.replace(/[^\d+]/g, '');
    
    // S'assurer que ça commence par +221
    if (!cleaned.startsWith('+221')) {
      cleaned = '+221';
    }
    
    // Limiter à +221 + 9 chiffres
    if (cleaned.length > 12) {
      cleaned = cleaned.substring(0, 12);
    }
    
    // Ajouter des espaces pour la lisibilité : +221 7X XXX XX XX
    if (cleaned.length > 5) {
      cleaned = `${cleaned.substring(0, 4)} ${cleaned.substring(4, 6)}${
        cleaned.length > 6 ? ' ' + cleaned.substring(6, 9) : ''
      }${cleaned.length > 9 ? ' ' + cleaned.substring(9, 11) : ''}${
        cleaned.length > 11 ? ' ' + cleaned.substring(11) : ''
      }`;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleSendOTP = async () => {
    if (phone.replace(/\s/g, '').length < 12) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    const result = await sendPhoneOTP(phone);
    setLoading(false);

    if (result.success && result.userId) {
      setUserId(result.userId);
      setStep('otp');
      Alert.alert(
        'Code envoyé',
        `Un code de vérification a été envoyé au ${phone}`
      );
    } else {
      Alert.alert('Erreur', result.error || 'Impossible d\'envoyer le code');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code à 6 chiffres');
      return;
    }

    setLoading(true);
    const result = await verifyPhoneOTP(userId, otp);
    setLoading(false);

    if (result.success) {
      // Vérifier si l'utilisateur existe déjà dans la collection
      try {
        const users = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [`accountId=${userId}`]
        );

        if (users.documents.length > 0) {
          // Utilisateur existe déjà
          const userData = users.documents[0];
          setUser(userData as any);
          setIsAuthenticated(true);
          router.replace('/');
        } else {
          // Nouvel utilisateur, demander le nom
          setStep('name');
        }
      } catch (error) {
        console.error('Erreur vérification utilisateur:', error);
        // En cas d'erreur, demander le nom par sécurité
        setStep('name');
      }
    } else {
      Alert.alert('Erreur', result.error || 'Code invalide');
    }
  };

  const handleCreateProfile = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom (minimum 2 caractères)');
      return;
    }

    setLoading(true);

    try {
      // Créer le document utilisateur
      const user = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: userId,
          name: name.trim(),
          phone: phone.replace(/\s/g, ''),
          authMethod: 'phone',
          biometricEnabled: false,
          loyaltyPoints: 0,
          createdAt: new Date().toISOString()
        }
      );

      setUser(user as any);
      setIsAuthenticated(true);
      
      Alert.alert(
        'Bienvenue !',
        `Votre compte a été créé avec succès. Bienvenue ${name} !`,
        [{ text: 'Continuer', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      console.error('Erreur création profil:', error);
      Alert.alert('Erreur', 'Impossible de créer votre profil. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handleSendOTP();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow p-5">
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold mb-2" style={{ color: '#1D3557' }}>
              {step === 'phone' && 'Connexion par SMS'}
              {step === 'otp' && 'Vérification'}
              {step === 'name' && 'Complétez votre profil'}
            </Text>
            <Text className="text-base text-gray-600 mb-8">
              {step === 'phone' && 'Entrez votre numéro de téléphone pour recevoir un code'}
              {step === 'otp' && `Code envoyé au ${phone}`}
              {step === 'name' && 'Pour finaliser, dites-nous comment vous appeler'}
            </Text>

            {/* Étape 1 : Numéro de téléphone */}
            {step === 'phone' && (
              <>
                <View className="mb-6">
                  <Text className="text-sm font-semibold mb-2 text-gray-700">
                    Numéro de téléphone
                  </Text>
                  <TextInput
                    className="border-2 rounded-xl px-4 py-4 text-base"
                    style={{ borderColor: '#E0E0E0' }}
                    placeholder="+221 7X XXX XX XX"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={17}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  className="rounded-xl py-4 items-center mb-4"
                  style={{ backgroundColor: '#E63946' }}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Recevoir le code
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Étape 2 : Code OTP */}
            {step === 'otp' && (
              <>
                <View className="mb-6">
                  <Text className="text-sm font-semibold mb-2 text-gray-700">
                    Code de vérification
                  </Text>
                  <TextInput
                    className="border-2 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-widest"
                    style={{ borderColor: '#E0E0E0' }}
                    placeholder="000000"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  className="rounded-xl py-4 items-center mb-4"
                  style={{ backgroundColor: '#E63946' }}
                  onPress={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Vérifier le code
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text className="text-center text-sm" style={{ color: '#E63946' }}>
                    Renvoyer le code
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Étape 3 : Nom utilisateur */}
            {step === 'name' && (
              <>
                <View className="mb-6">
                  <Text className="text-sm font-semibold mb-2 text-gray-700">
                    Votre nom
                  </Text>
                  <TextInput
                    className="border-2 rounded-xl px-4 py-4 text-base"
                    style={{ borderColor: '#E0E0E0' }}
                    placeholder="Ex: Mamadou Diallo"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  className="rounded-xl py-4 items-center mb-4"
                  style={{ backgroundColor: '#E63946' }}
                  onPress={handleCreateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Créer mon compte
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Bouton retour */}
            <TouchableOpacity
              onPress={() => {
                if (step === 'otp') {
                  setStep('phone');
                  setOtp('');
                } else if (step === 'name') {
                  setStep('otp');
                  setName('');
                } else {
                  router.back();
                }
              }}
              className="mt-4"
            >
              <Text className="text-center text-gray-600">
                {step === 'phone' ? '← Retour' : '← Étape précédente'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInPhone;
