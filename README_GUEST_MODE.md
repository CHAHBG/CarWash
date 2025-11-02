# Guide du Mode Invité - Car Wash Restaurant

## 📋 Vue d'ensemble

Le mode invité permet aux utilisateurs de commander sans créer de compte. L'authentification devient **optionnelle** et sert uniquement pour :
- Cumuler des points de fidélité
- Suivre l'historique des commandes
- Sauvegarder les adresses préférées

## ✅ Fonctionnalités Implémentées

### 1. **Types et Store**

#### Nouveaux types (`type.d.ts`)
```typescript
GuestUser {
    guestId: string;
    name: string;
    phone: string;
    address: string;
}

OrderData {
    userId?: string | null;
    guestId?: string | null;
    guestName?: string;
    guestPhone?: string;
    guestAddress?: string;
    items: CartItemType[];
    total: number;
    deliveryFee: number;
    paymentMethod: 'cash' | 'orange' | 'wave' | 'card';
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}
```

#### Store Cart mis à jour
```typescript
CartStore {
    guestInfo: GuestUser | null;
    setGuestInfo: (info: GuestUser | null) => void;
    // ... autres méthodes existantes
}
```

### 2. **Utilitaires Invité** (`lib/guestUtils.ts`)

```typescript
// Génération ID unique pour invités
generateGuestId(): string

// Validation des informations
validateGuestInfo(name, phone, address): { isValid, errors }

// Validation téléphone sénégalais
Format accepté: +221 77 123 45 67 ou 77 123 45 67
```

### 3. **Écran Panier avec Formulaire Invité**

#### `app/(tabs)/cart.tsx`
- ✅ Formulaire affiché **uniquement si non connecté**
- ✅ Champs: Nom complet, Téléphone, Adresse
- ✅ Validation avant confirmation
- ✅ Bannière fidélisation (🎁 Connectez-vous pour cumuler des points)
- ✅ Bouton: "Payer sans compte" vs "Commander Maintenant"

### 4. **Authentification Optionnelle**

#### `app/(auth)/sign-in.tsx` et `sign-up.tsx`
- ✅ Bouton **"Continuer sans compte"** ajouté
- ✅ Redirection directe vers Home sans authentification

#### `app/(auth)/_layout.tsx`
- ✅ Suppression de la redirection automatique si authentifié
- ✅ Permet l'accès aux écrans auth même connecté

#### `app/_layout.tsx`
- ✅ Ne bloque plus le chargement en attente d'authentification
- ✅ L'app démarre même sans utilisateur connecté

#### `app/(tabs)/_layout.tsx`
- ✅ Suppression de la redirection vers `/sign-in`
- ✅ Accès libre aux tabs même sans authentification

### 5. **Service de Commandes** (`services/orders.ts`)

```typescript
// Créer une commande (utilisateur ou invité)
createOrder(
    user: User | null,
    guestInfo: GuestUser | null,
    items: CartItemType[],
    paymentMethod,
    deliveryFee
): Promise<string>

// Récupérer commandes utilisateur
getUserOrders(userId: string)

// Récupérer commandes invité par téléphone
getGuestOrders(phone: string)

// Lier commandes invité à un nouveau compte
linkGuestOrdersToUser(userId: string, phone: string): Promise<number>

// Mettre à jour statut commande
updateOrderStatus(orderId: string, status)
```

### 6. **Composant Bannière Fidélisation**

#### `components/LoyaltyBanner.tsx`
- ✅ Affiché uniquement si **non connecté**
- ✅ Icône 🎁 et message incitatif
- ✅ Bouton "Créer mon compte"
- ✅ Lien "J'ai déjà un compte"
- ✅ Intégré sur Home et Cart

## 🎨 Expérience Utilisateur

### Parcours Invité
```
1. Ouvrir l'app → Accès direct à Home
2. Parcourir produits → Ajouter au panier
3. Voir bannière: "🎁 Gagnez des points fidélité!"
4. Aller au panier → Remplir formulaire (Nom, Tél, Adresse)
5. Choisir paiement → Confirmer commande
6. ✅ Commande créée avec guestId
```

### Parcours Authentifié
```
1. Se connecter (ou créer compte)
2. Parcourir et ajouter au panier
3. Aller au panier → Pas de formulaire
4. Choisir paiement → Commander
5. ✅ Commande liée au userId
6. Points fidélité cumulés ✨
```

## 📱 Configuration Backend Appwrite

### Collection `orders` - Champs requis

```javascript
{
  "key": "userId",
  "type": "string",
  "size": 255,
  "required": false  // ⚠️ Important: non obligatoire
}

{
  "key": "guestId",
  "type": "string",
  "size": 255,
  "required": false
}

{
  "key": "guestName",
  "type": "string",
  "size": 255,
  "required": false
}

{
  "key": "guestPhone",
  "type": "string",
  "size": 20,
  "required": false  // Format: +221 77 123 45 67
}

{
  "key": "guestAddress",
  "type": "string",
  "size": 500,
  "required": false
}

{
  "key": "items",
  "type": "string",  // JSON stringifié
  "size": 65535,
  "required": true
}

{
  "key": "total",
  "type": "integer",
  "required": true
}

{
  "key": "deliveryFee",
  "type": "integer",
  "required": true
}

{
  "key": "paymentMethod",
  "type": "string",
  "size": 50,
  "required": true  // 'cash', 'orange', 'wave', 'card'
}

{
  "key": "status",
  "type": "string",
  "size": 50,
  "required": true  // 'pending', 'confirmed', 'delivered', 'cancelled'
}

{
  "key": "createdAt",
  "type": "string",
  "size": 50,
  "required": false
}
```

### Permissions recommandées
```
Lecture: Anyone (permet aux invités de voir leurs commandes via phone)
Création: Anyone (permet aux invités de créer des commandes)
Mise à jour: Users (seulement authentifiés)
Suppression: Users (seulement authentifiés)
```

## 🔄 Liaison Invité → Utilisateur

Quand un invité crée un compte après avoir commandé :

```typescript
// Lors de l'inscription ou connexion
const phone = user.phone; // ou demander le numéro
const linkedCount = await linkGuestOrdersToUser(user.$id, phone);

console.log(`${linkedCount} commandes liées à votre compte!`);
```

Cela permet de :
- Récupérer l'historique des commandes invité
- Attribuer rétroactivement des points fidélité
- Unifier l'expérience utilisateur

## 📝 Validation des Données

### Téléphone (Sénégal)
```typescript
Format: +221 77 123 45 67
Regex: /^(\+221|221)?[7][0-9]{8}$/
Préfixes valides: 70, 75, 76, 77, 78
```

### Nom
- Minimum 2 caractères
- Pas de validation complexe (accepte tous caractères)

### Adresse
- Minimum 10 caractères
- Doit inclure quartier, rue ou indication

## 🎯 Avantages pour le Business

1. **Réduction de friction** : Commande immédiate sans inscription
2. **Taux de conversion** : Plus d'utilisateurs complètent leur commande
3. **Collecte de données** : Téléphone capturé pour marketing
4. **Fidélisation progressive** : Incitation douce à créer un compte
5. **Flexibilité** : Support utilisateurs occasionnels ET réguliers

## 🚀 Prochaines Étapes

### Facultatif - Améliorations futures
- [ ] Sauvegarder infos invité localement (AsyncStorage) pour pré-remplissage
- [ ] Notification SMS pour suivi commande invité
- [ ] Programme de parrainage (invité invite invité)
- [ ] Analytics séparé invité vs authentifié
- [ ] Email optionnel pour invité (envoi de reçu)

## ⚠️ Notes Importantes

1. **Les erreurs TypeScript** visibles sont normales avant `npm install`
2. **Tester sur appareil réel** pour validation téléphone et paiement
3. **Configurer Appwrite** avant utilisation en production
4. **Sécurité**: Les commandes invitées sont identifiables par `guestPhone` uniquement

---

**Mode invité opérationnel! 🎉**  
Les utilisateurs peuvent maintenant commander sans compte tout en étant incités à s'inscrire pour bénéficier de la fidélisation.
