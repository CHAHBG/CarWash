import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';

async function checkCategories() {
    try {
        console.log('\n📋 CATÉGORIES:');
        console.log('====================\n');
        
        const categoriesResponse = await databases.listDocuments(
            databaseId,
            'categories'
        );
        
        categoriesResponse.documents.forEach((cat) => {
            console.log(`- Nom: ${cat.name}`);
            console.log(`  Slug: ${cat.slug}`);
            console.log(`  Icon: ${cat.icon}\n`);
        });
        
        console.log('\n🍽️  PRODUITS PAR CATÉGORIE:');
        console.log('====================\n');
        
        const menuResponse = await databases.listDocuments(
            databaseId,
            'menu'
        );
        
        // Grouper par catégorie
        const byCategory = {};
        menuResponse.documents.forEach((product) => {
            if (!byCategory[product.category]) {
                byCategory[product.category] = [];
            }
            byCategory[product.category].push(product.name);
        });
        
        Object.keys(byCategory).sort().forEach((category) => {
            console.log(`\n📂 ${category}:`);
            byCategory[category].forEach((name) => {
                console.log(`   - ${name}`);
            });
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

checkCategories();
