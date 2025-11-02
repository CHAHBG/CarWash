import { Client, Databases } from 'node-appwrite';
import * as fs from 'fs';

// Configuration Appwrite
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);

const databaseId = '68629ae60038a7c61fe4';
const menuCollectionId = 'menu';

async function updateImages() {
    try {
        // Lire le fichier JSON avec les URLs
        const imageUrls = JSON.parse(fs.readFileSync('./IMAGE_URLS.json', 'utf-8'));
        
        console.log('📥 Récupération des produits...');
        
        // Récupérer tous les produits
        const response = await databases.listDocuments(
            databaseId,
            menuCollectionId
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
                if (imageUrls[category][productName]) {
                    imageUrl = imageUrls[category][productName];
                    break;
                }
            }
            
            if (imageUrl) {
                try {
                    await databases.updateDocument(
                        databaseId,
                        menuCollectionId,
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
