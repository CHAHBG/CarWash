import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '68629ae60038a7c61fe4';
const menuCollectionId = 'menu';

// Images pour les boissons
const boissonImages = {
    // Jus
    "Jus Naturel Gobelet": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    "Gingembre Bouteille 1L": "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop",
    "Gingembre Bouteille...": "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop",
    "Mangue Bouteille 1L": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop",
    "Bissap Bouteille 1L": "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop",
    "Bouye Bouteille 1L": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    "Moringa Bouteille 1L": "https://images.unsplash.com/photo-1598512165948-d4d0090e87d9?w=400&h=400&fit=crop",
    "Cocktail Bouteille 1L": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop",
    
    // Café
    "Café Cappuccino": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    "Café Espresso": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
    "Café Lungo": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
    "Chocolat Chaud": "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400&h=400&fit=crop",
    "Thé Lipton": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop"
};

async function updateBoissonImages() {
    try {
        console.log('🥤 Mise à jour des images de boissons...\n');
        
        // Récupérer tous les produits de jus et café
        const response = await databases.listDocuments(
            databaseId,
            menuCollectionId
        );
        
        let updated = 0;
        let notFound = 0;
        
        for (const product of response.documents) {
            // Seulement les boissons (jus et café)
            if (product.category === 'jus' || product.category === 'cafe') {
                const imageUrl = boissonImages[product.name];
                
                if (imageUrl) {
                    try {
                        await databases.updateDocument(
                            databaseId,
                            menuCollectionId,
                            product.$id,
                            { image: imageUrl }
                        );
                        console.log(`✅ ${product.name} (${product.category}): ${imageUrl}`);
                        updated++;
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        console.error(`❌ Erreur pour ${product.name}:`, errorMessage);
                    }
                } else {
                    console.log(`⚠️  Pas d'image pour: ${product.name}`);
                    notFound++;
                }
            }
        }
        
        console.log('\n📊 Résumé:');
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ⚠️  Non trouvés: ${notFound}`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

updateBoissonImages();
