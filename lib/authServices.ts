import { account } from './appwrite';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Service d'authentification par téléphone (OTP/SMS)
 */

export interface PhoneAuthResult {
  success: boolean;
  userId?: string;
  sessionId?: string;
  error?: string;
}

/**
 * Envoyer un code OTP au numéro de téléphone
 * @param phone Format international : +221771234567
 */
export const sendPhoneOTP = async (phone: string): Promise<PhoneAuthResult> => {
  try {
    // Nettoyer le numéro (enlever espaces, tirets)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Valider le format sénégalais
    if (!/^\+221[7][0-9]{8}$/.test(cleanPhone)) {
      return {
        success: false,
        error: 'Numéro invalide. Format attendu : +221 7X XXX XX XX'
      };
    }

    // Créer une session de vérification par téléphone
    const token = await account.createPhoneToken(
      'unique()', // ID unique auto-généré
      cleanPhone
    );

    console.log('OTP envoyé avec succès', token);

    return {
      success: true,
      userId: token.userId,
      sessionId: token.$id
    };
  } catch (error: any) {
    console.error('Erreur envoi OTP:', error);
    return {
      success: false,
      error: error.message || 'Impossible d\'envoyer le code OTP'
    };
  }
};

/**
 * Vérifier le code OTP saisi par l'utilisateur
 * @param userId ID utilisateur retourné par sendPhoneOTP
 * @param otp Code à 6 chiffres
 */
export const verifyPhoneOTP = async (
  userId: string,
  otp: string
): Promise<PhoneAuthResult> => {
  try {
    // Créer une session avec le code OTP
    const session = await account.createSession(userId, otp);

    console.log('OTP vérifié avec succès', session);

    return {
      success: true,
      userId: session.userId,
      sessionId: session.$id
    };
  } catch (error: any) {
    console.error('Erreur vérification OTP:', error);
    return {
      success: false,
      error: error.message || 'Code OTP invalide ou expiré'
    };
  }
};

/**
 * Authentification biométrique (Face ID, Touch ID, Fingerprint)
 */

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  authenticated?: boolean;
}

/**
 * Vérifier si l'appareil supporte l'authentification biométrique
 */
export const isBiometricAvailable = async (): Promise<{
  available: boolean;
  type: string | null;
}> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!compatible || !enrolled) {
      return { available: false, type: null };
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    // Déterminer le type (Face ID, Touch ID, Fingerprint)
    let biometricType = 'Biométrique';
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'Empreinte digitale';
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'Iris';
    }

    return { available: true, type: biometricType };
  } catch (error) {
    console.error('Erreur vérification biométrique:', error);
    return { available: false, type: null };
  }
};

/**
 * Activer l'authentification biométrique pour un utilisateur
 * Stocke les credentials de manière sécurisée
 */
export const enableBiometricAuth = async (
  userId: string,
  sessionToken: string
): Promise<BiometricAuthResult> => {
  try {
    const { available } = await isBiometricAvailable();
    
    if (!available) {
      return {
        success: false,
        error: 'Authentification biométrique non disponible sur cet appareil'
      };
    }

    // Stocker le token de session de manière sécurisée
    await SecureStore.setItemAsync(`biometric_user_${userId}`, sessionToken);
    await SecureStore.setItemAsync('biometric_enabled', 'true');
    await SecureStore.setItemAsync('biometric_user_id', userId);

    return { success: true };
  } catch (error: any) {
    console.error('Erreur activation biométrique:', error);
    return {
      success: false,
      error: error.message || 'Impossible d\'activer l\'authentification biométrique'
    };
  }
};

/**
 * Authentifier un utilisateur avec la biométrie
 */
export const authenticateWithBiometric = async (): Promise<BiometricAuthResult> => {
  try {
    const { available, type } = await isBiometricAvailable();
    
    if (!available) {
      return {
        success: false,
        error: 'Authentification biométrique non disponible'
      };
    }

    // Vérifier si la biométrie est activée
    const enabled = await SecureStore.getItemAsync('biometric_enabled');
    if (enabled !== 'true') {
      return {
        success: false,
        error: 'Authentification biométrique non activée'
      };
    }

    // Demander l'authentification biométrique
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `Authentification avec ${type}`,
      cancelLabel: 'Annuler',
      fallbackLabel: 'Utiliser le code',
      disableDeviceFallback: false
    });

    if (!result.success) {
      return {
        success: false,
        authenticated: false,
        error: 'Authentification échouée'
      };
    }

    // Récupérer le userId et le token stockés
    const userId = await SecureStore.getItemAsync('biometric_user_id');
    const sessionToken = await SecureStore.getItemAsync(`biometric_user_${userId}`);

    if (!userId || !sessionToken) {
      return {
        success: false,
        error: 'Aucune session biométrique trouvée'
      };
    }

    // Note: Dans Appwrite, vous devrez gérer la réactivation de la session
    // avec le token stocké ou demander une nouvelle connexion

    return {
      success: true,
      authenticated: true
    };
  } catch (error: any) {
    console.error('Erreur authentification biométrique:', error);
    return {
      success: false,
      error: error.message || 'Erreur d\'authentification'
    };
  }
};

/**
 * Désactiver l'authentification biométrique
 */
export const disableBiometricAuth = async (userId: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(`biometric_user_${userId}`);
    await SecureStore.deleteItemAsync('biometric_enabled');
    await SecureStore.deleteItemAsync('biometric_user_id');
  } catch (error) {
    console.error('Erreur désactivation biométrique:', error);
  }
};
