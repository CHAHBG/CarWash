import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);

async function listCollections() {
    try {
        console.log('📋 Liste des collections dans la base de données 69063306000938349d80:\n');
        
        const response = await databases.listCollections('69063306000938349d80');
        
        console.log(`Nombre total: ${response.total}\n`);
        
        response.collections.forEach(collection => {
            console.log(`📁 ${collection.name}`);
            console.log(`   ID: ${collection.$id}`);
            console.log(`   Documents: ${collection.documentSecurity ? 'Sécurisés' : 'Non sécurisés'}\n`);
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

listCollections();
