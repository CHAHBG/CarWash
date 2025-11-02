# 🚀 Guide d'importation rapide

## Étapes à suivre

### 1️⃣ Créer les collections Appwrite (OBLIGATOIRE)

Allez sur [Appwrite Console](https://cloud.appwrite.io/console/project-6905ffc70017b29b34c7/databases/database-carwash_db)

**Créer la collection `categories`** :
- Cliquez "Create Collection"
- Collection ID: `categories`
- Permissions : Any (lecture) + Users (écriture)
- Attributs :
  - `name` → String (100) → Required
  - `icon` → String (100) → Required  
  - `slug` → String (100) → Required + Unique
  - `order` → Integer → Required → Default: 0

**Créer la collection `menu`** :
- Collection ID: `menu`
- Permissions : Any (lecture) + Users (écriture)
- Attributs :
  - `name` → String (255) → Required
  - `description` → String (1000) → Required
  - `price` → Integer → Required
  - `image` → URL (2000) → Optional
  - `category` → String (100) → Required
  - `available` → Boolean → Required → Default: true
  - `featured` → Boolean → Required → Default: false
  - `order` → Integer → Required → Default: 0

### 2️⃣ Mettre à jour les IDs dans .env

Après création des collections, copiez leurs IDs et mettez-les dans `.env` :

```env
EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID=menu
```

### 3️⃣ Lancer l'app et importer les données

1. **Démarrer l'app** :
   ```bash
   npm start
   ```

2. **Aller dans l'onglet Admin** (dernier onglet dans le menu du bas)

3. **Cliquer sur "Vérifier les données"** pour voir l'état actuel

4. **Choisir une option d'import** :
   - `Importer les catégories (15)` : Import les 15 catégories en premier
   - `Importer les produits (65)` : Import les 65 produits
   - `🚀 Tout importer (15 + 65)` : **RECOMMANDÉ** - Importe tout en une fois

5. **Attendre 2-3 minutes** pendant l'import

6. **Vérifier** : Cliquer à nouveau sur "Vérifier les données" pour confirmer

## ✅ Checklist

- [ ] Collections `categories` et `menu` créées dans Appwrite
- [ ] IDs des collections copiés dans `.env`
- [ ] App redémarrée après modification du `.env`
- [ ] Import lancé depuis l'onglet Admin
- [ ] Données vérifiées (15 catégories + 65 produits)

## 🎯 Résultat attendu

Après l'import, vous devriez avoir :
- **15 catégories** : Hamburgers, Chawarma, Norvégien, Pachas, Wrap, Tacos, Sandwich, Fataya, Panini, Frites, Spécialités, Pizza, Poulet Grillé, Jus Naturel, Café
- **65 produits** avec noms, descriptions, prix (en FCFA), catégories

## ❌ En cas d'erreur

**Erreur "Collection not found"** :
- Vérifiez que les collections existent dans Appwrite Console
- Vérifiez que les IDs dans `.env` sont corrects
- Redémarrez l'app après modification du `.env`

**Erreur "Permission denied"** :
- Dans Appwrite Console → Collection → Settings → Permissions
- Ajoutez : Any (Role: Any) avec Read permission
- Ajoutez : Users (Role: Users) avec Create, Update, Delete

**Doublons** :
- N'importez pas plusieurs fois
- Si besoin, supprimez les documents dans Appwrite Console avant de ré-importer

## 🔄 Alternative : Import manuel

Si vous préférez importer manuellement via Appwrite Console :

1. Ouvrez `MENU_DATA.json`
2. Copiez les catégories une par une
3. Dans Appwrite Console → Collection `categories` → Create Document
4. Collez les données
5. Répétez pour les 65 produits dans la collection `menu`

⏱️ Temps estimé : 30-45 minutes
