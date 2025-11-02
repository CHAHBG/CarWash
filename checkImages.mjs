import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b4981bba05a8a2f3e1f29e1fa0d3e3e09c9126c31ba63e5502d2b84ae07fd80afe5eefeaf4ae4e026ac8e4a7e9d3d8c67ffbb5b22ca0c7c90ba9c4a71fd57fd4d22c8fccd78ba3ef5bb40d60bee51e38e2e3ce59cc7dd22b0a66f6cc7f9f61a2d2fc50b2ce3e2cb8d2f99b6e85');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const collectionId = 'menu';

async function checkImages() {
    try {
        console.log('📊 Vérification des images dans la base de données...\n');
        
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
        }
        
        console.log(`✅ Total produits: ${allProducts.length}\n`);
        
        // Analyser les images
        const withImages = allProducts.filter(p => p.image_url && p.image_url.trim() !== '');
        const withoutImages = allProducts.filter(p => !p.image_url || p.image_url.trim() === '');
        
        console.log(`✅ Avec images: ${withImages.length}`);
        console.log(`❌ Sans images: ${withoutImages.length}\n`);
        
        if (withoutImages.length > 0) {
            console.log('📋 Produits SANS images:\n');
            withoutImages.forEach(p => {
                console.log(`  - ${p.name} (${p.category}) [ID: ${p.$id}]`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

checkImages();
