import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const menuCollectionId = 'menu';

async function updateBoissonImagesOnly() {
    try {
        console.log('🥤 Récupération des boissons (jus + cafe)...\n');
        
        // Récupérer directement les produits jus
        const responseJus = await databases.listDocuments(
            databaseId,
            menuCollectionId,
            [Query.equal('category', 'jus')]
        );
        
        // Récupérer directement les produits cafe
        const responseCafe = await databases.listDocuments(
            databaseId,
            menuCollectionId,
            [Query.equal('category', 'cafe')]
        );
        
        const boissons = [...responseJus.documents, ...responseCafe.documents];
        
        console.log(`Trouvé ${responseJus.documents.length} jus`);
        console.log(`Trouvé ${responseCafe.documents.length} cafés`);
        console.log(`Total: ${boissons.length} boissons\n`);
        
        console.log(`Trouvé ${boissons.length} boissons (jus + cafe)\n`);
        
        // Mapping des images
        const imageMap = {
            "Jus Naturel Gobelet": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            "Gingembre Bouteille 1L": "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400",
            "Mangue Bouteille 1L": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
            "Bissap Bouteille 1L": "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400",
            "Bouye Bouteille 1L": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            "Moringa Bouteille 1L": "https://images.unsplash.com/photo-1598512165948-d4d0090e87d9?w=400",
            "Cocktail Bouteille 1L": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400",
            "Café Cappuccino": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
            "Café Espresso": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
            "Café Lungo": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
            "Chocolat Chaud": "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400",
            "Thé Lipton": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
        };
        
        let updated = 0;
        
        for (const boisson of boissons) {
            const imageUrl = imageMap[boisson.name];
            
            if (imageUrl) {
                await databases.updateDocument(
                    databaseId,
                    menuCollectionId,
                    boisson.$id,
                    { image: imageUrl }
                );
                console.log(`✅ ${boisson.name} (${boisson.category})`);
                updated++;
            } else {
                console.log(`⚠️  ${boisson.name} - pas de mapping trouvé`);
            }
        }
        
        console.log(`\n🎉 ${updated} images de boissons mises à jour !`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

updateBoissonImagesOnly();
