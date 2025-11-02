# Configuration Appwrite pour Car Wash Restaurant

## ⚠️ PROBLÈME ACTUEL

Votre projet Appwrite actuel (`68627e51001f88fe26ff`) est **ARCHIVÉ** et ne peut pas être modifié.

L'erreur affichée dans l'application :
```
AppwriteException: Project is archived and cannot be modified. 
Please contact the organization admin for details.
```

## 🔧 SOLUTION : Créer un nouveau projet Appwrite

### Étape 1 : Créer un nouveau projet

1. Allez sur https://cloud.appwrite.io
2. Connectez-vous à votre compte
3. Cliquez sur "Create Project"
4. Nommez le projet : **Car Wash Restaurant**
5. Copiez le **Project ID** généré

### Étape 2 : Configurer les plateformes

1. Dans votre projet, allez dans **Settings** > **Platforms**
2. Ajoutez une **Android App**:
   - **Name**: Car Wash Restaurant
   - **Package Name**: `com.carwash.restaurant`
3. Ajoutez une **iOS App**:
   - **Name**: Car Wash Restaurant
   - **Bundle ID**: `com.carwash.restaurant`

### Étape 3 : Créer la base de données

1. Allez dans **Databases** > **Create Database**
2. **Database Name**: `carwash_db`
3. **Database ID**: Laissez auto-générer ou utilisez `carwash_db`
4. Copiez le **Database ID**

### Étape 4 : Créer les collections

#### Collection 1 : **users**
- **Collection ID**: `users`
- **Permissions**: `Users` (read/write pour l'utilisateur authentifié)

Attributs:
- `accountId` (string, 255, required)
- `name` (string, 255, required)
- `email` (email, required)
- `avatar` (url, optional)

#### Collection 2 : **categories**
- **Collection ID**: `categories`
- **Permissions**: `Any` (lecture publique), `Users` (écriture admin seulement)

Attributs:
- `name` (string, 100, required)
- `icon` (string, 100, optional)

#### Collection 3 : **menu**
- **Collection ID**: `menu`
- **Permissions**: `Any` (lecture publique), `Users` (écriture admin seulement)

Attributs:
- `name` (string, 255, required)
- `description` (string, 1000, optional)
- `price` (integer, required) - Prix en FCFA
- `image` (url, required)
- `categories` (string, 100, array, required)
- `available` (boolean, default: true)

#### Collection 4 : **orders** (pour le système de commandes)
- **Collection ID**: `orders`
- **Permissions**: `Any` (création), `Users` (lecture/modification)

Attributs:
- `userId` (string, 255, optional) - Pour utilisateurs authentifiés
- `guestId` (string, 255, optional) - Pour invités
- `guestName` (string, 255, optional)
- `guestPhone` (string, 20, optional)
- `guestAddress` (string, 500, optional)
- `items` (string, 10000, required) - JSON des articles
- `total` (integer, required) - Total en FCFA
- `deliveryFee` (integer, required) - Frais de livraison
- `paymentMethod` (string, 50, required) - cash, orange, wave, card
- `status` (string, 50, required) - pending, confirmed, delivered, cancelled
- `createdAt` (datetime, required)

### Étape 5 : Créer le Bucket de stockage

1. Allez dans **Storage** > **Create Bucket**
2. **Bucket Name**: `images`
3. **Bucket ID**: `images`
4. **Permissions**: `Any` (lecture publique)
5. **File Extensions**: `.jpg, .jpeg, .png, .webp`
6. **Maximum File Size**: 5 MB

### Étape 6 : Mettre à jour le fichier .env

Modifiez le fichier `.env` à la racine du projet :

```properties
# Configuration Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=VOTRE_NOUVEAU_PROJECT_ID_ICI
EXPO_PUBLIC_APPWRITE_DATABASE_ID=VOTRE_DATABASE_ID_ICI
EXPO_PUBLIC_APPWRITE_BUCKET_ID=images

# Collections Appwrite
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=users
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=menu
EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders

# Restaurant Info
EXPO_PUBLIC_RESTAURANT_PHONE=+221 77 123 45 67
EXPO_PUBLIC_RESTAURANT_LOCATION=Thiès, Sénégal

# Paiements Mobile Money (à configurer plus tard)
EXPO_PUBLIC_ORANGE_MONEY_API_KEY=
EXPO_PUBLIC_WAVE_API_KEY=
EXPO_PUBLIC_STRIPE_KEY=
```

### Étape 7 : Peupler les données de test

Vous pouvez utiliser le script de seed (si disponible) ou ajouter manuellement via l'interface Appwrite.

**Exemple de catégories** (à ajouter via Console Appwrite):
1. Tout
2. Plats Principaux
3. Grillades
4. Poissons
5. Accompagnements
6. Boissons
7. Desserts

**Exemple de plats** (à ajouter manuellement ou via script):
- Thiéboudienne (Poissons, 3500 FCFA)
- Yassa Poulet (Plats Principaux, 3000 FCFA)
- Mafé (Plats Principaux, 3200 FCFA)
- Brochettes (Grillades, 2500 FCFA)
- Attiéké Poisson (Poissons, 4000 FCFA)
- Alloco (Accompagnements, 1500 FCFA)
- Bissap (Boissons, 500 FCFA)

### Étape 8 : Redémarrer l'application

```bash
# Arrêter le serveur actuel (Ctrl+C)
# Vider le cache
npx expo start -c
```

## ✅ Vérification

Après configuration, vous devriez pouvoir :
- ✅ Se connecter sans erreur d'archivage
- ✅ Voir les catégories et plats dans l'application
- ✅ Commander en tant qu'invité ou utilisateur authentifié
- ✅ Consulter votre profil

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que tous les IDs sont correctement copiés dans `.env`
2. Assurez-vous que les permissions des collections sont bien configurées
3. Redémarrez l'application avec le cache vidé : `npx expo start -c`

## 🔗 Documentation Appwrite

- Guide complet : https://appwrite.io/docs
- React Native : https://appwrite.io/docs/quick-starts/react-native
- Cloud Console : https://cloud.appwrite.io
