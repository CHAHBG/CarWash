import { Client, Databases, Query } from 'node-appwrite';
import { readFileSync } from 'fs';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const collectionId = 'menu';

async function fixAllImages() {
    try {
        const imageUrls = JSON.parse(readFileSync('./IMAGE_URLS.json', 'utf-8'));
        
        console.log('📥 Récupération de TOUS les produits avec pagination...\n');
        
        // Récupérer TOUS les produits avec pagination
        let allProducts = [];
        let hasMore = true;
        let offset = 0;
        const limit = 100;
        
        while (hasMore) {
            const response = await databases.listDocuments(
                databaseId,
                collectionId,
                [Query.limit(limit), Query.offset(offset)]
            );
            
            allProducts = allProducts.concat(response.documents);
            hasMore = response.documents.length === limit;
            offset += limit;
            console.log(`  Récupéré ${allProducts.length} produits...`);
        }
        
        console.log(`\n✅ Total: ${allProducts.length} produits\n`);
        
        let updated = 0;
        let notFound = 0;
        let skipped = 0;
        
        for (const doc of allProducts) {
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
                // Vérifier si l'image est déjà à jour
                if (doc.image === imageUrl) {
                    console.log(`⏭️  ${productName}: déjà à jour`);
                    skipped++;
                } else {
                    try {
                        await databases.updateDocument(
                            databaseId,
                            collectionId,
                            doc.$id,
                            { image: imageUrl }  // IMPORTANT: "image" est le nom du champ
                        );
                        console.log(`✅ ${productName}: image mise à jour`);
                        updated++;
                    } catch (error) {
                        console.error(`❌ Erreur pour ${productName}:`, error.message);
                    }
                }
            } else {
                console.log(`⚠️  ${productName}: aucune image trouvée dans IMAGE_URLS.json`);
                notFound++;
            }
        }
        
        console.log('\n📊 Résumé:');
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ⏭️  Déjà à jour: ${skipped}`);
        console.log(`   ⚠️  Non trouvés: ${notFound}`);
        console.log(`   📦 Total: ${allProducts.length}`);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

fixAllImages();
