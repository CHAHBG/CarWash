# Configuration Base de Données - Car Wash Restaurant

## 🗄️ Structure de la Database

### Database: `carwash_db`

---

## 📋 Collections à créer

### 1. Collection `categories`
**ID**: `categories`
**Permissions**: 
- Read: `Any`
- Create/Update/Delete: `Users` (admin only)

**Attributs**:
- `name` → string, 100, required
- `icon` → string, 100, optional
- `order` → integer, required, default: 0
- `slug` → string, 100, required (ex: "hamburgers", "chawarma")

**Documents à créer**:
```json
[
  {"name": "Hamburgers", "icon": "🍔", "order": 1, "slug": "hamburgers"},
  {"name": "Chawarma", "icon": "🌯", "order": 2, "slug": "chawarma"},
  {"name": "Norvégien", "icon": "🌭", "order": 3, "slug": "norvegien"},
  {"name": "Pachas", "icon": "🥙", "order": 4, "slug": "pachas"},
  {"name": "Wrap", "icon": "🌮", "order": 5, "slug": "wrap"},
  {"name": "Tacos", "icon": "🌮", "order": 6, "slug": "tacos"},
  {"name": "Sandwich", "icon": "🥖", "order": 7, "slug": "sandwich"},
  {"name": "Fataya", "icon": "🥟", "order": 8, "slug": "fataya"},
  {"name": "Panini", "icon": "🥪", "order": 9, "slug": "panini"},
  {"name": "Frites", "icon": "🍟", "order": 10, "slug": "frites"},
  {"name": "Spécialités", "icon": "🍗", "order": 11, "slug": "specialites"},
  {"name": "Pizza", "icon": "🍕", "order": 12, "slug": "pizza"},
  {"name": "Poulet Grillé", "icon": "🍗", "order": 13, "slug": "poulet-grille"},
  {"name": "Jus Naturel", "icon": "🥤", "order": 14, "slug": "jus"},
  {"name": "Café", "icon": "☕", "order": 15, "slug": "cafe"}
]
```

---

### 2. Collection `menu`
**ID**: `menu`
**Permissions**: 
- Read: `Any`
- Create/Update/Delete: `Users` (admin only)

**Attributs**:
- `name` → string, 255, required
- `description` → string, 1000, required
- `price` → integer, required (en FCFA)
- `image` → url, optional (peut être ajouté plus tard)
- `category` → string, 100, required (slug de la catégorie)
- `available` → boolean, required, default: true
- `featured` → boolean, default: false (pour produits mis en avant)
- `order` → integer, default: 0

---

### 3. Collection `users`
**ID**: `users`
**Permissions**: 
- Read: `Users` (own document)
- Create: `Any`
- Update: `Users` (own document)

**Attributs**:
- `accountId` → string, 255, required, unique
- `name` → string, 255, required
- `email` → email, optional
- `phone` → string, 20, optional
- `avatar` → url, optional
- `authMethod` → string, 50, required (email, phone, google, apple)
- `biometricEnabled` → boolean, default: false
- `loyaltyPoints` → integer, default: 0
- `createdAt` → datetime, required

---

### 4. Collection `orders`
**ID**: `orders`
**Permissions**: 
- Read: `Users` (own document) + `Any` (for guests)
- Create: `Any`
- Update: `Users`

**Attributs**:
- `userId` → string, 255, optional
- `guestId` → string, 255, optional
- `guestName` → string, 255, optional
- `guestPhone` → string, 20, optional
- `guestAddress` → string, 500, optional
- `items` → string, 10000, required (JSON array)
- `total` → integer, required (en FCFA)
- `deliveryFee` → integer, required, default: 2500
- `paymentMethod` → string, 50, required (cash, orange, wave, card)
- `paymentStatus` → string, 50, default: "pending" (pending, paid, failed)
- `status` → string, 50, required, default: "pending" (pending, confirmed, preparing, ready, delivered, cancelled)
- `createdAt` → datetime, required
- `updatedAt` → datetime, optional

---

### 5. Collection `payment_transactions` (optionnel)
**ID**: `payment_transactions`

**Attributs**:
- `orderId` → string, 255, required
- `amount` → integer, required
- `method` → string, 50, required (orange, wave, stripe, cash)
- `transactionId` → string, 255, optional (ID du provider)
- `status` → string, 50, required (pending, success, failed)
- `createdAt` → datetime, required
- `metadata` → string, 1000, optional (JSON)

---

## 📦 Storage Bucket

### Bucket `images`
**ID**: `images`
**Permissions**: 
- Read: `Any`
- Create: `Users`

**Configuration**:
- Max file size: 5 MB
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Compression: Enabled

---

## 🎯 Prochaines étapes

1. **Créer les collections dans Appwrite Console**
2. **Peupler les catégories et produits** (voir fichier MENU_DATA.json)
3. **Tester la récupération des données**
4. **Implémenter l'écran de commande avec paiements**

**Temps estimé**: 30-45 minutes
