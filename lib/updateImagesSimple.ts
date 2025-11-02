// Script simple pour mettre à jour les images
// Exécutez: npx expo start puis dans Metro console: require('./updateImagesSimple')

import { appwriteConfig, databases } from './appwrite';
import imageUrls from '../IMAGE_URLS.json';

async function updateImages() {
    try {
        console.log('📥 Récupération des produits...');
        
        // Récupérer tous les produits
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId
        );
        
        console.log(`✅ ${response.documents.length} produits trouvés`);
        
        let updated = 0;
        let notFound = 0;
        
        // Mettre à jour chaque produit avec sa nouvelle URL
        for (const doc of response.documents) {
            const productName = doc.name;
            let imageUrl = null;
            
            // Chercher l'URL dans toutes les catégories
            for (const category in imageUrls) {
                const categoryData = (imageUrls as any)[category];
                if (categoryData && categoryData[productName]) {
                    imageUrl = categoryData[productName];
                    break;
                }
            }
            
            if (imageUrl) {
                try {
                    await databases.updateDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.menuCollectionId,
                        doc.$id,
                        { image: imageUrl }
                    );
                    console.log(`✅ ${productName}: ${imageUrl}`);
                    updated++;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`❌ Erreur pour ${productName}:`, errorMessage);
                }
            } else {
                console.log(`⚠️  Pas d'image trouvée pour: ${productName}`);
                notFound++;
            }
        }
        
        console.log('\n📊 Résumé:');
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ⚠️  Non trouvés: ${notFound}`);
        console.log(`   📦 Total: ${response.documents.length}`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

updateImages();
