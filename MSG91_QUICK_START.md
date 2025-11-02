# 🚀 Configuration Rapide MSG91 + Appwrite

## Vos informations

```
✅ Project ID : 6905ffc70017b29b34c7
✅ MSG91 API Key : 475944A0JRpuO7l690603feP1
✅ Fichier .env : Mis à jour
```

---

## 📋 Ce qu'il reste à faire

### Étape 1 : Créer un Template SMS sur MSG91 (5 min)

1. **Allez sur** : https://control.msg91.com/
2. **Menu** : SMS → Templates
3. **Cliquez** : Create Template / + New Template

**Remplissez :**
```
Template Name    : Car Wash OTP
Template Type    : Transactional (important !)
Message Content  : {{otp}} est votre code Car Wash Restaurant. Valide 5 min.
```

4. **Submit** → Attendez l'approbation (instantané)
5. **Copiez le Template ID** (ex: 67890abcdef12345)

---

### Étape 2 : Configurer Appwrite (3 min)

1. **Allez sur** : https://cloud.appwrite.io
2. **Projet** : Car Wash Restaurant (6905ffc70017b29b34c7)
3. **Menu** : Auth → Settings → Phone Auth
4. **Enable** Phone Auth si pas déjà fait

**Remplissez :**
```
Provider     : MSG91
Auth Key     : 475944A0JRpuO7l690603feP1
Sender ID    : CARWSH (ou TXTLCL)
Template ID  : [VOTRE_TEMPLATE_ID_ETAPE_1]
```

5. **Save**

---

### Étape 3 : Tester (2 min)

**Depuis Appwrite Console :**
1. Auth → Settings → Phone Auth
2. Section "Test Phone Authentication"
3. Numéro : `+221771234567`
4. Send OTP
5. ✅ Vérifiez que vous recevez le SMS

**Depuis l'application :**
```bash
npx expo start -c
```
1. Écran de connexion
2. "📱 Connexion par SMS"
3. Entrez votre numéro
4. ✅ Recevez et entrez le code

---

## ⚠️ Si vous n'avez pas de Sender ID approuvé

**Sender ID générique MSG91 :**
```
TXTLCL
```

**Pour un Sender ID personnalisé :**
1. MSG91 Dashboard → Account → Sender ID
2. Request New Sender ID : `CARWSH`
3. Attendez l'approbation (24-48h)

---

## 💰 Vérifier vos crédits MSG91

**Dashboard** : https://control.msg91.com/billing/

Coût approximatif :
- Sénégal : ~0.02 USD par SMS
- 100 SMS ≈ 2 USD

---

## 🔍 Troubleshooting rapide

### "Template not found"
→ Vérifiez le Template ID dans Appwrite
→ Assurez-vous que le template est "Approved" dans MSG91

### "Invalid Sender ID"
→ Utilisez `TXTLCL` temporairement
→ Demandez l'approbation de `CARWSH`

### SMS non reçu
→ Vérifiez vos crédits MSG91
→ Format numéro : `+221XXXXXXXXX`
→ Regardez MSG91 → Reports → SMS Logs

### "Invalid Auth Key"
→ Revérifiez : `475944A0JRpuO7l690603feP1`
→ Régénérez une clé si besoin

---

## ✅ Checklist

Configuration :
- [ ] Template SMS créé sur MSG91
- [ ] Template ID copié
- [ ] Appwrite Phone Auth configuré avec MSG91
- [ ] Test SMS envoyé depuis Appwrite Console
- [ ] SMS reçu sur téléphone

Application :
- [x] Fichier .env mis à jour avec Project ID
- [ ] App redémarrée : `npx expo start -c`
- [ ] Connexion OTP testée dans l'app

Collections Appwrite (à faire ensuite) :
- [ ] Database `carwash_db` créée
- [ ] Collection `users` créée
- [ ] Collection `categories` créée
- [ ] Collection `menu` créée
- [ ] Collection `orders` créée

---

## 📞 Liens utiles

- **MSG91 Dashboard** : https://control.msg91.com/
- **MSG91 Templates** : https://control.msg91.com/campaign/template
- **Appwrite Console** : https://cloud.appwrite.io/console/project-6905ffc70017b29b34c7
- **Guide complet** : Voir `MSG91_SETUP_GUIDE.md`

---

## 🎯 Après la config MSG91

Une fois le SMS OTP fonctionnel, vous devrez :

1. **Créer les collections Appwrite** (voir README_SETUP_FINAL.md)
2. **Peupler des données de test** (catégories, plats)
3. **Tester toutes les fonctionnalités**

**Temps total restant : ~30 minutes**

---

**Prochaine action :**
👉 Créer le template SMS sur MSG91
👉 Configurer dans Appwrite
👉 Tester !

🚀 **Bon courage !**
