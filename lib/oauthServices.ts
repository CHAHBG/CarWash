import { appwriteConfig } from './appwrite';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Service d'authentification OAuth (Google, Apple)
 */

export interface OAuthResult {
  success: boolean;
  userId?: string;
  email?: string;
  name?: string;
  needsName?: boolean; // True si le nom n'est pas fourni par le provider
  error?: string;
}

/**
 * Configuration Google Sign-In
 * À appeler au démarrage de l'app
 */
export const configureGoogleSignIn = () => {
  try {
    GoogleSignin.configure({
      // Les IDs sont différents pour Android et iOS
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // Web Client ID depuis Google Cloud Console
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS, // iOS Client ID (optionnel)
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
    console.log('Google Sign-In configuré');
  } catch (error) {
    console.error('Erreur configuration Google Sign-In:', error);
  }
};

/**
 * Connexion avec Google
 */
export const signInWithGoogle = async (): Promise<OAuthResult> => {
  try {
    // Vérifier que les Google Play Services sont disponibles
    await GoogleSignin.hasPlayServices();

    // Obtenir les informations utilisateur
    const userInfo = await GoogleSignin.signIn();

    console.log('Google Sign-In réussi:', userInfo);

    if (!userInfo.data) {
      throw new Error('Aucune donnée utilisateur reçue de Google');
    }

    const userData = userInfo.data;

    // Créer une session OAuth avec Appwrite
    // Note: Appwrite SDK React Native ne supporte pas encore OAuth de manière native
    // Il faut utiliser l'API REST ou WebView
    
    // Alternative: Utiliser le token Google pour créer un compte custom
    // ou implémenter OAuth via WebView (voir ci-dessous)

    return {
      success: true,
      userId: userData.user.id,
      email: userData.user.email,
      name: userData.user.name || userData.user.givenName || undefined,
      needsName: !userData.user.name && !userData.user.givenName
    };
  } catch (error: any) {
    console.error('Erreur connexion Google:', error);
    
    if (error.code === 'SIGN_IN_CANCELLED') {
      return {
        success: false,
        error: 'Connexion annulée'
      };
    }

    return {
      success: false,
      error: error.message || 'Erreur lors de la connexion avec Google'
    };
  }
};

/**
 * Connexion avec Apple (iOS uniquement)
 */
export const signInWithApple = async (): Promise<OAuthResult> => {
  try {
    // Vérifier la disponibilité (iOS 13+)
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    
    if (!isAvailable) {
      return {
        success: false,
        error: 'Connexion avec Apple non disponible sur cet appareil'
      };
    }

    // Demander l'authentification Apple
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log('Apple Sign-In réussi:', credential);

    const { user, email, fullName } = credential;

    // Note: Apple ne fournit le nom complet que lors de la première connexion
    const name = fullName?.givenName 
      ? `${fullName.givenName} ${fullName.familyName || ''}`.trim() 
      : undefined;

    // Créer une session OAuth avec Appwrite
    // (similaire à Google, nécessite implémentation custom)

    return {
      success: true,
      userId: user,
      email: email || undefined,
      name: name,
      needsName: !name // Demander le nom si Apple ne l'a pas fourni
    };
  } catch (error: any) {
    console.error('Erreur connexion Apple:', error);
    
    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Connexion annulée'
      };
    }

    return {
      success: false,
      error: error.message || 'Erreur lors de la connexion avec Apple'
    };
  }
};

/**
 * Connexion OAuth via Appwrite (WebView)
 * Cette méthode ouvre une WebView pour le flux OAuth standard d'Appwrite
 */
export const signInWithOAuth = async (
  provider: 'google' | 'apple'
): Promise<OAuthResult> => {
  try {
    // Construire l'URL de redirection
    const redirectUrl = `${appwriteConfig.platform}://auth/callback`;

    // Créer la session OAuth
    // Note: Cette méthode nécessite une WebView ou un navigateur externe
    const url = `${appwriteConfig.endpoint}/account/sessions/oauth2/${provider}?project=${appwriteConfig.projectId}&success=${redirectUrl}&failure=${redirectUrl}`;

    console.log('OAuth URL:', url);

    // Vous devrez implémenter l'ouverture de cette URL dans une WebView
    // ou utiliser Linking.openURL() pour le navigateur externe
    // Puis capturer le callback via deep linking

    return {
      success: false,
      error: 'OAuth via WebView non encore implémenté (voir documentation)'
    };
  } catch (error: any) {
    console.error('Erreur OAuth:', error);
    return {
      success: false,
      error: error.message || 'Erreur d\'authentification OAuth'
    };
  }
};

/**
 * Déconnexion Google
 */
export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('Déconnexion Google réussie');
  } catch (error) {
    console.error('Erreur déconnexion Google:', error);
  }
};

/**
 * Vérifier si l'utilisateur est connecté avec Google
 */
export const isGoogleSignedIn = async (): Promise<boolean> => {
  try {
    return await GoogleSignin.hasPreviousSignIn();
  } catch (error) {
    console.error('Erreur vérification Google Sign-In:', error);
    return false;
  }
};
