# Car Wash Restaurant - Guide de Configuration

## 📋 Récapitulatif des Modifications

Ce projet a été transformé de "food_ordering" en "Car Wash Restaurant", une application de commande de nourriture entièrement en français avec support de paiement mobile.

## 🎨 Changements Principaux

### 1. Identité du Projet
- **Nom**: Car Wash Restaurant
- **Slug**: car-wash-restaurant
- **Package Android**: com.carwash.restaurant
- **Package iOS**: com.carwash.restaurant
- **Localisation**: Thiès, Sénégal
- **Contact**: +221 77 123 45 67

### 2. Thème et Couleurs
Nouveau fichier: `constants/theme.ts`

```typescript
colors = {
  primary: '#E63946',      // Rouge principal
  secondary: '#F1FAEE',    // Blanc cassé
  dark: '#1D3557',         // Bleu foncé
  accent: '#A8DADC',       // Bleu clair
  warning: '#F77F00',      // Orange
  success: '#06D6A0',      // Vert
}
```

### 3. Catégories Mises à Jour
Fichier: `constants/index.ts`

```typescript
- "All" → "Tout"
- "Burger" → "Plats Principaux"
- "Pizza" → "Grillades"
- "Wrap" → "Poissons"
- "Burrito" → "Accompagnements"
+ "Boissons"
+ "Desserts"
```

### 4. Monnaie et Prix
- Devise: **FCFA** (Franc CFA)
- Frais de livraison: **2500 FCFA**
- Tous les prix affichés en FCFA

### 5. Écrans Traduits en Français

#### Home (`app/(tabs)/index.tsx`)
- Bannière rouge "Car Wash Restaurant"
- Affichage de la localisation (Thiès, Sénégal)
- Bouton d'appel direct au restaurant
- Section "Nos Offres Spéciales"

#### Search (`app/(tabs)/search.tsx`)
- "Rechercher" au lieu de "Search"
- "Trouvez votre plat favori"
- "Aucun résultat trouvé" pour état vide

#### Cart (`app/(tabs)/cart.tsx`)
- Titre "Votre Panier"
- Sélection de mode de paiement:
  - 💵 Espèces
  - 🟠 Orange Money
  - 💙 Wave
  - 💳 Carte Bancaire
- Résumé en français: "Total Articles", "Frais de Livraison", etc.

#### Auth (`app/(auth)/sign-in.tsx` et `sign-up.tsx`)
- "Se Connecter" / "S'inscrire"
- Labels en français: "Email", "Mot de passe", "Nom complet"
- Messages d'erreur en français

### 6. Service de Paiement
Nouveau fichier: `services/payments.ts`

Fonctionnalités:
- `processOrangeMoneyPayment()` - Intégration Orange Money API
- `processWavePayment()` - Intégration Wave API
- `processStripePayment()` - Intégration Stripe
- `processCashPayment()` - Paiement en espèces
- `validatePhoneNumber()` - Validation numéros sénégalais
- `formatAmount()` - Formatage montants en FCFA

### 7. Configuration Appwrite
Fichier: `lib/appwrite.ts`
- Platform: `com.carwash.restaurant`
- Toutes les collections configurables via `.env`
- Support pour collection `orders`

### 8. Variables d'Environnement
Fichier: `.env` (créé)

```env
# Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_BUCKET_ID=

# Collections
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=

# Paiements Mobile Money
EXPO_PUBLIC_ORANGE_MONEY_API_KEY=
EXPO_PUBLIC_ORANGE_MONEY_API_SECRET=
EXPO_PUBLIC_WAVE_API_KEY=
EXPO_PUBLIC_WAVE_API_SECRET=

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Restaurant
EXPO_PUBLIC_RESTAURANT_NAME=Car Wash Restaurant
EXPO_PUBLIC_RESTAURANT_LOCATION=Thiès, Sénégal
EXPO_PUBLIC_RESTAURANT_PHONE=+221 77 123 45 67
EXPO_PUBLIC_DELIVERY_FEE=2500
EXPO_PUBLIC_CURRENCY=FCFA
```

## 🚀 Installation et Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Remplissez le fichier `.env` avec vos clés API:
- Créez un projet sur Appwrite
- Configurez les collections nécessaires
- Ajoutez vos clés de paiement (Orange Money, Wave, Stripe)

### 3. Lancer l'application
```bash
npm start
# ou
npx expo start
```

### 4. Build pour production
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 📱 Fonctionnalités Implémentées

✅ Interface entièrement en français  
✅ Thème rouge/blanc Car Wash  
✅ Support de 4 méthodes de paiement  
✅ Localisation Thiès, Sénégal  
✅ Devise FCFA  
✅ Service de paiement mobile money  
✅ Authentification Appwrite  
✅ Panier avec gestion quantités  
✅ Recherche et filtres  
✅ État Zustand préservé  

## 🔧 Prochaines Étapes

### Configuration Backend Appwrite
1. Créer les collections dans Appwrite:
   - `users`
   - `categories`
   - `menu` / `products`
   - `orders`
   - `customizations`

2. Ajouter les produits du restaurant
3. Configurer les permissions d'accès

### Intégrations Paiement
1. **Orange Money**: 
   - Obtenir clés API sur developer.orange.com
   - Implémenter le flow de paiement

2. **Wave**:
   - Contacter Wave pour accès API
   - Configurer webhook

3. **Stripe**:
   - Installer `@stripe/stripe-react-native`
   - Configurer Payment Intents

### Améliorations UI
- Remplacer les images placeholder
- Ajouter logo Car Wash
- Créer splash screen personnalisé
- Optimiser les icônes

## 📝 Notes Importantes

- Les erreurs de compilation TypeScript visibles sont normales avant `npm install`
- Les services de paiement sont actuellement en mode simulation
- Nécessite la configuration complète d'Appwrite avant utilisation
- Tester sur appareil réel pour fonctionnalités de paiement

## 🤝 Support

Pour toute question sur la configuration:
- Documentation Expo: https://docs.expo.dev
- Documentation Appwrite: https://appwrite.io/docs
- Documentation Stripe: https://stripe.com/docs/mobile

---

**Développé pour Car Wash Restaurant - Thiès, Sénégal** 🇸🇳
