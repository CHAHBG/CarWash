# Configuration MSG91 pour Appwrite - Guide Complet

## ✅ Vos informations

```
Project ID Appwrite : 6905ffc70017b29b34c7
MSG91 API Key       : 475944A0JRpuO7l690603feP1
```

---

## 📱 Étape 1 : Créer un Template SMS sur MSG91

### 1.1 Connexion à MSG91

1. Allez sur https://control.msg91.com/
2. Connectez-vous avec votre compte
3. Dans le menu latéral, cliquez sur **"SMS"** → **"Templates"**

### 1.2 Créer un nouveau Template

1. Cliquez sur **"Create Template"** ou **"+ New Template"**
2. Remplissez le formulaire :

**Template Name :**
```
Car Wash OTP Verification
```

**Template Type :**
- Sélectionnez : **"Transactional"** (important pour OTP)

**Message Content :**
```
{{otp}} est votre code de vérification Car Wash Restaurant. 
Valide pendant 5 minutes. Ne partagez ce code avec personne.
```

**Variables :**
- MSG91 détectera automatiquement `{{otp}}` comme variable

**DLT Template ID :** (si demandé pour le Sénégal)
- Laissez vide ou suivez les instructions MSG91
- Pour le Sénégal, ce n'est généralement pas obligatoire

3. Cliquez sur **"Submit"** ou **"Create Template"**
4. Attendez l'approbation (généralement instantanée pour les templates transactionnels)

### 1.3 Copier le Template ID

Une fois créé, vous verrez :
```
Template ID : 67890abcdef12345 (exemple)
Status      : Approved ✅
```

**Copiez ce Template ID**, vous en aurez besoin !

---

## 🔧 Étape 2 : Configurer Appwrite avec MSG91

### 2.1 Accéder à la configuration Phone Auth

1. Allez sur https://cloud.appwrite.io
2. Sélectionnez votre projet : **Car Wash Restaurant** (6905ffc70017b29b34c7)
3. Dans le menu latéral : **Auth** → **Settings**
4. Faites défiler jusqu'à **"Phone Auth"**
5. Cliquez sur **"Enable"** si pas déjà activé

### 2.2 Configurer MSG91

Dans la section **Phone Authentication Provider** :

1. **Provider** : Sélectionnez **"MSG91"**

2. **Auth Key** :
   ```
   475944A0JRpuO7l690603feP1
   ```

3. **Sender ID** :
   ```
   CARWSH
   ```
   *(ou votre Sender ID approuvé MSG91)*
   
   **Note :** Si vous n'avez pas de Sender ID approuvé :
   - Utilisez : `TXTLCL` (generic)
   - Ou demandez l'approbation d'un Sender ID dans MSG91 Console

4. **Template ID** :
   ```
   VOTRE_TEMPLATE_ID_COPIE_ETAPE_1
   ```
   *(Exemple : 67890abcdef12345)*

5. **DLT Entity ID** : *(Optionnel pour le Sénégal)*
   ```
   (laissez vide)
   ```

6. Cliquez sur **"Update"** ou **"Save"**

---

## ✅ Étape 3 : Tester l'envoi de SMS

### 3.1 Test depuis Appwrite Console

1. Restez dans **Auth** → **Settings** → **Phone Auth**
2. Cherchez **"Test Phone Authentication"**
3. Entrez un numéro de test au format international :
   ```
   +221771234567
   ```
4. Cliquez sur **"Send OTP"**
5. Vous devriez recevoir un SMS avec le code

### 3.2 Vérifier le SMS reçu

Le SMS devrait ressembler à :
```
123456 est votre code de vérification Car Wash Restaurant. 
Valide pendant 5 minutes. Ne partagez ce code avec personne.
```

---

## 📝 Étape 4 : Mettre à jour votre fichier .env

Ouvrez `.env` à la racine du projet et mettez à jour :

```properties
# Configuration Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=6905ffc70017b29b34c7
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
```

---

## 🚀 Étape 5 : Tester dans l'application

### 5.1 Redémarrer l'application

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer avec cache clear
npx expo start -c
```

### 5.2 Test de connexion par SMS

1. Ouvrez l'app sur votre appareil
2. Allez à l'écran de connexion
3. Cliquez sur **"📱 Connexion par SMS (OTP)"**
4. Entrez votre numéro : `+221 77 123 45 67`
5. Cliquez sur **"Recevoir le code"**
6. Attendez le SMS (arrive en ~5-30 secondes)
7. Entrez le code à 6 chiffres
8. Si nouveau : Entrez votre nom
9. ✅ Vous êtes connecté !

---

## 🔍 Dépannage

### Problème 1 : "Template not found" ou "Invalid template"

**Solution :**
- Vérifiez que le Template ID est correct dans Appwrite
- Assurez-vous que le template est **Approved** dans MSG91
- Attendez quelques minutes après création du template

### Problème 2 : "Invalid Sender ID"

**Solution :**
- Utilisez `TXTLCL` si vous n'avez pas de Sender ID approuvé
- Demandez l'approbation d'un Sender ID personnalisé dans MSG91

### Problème 3 : SMS non reçu

**Solutions :**
- Vérifiez que votre compte MSG91 a du crédit
- Vérifiez le numéro au format international : `+221...`
- Regardez dans MSG91 Dashboard → **Reports** → **SMS Logs**
- Vérifiez que le Sénégal est couvert par MSG91

### Problème 4 : "Auth Key invalid"

**Solution :**
- Revérifiez l'API Key : `475944A0JRpuO7l690603feP1`
- Assurez-vous qu'elle n'a pas expiré dans MSG91
- Générez une nouvelle clé si nécessaire

---

## 💰 Crédits MSG91

Pour vérifier vos crédits :
1. MSG91 Dashboard → **Account** → **Credits**
2. Coût approximatif : 0.01-0.05 USD par SMS vers le Sénégal
3. Rechargez si besoin : https://control.msg91.com/billing/

---

## 📊 Format du Template MSG91 recommandé

Pour un meilleur taux de délivrance :

### Template optimisé :
```
Votre code Car Wash : {{otp}}
Valide 5 min. Ne pas partager.
```

### Template avec détails :
```
{{otp}} est votre code de verification Car Wash Restaurant.
Code valide pendant 5 minutes.
Pour votre securite, ne partagez jamais ce code.
```

**Note :** Évitez les caractères accentués (é, à, etc.) pour une meilleure compatibilité SMS.

---

## 🔐 Variables disponibles dans le Template

MSG91 + Appwrite supportent ces variables :

- `{{otp}}` - Le code de vérification (OBLIGATOIRE)
- `{{company}}` - Nom de l'entreprise (optionnel)
- `{{message}}` - Message personnalisé (optionnel)

**Template minimal requis :**
```
{{otp}}
```

---

## ✅ Checklist finale

- [x] Compte MSG91 créé
- [x] API Key obtenue : 475944A0JRpuO7l690603feP1
- [ ] Template SMS créé sur MSG91
- [ ] Template ID copié
- [ ] Appwrite configuré avec MSG91
- [ ] Test SMS envoyé depuis Appwrite Console
- [ ] SMS reçu sur téléphone
- [ ] Fichier .env mis à jour avec Project ID
- [ ] Application testée avec connexion OTP

---

## 📞 Support MSG91

- Dashboard : https://control.msg91.com/
- Documentation : https://docs.msg91.com/
- Support : support@msg91.com
- Status : https://status.msg91.com/

---

## 🎉 Prochaines étapes

Une fois MSG91 configuré :

1. ✅ Créer les collections Appwrite (users, categories, menu, orders)
2. ✅ Peupler quelques données de test
3. ✅ Tester toutes les fonctionnalités :
   - Connexion OTP
   - Connexion biométrique
   - Mode invité
   - Commande

---

**Temps estimé pour cette configuration : 10-15 minutes**

**Bon courage ! 🚀**
