# 🚀 Guide de Configuration Database + Paiements

## 📋 Étape 1 : Créer les Collections Appwrite (15 min)

### 1.1 Créer la Database

1. Appwrite Console → **Databases** → **Create Database**
2. Name : `carwash_db`
3. Database ID : `carwash_db`

---

### 1.2 Créer Collection `categories`

1. **Create Collection**
2. **Collection ID** : `categories`
3. **Permissions** :
   - Read : `Any`
   - Create/Update/Delete : Laisser vide (vous gérerez manuellement)

4. **Create Attributes** (cliquez sur "Create Attribute" 4 fois) :

| Attribute Key | Type | Size | Required | Default | Unique |
|---------------|------|------|----------|---------|--------|
| name | String | 100 | ✅ Yes | - | ❌ No |
| icon | String | 100 | ❌ No | - | ❌ No |
| slug | String | 100 | ✅ Yes | - | ✅ Yes |
| order | Integer | - | ✅ Yes | 0 | ❌ No |

---

### 1.3 Créer Collection `menu`

1. **Create Collection**
2. **Collection ID** : `menu`
3. **Permissions** :
   - Read : `Any`

4. **Create Attributes** :

| Attribute Key | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| name | String | 255 | ✅ Yes | - |
| description | String | 1000 | ✅ Yes | - |
| price | Integer | - | ✅ Yes | - |
| image | URL | - | ❌ No | - |
| category | String | 100 | ✅ Yes | - |
| available | Boolean | - | ✅ Yes | true |
| featured | Boolean | - | ❌ No | false |
| order | Integer | - | ❌ No | 0 |

---

### 1.4 Créer Collection `users`

**Suivez DATABASE_STRUCTURE.md** pour les attributs exacts.

---

### 1.5 Créer Collection `orders`

**Suivez DATABASE_STRUCTURE.md** pour les attributs exacts.

---

## 📦 Étape 2 : Importer les Données (10 min)

### Option A : Import Manuel (Console Appwrite)

#### Catégories (15 documents à créer)

1. Appwrite → Databases → carwash_db → categories
2. **Create Document** (répéter 15 fois)
3. Copier les données depuis `MENU_DATA.json` → section `categories`

**Exemple premier document** :
```json
{
  "name": "Hamburgers",
  "icon": "🍔",
  "slug": "hamburgers",
  "order": 1
}
```

#### Menu (65 produits à créer)

1. Appwrite → Databases → carwash_db → menu
2. **Create Document** (répéter pour chaque produit)
3. Copier les données depuis `MENU_DATA.json` → section `menu`

**Exemple premier document** :
```json
{
  "name": "Hamburger",
  "description": "Pain hamburger + steak burger + frites + œuf + fromage emmental + crudité + sauce burger + mayonnaise ketchup",
  "price": 1500,
  "category": "hamburgers",
  "available": true,
  "featured": false,
  "order": 1
}
```

### Option B : Import via Script (Plus rapide)

Je vais créer un script d'import automatique dans la prochaine étape.

---

## 💳 Étape 3 : Configuration des Paiements

### 3.1 Structure des Méthodes de Paiement

Votre app supporte 4 méthodes :

1. **Cash (Espèces)** - Paiement à la livraison
2. **Orange Money** - Mobile money Sénégal
3. **Wave** - Mobile money Sénégal
4. **Carte bancaire (Stripe)** - International

---

### 3.2 Configuration Orange Money

**API Orange Money Developer** : https://developer.orange.com/

1. Créer un compte sur Orange Developer
2. Créer une application
3. Obtenir les clés :
   - Client ID
   - Client Secret
   - Merchant Key

**Ajouter dans `.env`** :
```properties
EXPO_PUBLIC_ORANGE_MONEY_CLIENT_ID=votre_client_id
EXPO_PUBLIC_ORANGE_MONEY_CLIENT_SECRET=votre_client_secret
EXPO_PUBLIC_ORANGE_MONEY_MERCHANT_KEY=votre_merchant_key
```

---

### 3.3 Configuration Wave

**API Wave** : https://developer.wave.com/

1. Créer un compte Wave Business
2. Accéder à l'API
3. Obtenir les clés :
   - API Key
   - Secret Key

**Ajouter dans `.env`** :
```properties
EXPO_PUBLIC_WAVE_API_KEY=votre_wave_api_key
EXPO_PUBLIC_WAVE_SECRET_KEY=votre_wave_secret
```

---

### 3.4 Configuration Stripe

**Stripe** : https://stripe.com/

1. Créer un compte Stripe
2. Dashboard → Developers → API Keys
3. Obtenir :
   - Publishable Key (pour l'app)
   - Secret Key (pour le backend)

**Ajouter dans `.env`** :
```properties
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_key
```

---

## 🎨 Étape 4 : Tester la Récupération des Données

### 4.1 Mettre à jour le fichier `.env`

```properties
EXPO_PUBLIC_APPWRITE_PROJECT_ID=6905ffc70017b29b34c7
EXPO_PUBLIC_APPWRITE_DATABASE_ID=carwash_db
EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID=users
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=menu
EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders
```

### 4.2 Tester dans l'app

```bash
npx expo start -c
```

1. Ouvrir l'app
2. Aller sur Search ou Home
3. Vérifier que les catégories et produits s'affichent

---

## 🛒 Étape 5 : Écran de Commande avec Paiement

Je vais créer/mettre à jour les fichiers suivants :

1. `app/(tabs)/cart.tsx` - Écran panier amélioré
2. `components/PaymentMethodSelector.tsx` - Sélection méthode paiement
3. `components/OrderSummary.tsx` - Résumé commande
4. `services/payments.ts` - Service paiement (mis à jour)
5. `services/orders.ts` - Service commandes (mis à jour)

---

## ✅ Checklist Complète

### Database
- [ ] Database `carwash_db` créée
- [ ] Collection `categories` créée avec attributs
- [ ] Collection `menu` créée avec attributs
- [ ] Collection `users` créée avec attributs
- [ ] Collection `orders` créée avec attributs
- [ ] 15 catégories importées
- [ ] 65 produits importés

### Paiements
- [ ] Orange Money configuré (optionnel au début)
- [ ] Wave configuré (optionnel au début)
- [ ] Stripe configuré (optionnel au début)
- [ ] Cash toujours disponible ✅

### Application
- [ ] `.env` mis à jour avec IDs collections
- [ ] App testée avec données réelles
- [ ] Écran panier fonctionnel
- [ ] Processus de commande testé

---

## 📞 Prochaines Actions

1. **MAINTENANT** : Créer les collections dans Appwrite Console
2. **ENSUITE** : Importer les catégories (15 documents)
3. **PUIS** : Importer les produits menu (65 documents)
4. **ENFIN** : Tester l'app avec les vraies données

**Temps estimé** : 30-45 minutes pour tout configurer

---

**Besoin d'aide ?** Dites-moi à quelle étape vous êtes bloqué ! 🚀
