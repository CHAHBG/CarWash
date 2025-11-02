import { Client, Databases } from 'node-appwrite';
import { readFileSync } from 'fs';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const menuCollectionId = 'menu';

async function updateAllImages() {
    try {
        const imageUrls = JSON.parse(readFileSync('./IMAGE_URLS.json', 'utf-8'));
        
        console.log('📥 Récupération de TOUS les produits...\n');
        
        let allDocuments = [];
        let offset = 0;
        const limit = 25;
        let hasMore = true;
        
        // Récupérer tous les produits par lots de 25
        while (hasMore) {
            const response = await databases.listDocuments(
                databaseId,
                menuCollectionId
            );
            
            allDocuments = allDocuments.concat(response.documents);
            offset += limit;
            
            if (response.documents.length < limit) {
                hasMore = false;
            }
        }
        
        console.log(`✅ ${allDocuments.length} produits trouvés au total\n`);
        
        let updated = 0;
        let notFound = 0;
        
        for (const doc of allDocuments) {
            const productName = doc.name;
            let imageUrl = null;
            
            // Chercher l'URL dans toutes les catégories
            for (const category in imageUrls) {
                const categoryData = imageUrls[category];
                if (categoryData && categoryData[productName]) {
                    imageUrl = categoryData[productName];
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
                console.log(`⚠️  Pas d'image pour: ${productName}`);
                notFound++;
            }
        }
        
        console.log('\n📊 Résumé:');
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ⚠️  Non trouvés: ${notFound}`);
        console.log(`   📦 Total: ${allDocuments.length}`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

updateAllImages();
