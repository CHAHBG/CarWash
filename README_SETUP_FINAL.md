# 🎉 Setup Appwrite Complet - Car Wash Restaurant

## ✅ Ce qui a été fait

### 1. **Dépendances installées**
```bash
✅ expo-local-authentication (Face ID, Touch ID, Fingerprint)
✅ expo-secure-store (Stockage sécurisé des tokens)
✅ @react-native-google-signin/google-signin (Connexion Google)
✅ @invertase/react-native-apple-authentication (Connexion Apple)
✅ expo-apple-authentication (Support Apple iOS)
```

### 2. **Fichiers créés**

#### Services d'authentification
- `lib/authServices.ts` - OTP SMS + Authentification biométrique
- `lib/oauthServices.ts` - Google + Apple OAuth

#### Écrans
- `app/(auth)/sign-in-phone.tsx` - Écran de connexion par OTP SMS avec 3 étapes :
  1. Saisie du numéro de téléphone (+221)
  2. Vérification du code OTP (6 chiffres)
  3. Saisie du nom (si nouvel utilisateur)

#### Modifications
- `app/(auth)/sign-in.tsx` - Ajout des boutons :
  - 🔒 Connexion biométrique (si disponible)
  - 📱 Connexion par SMS (OTP)
  - 🔴 Continuer avec Google
  - 🍎 Continuer avec Apple (iOS uniquement)
  
- `app/(tabs)/profile.tsx` - Support biométrique ajouté (backend à compléter)

### 3. **Documentation complète**
- `APPWRITE_AUTH_SETUP.md` - Guide complet de configuration Appwrite

---

## 🚀 Prochaines étapes OBLIGATOIRES

### Étape 1 : Créer le projet Appwrite

1. **Allez sur** https://cloud.appwrite.io
2. **Créez un compte** ou connectez-vous
3. **Create Project** → Nom : `Car Wash Restaurant`
4. **Copiez le Project ID** généré (ex: `67891a2b3c4d5e6f`)

---

### Étape 2 : Configurer l'authentification par téléphone (OTP)

#### 2.1 Activer Phone Auth dans Appwrite

1. Dans votre projet → **Auth** → **Settings**
2. Activez **"Phone"**
3. Choisissez un provider SMS :

**Option A : Twilio (Recommandé - 15$ de crédit gratuit)**
- Inscription : https://www.twilio.com/try-twilio
- Obtenez : Account SID, Auth Token, Phone Number
- Configurez dans Appwrite

**Option B : MSG91 (Bon pour l'Afrique)**
- Inscription : https://msg91.com
- Obtenez : Auth Key, Template ID
- Configurez dans Appwrite

**Option C : Vonage (1000 SMS gratuits/mois)**
- Inscription : https://www.vonage.com
- Configurez dans Appwrite

#### 2.2 Tester l'envoi de SMS
- Envoyez un SMS de test depuis la console Appwrite
- Vérifiez la réception sur votre téléphone

---

### Étape 3 : Configurer Google OAuth

#### 3.1 Créer un projet Google Cloud

1. **Allez sur** https://console.cloud.google.com
2. **Créez un projet** : `Car Wash Restaurant`
3. **Activez** Google+ API ou Google Sign-In API

#### 3.2 Créer les identifiants OAuth 2.0

**Pour Android :**
1. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Type : **Android**
3. Package Name : `com.carwash.restaurant`
4. SHA-1 certificate fingerprint : Obtenir avec :
   ```bash
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   ```
   Password : `android`
5. Copiez le **Client ID Android**

**Pour iOS :**
1. Créez un autre **OAuth 2.0 Client ID**
2. Type : **iOS**
3. Bundle ID : `com.carwash.restaurant`
4. Copiez le **Client ID iOS**

**Pour Web (callback) :**
1. Créez un troisième **OAuth 2.0 Client ID**
2. Type : **Web application**
3. Authorized redirect URIs :
   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/VOTRE_PROJECT_ID
   ```
4. Copiez **Client ID** et **Client Secret**

#### 3.3 Configurer dans Appwrite

1. **Auth** → **Settings** → **OAuth2 Providers**
2. Activez **Google**
3. Entrez **Client ID** (Web) et **Client Secret**
4. Save

---

### Étape 4 : Configurer Apple Sign In (Optionnel - iOS uniquement)

**Prérequis : Apple Developer Account (99$/an)**

1. **Apple Developer** → https://developer.apple.com/account
2. **Certificates, Identifiers & Profiles** → **Identifiers** → **+**
3. Créez un **Service ID** :
   - Identifier : `com.carwash.restaurant.signin`
   - Activez **Sign in with Apple**
   - Configure : Domain = `cloud.appwrite.io`
   - Return URL = `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/apple/VOTRE_PROJECT_ID`

4. **Créez une Key** :
   - **Keys** → **+**
   - Activez **Sign in with Apple**
   - Download le fichier `.p8`

5. **Dans Appwrite** :
   - **Auth** → **OAuth2 Providers** → Activez **Apple**
   - Service ID : `com.carwash.restaurant.signin`
   - Team ID : (trouvez-le dans Apple Developer)
   - Key ID : (ID de la clé créée)
   - Private Key : (contenu du .p8)

---

### Étape 5 : Créer la Database et Collections

#### 5.1 Créer la Database

1. **Databases** → **Create Database**
2. Name : `carwash_db`
3. Database ID : `carwash_db`

#### 5.2 Collection `users` (IMPORTANTE pour OTP/OAuth)

**Create Collection** :
- Collection ID : `users`
- Permissions :
  - Read : `Users` (chaque utilisateur peut lire son propre document)
  - Create : `Any` (n'importe qui peut créer un compte)
  - Update : `Users` (chaque utilisateur peut modifier son propre document)

**Attributs** (dans l'ordre) :
1. `accountId` → string, 255, **required**, **unique**
2. `name` → string, 255, **required**
3. `email` → email, **optional**
4. `phone` → string, 20, **optional**
5. `avatar` → url, **optional**
6. `authMethod` → string, 50, **required** (valeurs: email, phone, google, apple, biometric)
7. `biometricEnabled` → boolean, default: `false`
8. `loyaltyPoints` → integer, default: `0`
9. `createdAt` → datetime, **required**

**Indexes** :
- `accountId_idx` : key=`accountId`, type=`unique`
- `phone_idx` : key=`phone`, type=`key`

#### 5.3 Collection `categories`

- Collection ID : `categories`
- Permissions : `Any` (Read)

**Attributs** :
- `name` → string, 100, required
- `icon` → string, 100, optional
- `order` → integer, default: 0

#### 5.4 Collection `menu`

- Collection ID : `menu`
- Permissions : `Any` (Read)

**Attributs** :
- `name` → string, 255, required
- `description` → string, 1000, optional
- `price` → integer, required
- `image` → url, required
- `category` → string, 100, required
- `available` → boolean, default: true
- `featured` → boolean, default: false

#### 5.5 Collection `orders`

- Collection ID : `orders`
- Permissions : `Any` (Create), `Users` (Read own)

**Attributs** :
- `userId` → string, 255, optional
- `guestId` → string, 255, optional
- `guestName` → string, 255, optional
- `guestPhone` → string, 20, optional
- `guestAddress` → string, 500, optional
- `items` → string, 10000, required (JSON)
- `total` → integer, required
- `deliveryFee` → integer, required
- `paymentMethod` → string, 50, required
- `status` → string, 50, required, default: `pending`
- `createdAt` → datetime, required

#### 5.6 Créer le Storage Bucket

1. **Storage** → **Create Bucket**
2. Name : `images`
3. Bucket ID : `images`
4. Permissions : `Any` (Read), `Users` (Create)
5. File Extensions : `.jpg, .jpeg, .png, .webp`
6. Max Size : 5 MB

---

### Étape 6 : Mettre à jour le fichier `.env`

Ouvrez `.env` à la racine du projet et remplacez :

```properties
# Configuration Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=VOTRE_PROJECT_ID_ICI_67891a2b3c4d5e6f
EXPO_PUBLIC_APPWRITE_DATABASE_ID=carwash_db
EXPO_PUBLIC_APPWRITE_BUCKET_ID=images

# Collections
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=users
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=menu
EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders

# Restaurant
EXPO_PUBLIC_RESTAURANT_PHONE=+221 77 123 45 67
EXPO_PUBLIC_RESTAURANT_LOCATION=Thiès, Sénégal

# Google OAuth (Client IDs depuis Google Cloud Console)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=VOTRE_IOS_CLIENT_ID.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com

# Apple OAuth (si configuré)
EXPO_PUBLIC_APPLE_CLIENT_ID=com.carwash.restaurant.signin
```

---

### Étape 7 : Configurer Google Sign-In dans le code

Ouvrez `app/_layout.tsx` et ajoutez :

```typescript
import { configureGoogleSignIn } from '@/lib/oauthServices';

// Dans le useEffect au démarrage
useEffect(() => {
  configureGoogleSignIn(); // Ajouter cette ligne
  // ... reste du code
}, []);
```

---

### Étape 8 : Peupler les données de test

Dans Appwrite Console → Databases → carwash_db :

**Categories** (Créer 7 documents) :
```json
{"name": "Tout", "icon": "🍽️", "order": 1}
{"name": "Plats Principaux", "icon": "🍛", "order": 2}
{"name": "Grillades", "icon": "🍖", "order": 3}
{"name": "Poissons", "icon": "🐟", "order": 4}
{"name": "Accompagnements", "icon": "🍟", "order": 5}
{"name": "Boissons", "icon": "🥤", "order": 6}
{"name": "Desserts", "icon": "🍰", "order": 7}
```

**Menu** (Exemples - ajoutez vos plats) :
```json
{
  "name": "Thiéboudienne",
  "description": "Riz au poisson traditionnel sénégalais avec légumes",
  "price": 3500,
  "image": "https://example.com/thiebu.jpg",
  "category": "Poissons",
  "available": true,
  "featured": true
}
```

---

### Étape 9 : Tester l'application

```bash
# Arrêter le serveur actuel (Ctrl+C)

# Nettoyer le cache
npx expo start -c

# Ou simplement
npm start
```

**Tests à effectuer :**
1. ✅ Connexion par SMS (OTP) avec un vrai numéro
2. ✅ Connexion avec Google
3. ✅ Connexion biométrique (après première connexion)
4. ✅ Navigation vers les offres depuis Home
5. ✅ Commander en tant qu'invité
6. ✅ Commander en tant qu'utilisateur authentifié
7. ✅ Voir le profil avec options biométriques

---

## 📱 Configuration des Deep Links (pour OAuth)

Pour que les callbacks OAuth fonctionnent :

### Android (`app.json`) :
```json
{
  "expo": {
    "scheme": "carwashrestaurant",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "carwashrestaurant",
              "host": "auth",
              "pathPrefix": "/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### iOS (`app.json`) :
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.carwash.restaurant",
      "associatedDomains": ["applinks:carwash-restaurant.com"]
    }
  }
}
```

---

## 🔐 Sécurité et Production

Avant de publier en production :

1. **Variables d'environnement** :
   - Ne commitez JAMAIS le fichier `.env` avec les vraies clés
   - Utilisez des secrets Expo : `npx eas secret:create`

2. **OAuth Production** :
   - Utilisez des keystores signés pour Android
   - Activez App Attestation pour iOS

3. **Rate Limiting** :
   - Limitez les tentatives d'OTP (Appwrite le fait automatiquement)

4. **Monitoring** :
   - Configurez Sentry pour les erreurs
   - Suivez les métriques Appwrite

---

## 🆘 Problèmes courants

### "Project is archived"
→ Créez un nouveau projet Appwrite (votre ancien est archivé)

### "Invalid credentials" (Google)
→ Vérifiez que le SHA-1 correspond à votre keystore

### "SMS not sent"
→ Vérifiez la configuration du provider SMS dans Appwrite

### "Biometric not available"
→ Testez sur un vrai appareil avec Face ID/Touch ID activé

### "OAuth callback not working"
→ Vérifiez les deep links dans `app.json`

---

## 📚 Documentation

- Appwrite Auth : https://appwrite.io/docs/products/auth
- Appwrite Phone Auth : https://appwrite.io/docs/products/auth/phone-sms
- Appwrite OAuth : https://appwrite.io/docs/products/auth/oauth2
- Google Sign-In : https://github.com/react-native-google-signin/google-signin
- Expo Local Auth : https://docs.expo.dev/versions/latest/sdk/local-authentication/

---

## ✅ Checklist finale

Avant de lancer :

- [ ] Projet Appwrite créé
- [ ] Database `carwash_db` créée
- [ ] Collection `users` créée avec les bons attributs
- [ ] Collections `categories`, `menu`, `orders` créées
- [ ] Storage bucket `images` créé
- [ ] Phone Auth activé avec provider SMS configuré
- [ ] Google OAuth configuré (Client IDs créés)
- [ ] Fichier `.env` mis à jour avec les bons IDs
- [ ] Google Sign-In configuré dans le code
- [ ] Données de test ajoutées (catégories + quelques plats)
- [ ] Application testée avec `npx expo start -c`

---

🎉 **Une fois tout configuré, votre app supportera :**
- ✅ Connexion par Email/Mot de passe
- ✅ Connexion par SMS (OTP) avec code à 6 chiffres
- ✅ Connexion biométrique (Face ID, Touch ID, Fingerprint)
- ✅ Connexion Google (Android + iOS)
- ✅ Connexion Apple (iOS uniquement)
- ✅ Mode invité (commander sans compte)
- ✅ Nom obligatoire pour tous les utilisateurs

**Bon courage ! 🚀**
