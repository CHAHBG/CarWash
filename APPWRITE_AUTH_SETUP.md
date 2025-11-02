# Configuration Appwrite avec Authentification Avancée

## 🎯 Objectifs
- ✅ Connexion par **Code OTP (SMS)**
- ✅ Connexion **Biométrique** (Face ID, Touch ID, Fingerprint)
- ✅ Connexion **OAuth2** (Google, Apple)
- ✅ Collection du **nom utilisateur** obligatoire pour tous les modes

---

## 📱 ÉTAPE 1 : Créer le projet Appwrite Cloud

### 1.1 Créer le compte et le projet

1. Allez sur https://cloud.appwrite.io
2. Créez un compte ou connectez-vous
3. Cliquez sur **"Create Project"**
4. **Nom** : `Car Wash Restaurant`
5. **Region** : Europe (Frankfurt) - proche de l'Afrique
6. Copiez le **Project ID** généré

### 1.2 Configurer les plateformes

Dans **Settings** > **Platforms** :

**Android :**
- Name : `Car Wash Restaurant Android`
- Package Name : `com.carwash.restaurant`

**iOS :**
- Name : `Car Wash Restaurant iOS`
- Bundle ID : `com.carwash.restaurant`

**Web (pour OAuth redirections) :**
- Name : `Car Wash Restaurant Web`
- Hostname : `localhost` (développement)

---

## 🔐 ÉTAPE 2 : Configurer l'authentification

### 2.1 Activer les méthodes d'authentification

Allez dans **Auth** > **Settings** :

#### ✅ Email/Password
- Activé par défaut
- Laissez activé (backup method)

#### ✅ Phone (SMS)
1. Cliquez sur **"Phone"** > **Enable**
2. Choisissez un provider SMS :
   - **Twilio** (recommandé, plan gratuit : $15 de crédit)
   - **Vonage** (gratuit jusqu'à 1000 SMS/mois)
   - **MSG91** (bon pour l'Afrique)
3. Configurez les credentials du provider :

**Pour Twilio :**
```
Account SID : xxxxx
Auth Token : xxxxx
From Number : +1234567890
```

**Pour MSG91 (Sénégal) :**
```
Auth Key : xxxxx
Template ID : xxxxx
Sender ID : CARWSH
```

4. Testez l'envoi d'un SMS

#### ✅ Google OAuth
1. **Créer un projet Google Cloud** :
   - https://console.cloud.google.com
   - Créez un nouveau projet `Car Wash Restaurant`
   - Activez **Google+ API**

2. **Créer des identifiants OAuth 2.0** :
   - Allez dans **APIs & Services** > **Credentials**
   - **Create Credentials** > **OAuth 2.0 Client ID**
   
   **Android :**
   - Type : Android
   - Package Name : `com.carwash.restaurant`
   - SHA-1 : Obtenir avec `keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey` (password: `android`)
   
   **iOS :**
   - Type : iOS
   - Bundle ID : `com.carwash.restaurant`
   
   **Web (pour callback) :**
   - Type : Web application
   - Redirect URIs : 
     - `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[PROJECT_ID]`
     - `http://localhost:19006` (dev)

3. **Dans Appwrite** :
   - **Auth** > **Settings** > **OAuth2 Providers**
   - Activez **Google**
   - Collez **Client ID** et **Client Secret**

#### ✅ Apple Sign In
1. **Apple Developer Account requis** (99$/an)
2. **Créer un Service ID** :
   - https://developer.apple.com/account/resources/identifiers/list/serviceId
   - Identifier : `com.carwash.restaurant.signin`
   - Enable **Sign in with Apple**
   - Configure Domains : `cloud.appwrite.io`
   - Redirect URL : `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/apple/[PROJECT_ID]`

3. **Créer une Key** :
   - https://developer.apple.com/account/resources/authkeys/list
   - Enable **Sign in with Apple**
   - Download la clé `.p8`

4. **Dans Appwrite** :
   - Activez **Apple**
   - Service ID : `com.carwash.restaurant.signin`
   - Team ID : Trouvez-le dans Apple Developer
   - Key ID : ID de la clé créée
   - Private Key : Contenu du fichier `.p8`

---

## 🗄️ ÉTAPE 3 : Créer la base de données et collections

### 3.1 Créer la database

1. **Databases** > **Create Database**
2. Name : `carwash_db`
3. Database ID : `carwash_db`

### 3.2 Collection `users`

**Settings :**
- Collection ID : `users`
- Permissions : 
  - `Any` : Rien
  - `Users` : Read, Update (son propre document)

**Attributs :**
- `accountId` (string, 255, required, unique)
- `name` (string, 255, required)
- `email` (email, optional)
- `phone` (string, 20, optional)
- `avatar` (url, optional)
- `authMethod` (string, 50, required) - values: `email`, `phone`, `google`, `apple`, `biometric`
- `biometricEnabled` (boolean, default: false)
- `loyaltyPoints` (integer, default: 0)
- `createdAt` (datetime, required)

**Indexes :**
- `accountId_idx` : key=accountId, type=unique
- `phone_idx` : key=phone, type=key

### 3.3 Collection `categories`

- Collection ID : `categories`
- Permissions : `Any` (Read), `Users` avec role admin (Create, Update, Delete)

**Attributs :**
- `name` (string, 100, required)
- `icon` (string, 100, optional)
- `order` (integer, default: 0)

### 3.4 Collection `menu`

- Collection ID : `menu`
- Permissions : `Any` (Read), `Users` avec role admin (Create, Update, Delete)

**Attributs :**
- `name` (string, 255, required)
- `description` (string, 1000, optional)
- `price` (integer, required)
- `image` (url, required)
- `category` (string, 100, required)
- `available` (boolean, default: true)
- `featured` (boolean, default: false)

### 3.5 Collection `orders`

- Collection ID : `orders`
- Permissions : `Any` (Create), `Users` (Read own, Update own)

**Attributs :**
- `userId` (string, 255, optional)
- `guestId` (string, 255, optional)
- `guestName` (string, 255, optional)
- `guestPhone` (string, 20, optional)
- `guestAddress` (string, 500, optional)
- `items` (string, 10000, required) - JSON
- `total` (integer, required)
- `deliveryFee` (integer, required)
- `paymentMethod` (string, 50, required)
- `status` (string, 50, required, default: `pending`)
- `createdAt` (datetime, required)

### 3.6 Créer le bucket de stockage

1. **Storage** > **Create Bucket**
2. Name : `images`
3. Bucket ID : `images`
4. Permissions : `Any` (Read), `Users` (Create)
5. File Extensions : `.jpg, .jpeg, .png, .webp`
6. Max Size : 5 MB

---

## 🔧 ÉTAPE 4 : Configuration dans le code

### 4.1 Mettre à jour `.env`

```properties
# Configuration Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=VOTRE_PROJECT_ID_ICI
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

# SMS Provider (Twilio ou MSG91)
EXPO_PUBLIC_SMS_PROVIDER=twilio
EXPO_PUBLIC_TWILIO_ACCOUNT_SID=
EXPO_PUBLIC_TWILIO_AUTH_TOKEN=
EXPO_PUBLIC_TWILIO_PHONE_NUMBER=

# OAuth (optionnel si géré par Appwrite)
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=
EXPO_PUBLIC_APPLE_CLIENT_ID=
```

### 4.2 Installer les dépendances

```bash
npm install react-native-appwrite@latest
npm install expo-local-authentication
npm install expo-secure-store
npm install @react-native-google-signin/google-signin
npm install @invertase/react-native-apple-authentication
```

---

## 📝 ÉTAPE 5 : Peupler les données de test

### 5.1 Ajouter les catégories

Dans Appwrite Console > Databases > carwash_db > categories > Create Document :

```json
[
  {"name": "Tout", "icon": "🍽️", "order": 1},
  {"name": "Plats Principaux", "icon": "🍛", "order": 2},
  {"name": "Grillades", "icon": "🍖", "order": 3},
  {"name": "Poissons", "icon": "🐟", "order": 4},
  {"name": "Accompagnements", "icon": "🍟", "order": 5},
  {"name": "Boissons", "icon": "🥤", "order": 6},
  {"name": "Desserts", "icon": "🍰", "order": 7}
]
```

### 5.2 Ajouter des plats de test

```json
[
  {
    "name": "Thiéboudienne",
    "description": "Riz au poisson traditionnel sénégalais",
    "price": 3500,
    "image": "URL_IMAGE",
    "category": "Poissons",
    "available": true,
    "featured": true
  },
  {
    "name": "Yassa Poulet",
    "description": "Poulet mariné aux oignons et citron",
    "price": 3000,
    "image": "URL_IMAGE",
    "category": "Plats Principaux",
    "available": true,
    "featured": true
  }
]
```

---

## ✅ Vérification

Après setup :
1. ✅ Projet créé et configuré
2. ✅ Auth Phone activée avec provider SMS
3. ✅ OAuth Google et Apple configurés
4. ✅ Database et collections créées
5. ✅ Fichier `.env` mis à jour
6. ✅ Dépendances installées
7. ✅ Données de test ajoutées

**Prochaine étape : Implémentation du code pour OTP, Biométrique, OAuth !**
