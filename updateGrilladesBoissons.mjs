import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const menuCollectionId = 'menu';

async function updateAllImages() {
    try {
        console.log('🔄 Mise à jour des images...\n');
        
        // Images spécifiques pour chaque produit
        const imageMap = {
            // Grillades
            "Poulet Entier": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop",
            "Demi Poulet": "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop",
            
            // Jus
            "Jus Naturel Gobelet": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
            "Gingembre Bouteille 1L": "https://images.unsplash.com/photo-1582610116397-edb318620f90?w=400&h=400&fit=crop",
            "Mangue Bouteille 1L": "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=400&fit=crop",
            "Bissap Bouteille 1L": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=400&fit=crop",
            "Bouye Bouteille 1L": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop",
            "Moringa Bouteille 1L": "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop",
            "Cocktail Bouteille 1L": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop",
            
            // Café
            "Café Cappuccino": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
            "Café Espresso": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
            "Café Lungo": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop",
            "Chocolat Chaud": "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400&h=400&fit=crop",
            "Thé Lipton": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop"
        };
        
        // Récupérer les grillades
        const grillades = await databases.listDocuments(
            databaseId,
            menuCollectionId,
            [Query.equal('category', 'poulet-grille')]
        );
        
        // Récupérer les jus
        const jus = await databases.listDocuments(
            databaseId,
            menuCollectionId,
            [Query.equal('category', 'jus')]
        );
        
        // Récupérer les cafés
        const cafes = await databases.listDocuments(
            databaseId,
            menuCollectionId,
            [Query.equal('category', 'cafe')]
        );
        
        const allProducts = [...grillades.documents, ...jus.documents, ...cafes.documents];
        
        console.log(`📦 ${grillades.documents.length} grillades`);
        console.log(`🥤 ${jus.documents.length} jus`);
        console.log(`☕ ${cafes.documents.length} cafés`);
        console.log(`Total: ${allProducts.length} produits\n`);
        
        let updated = 0;
        
        for (const product of allProducts) {
            const imageUrl = imageMap[product.name];
            
            if (imageUrl) {
                await databases.updateDocument(
                    databaseId,
                    menuCollectionId,
                    product.$id,
                    { image: imageUrl }
                );
                console.log(`✅ ${product.name} (${product.category})`);
                updated++;
            } else {
                console.log(`⚠️  ${product.name} - pas d'image disponible`);
            }
        }
        
        console.log(`\n🎉 ${updated} images mises à jour !`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

updateAllImages();
