import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);
const databaseId = '69063306000938349d80';
const menuCollectionId = 'menu';

const boissons = [
    // Jus
    {
        name: "Jus Naturel Gobelet",
        description: "Jus naturel frais au gobelet",
        price: 500,
        category: "jus",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Gingembre Bouteille 1L",
        description: "Jus de gingembre naturel",
        price: 2000,
        category: "jus",
        image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Mangue Bouteille 1L",
        description: "Jus de mangue naturel",
        price: 2500,
        category: "jus",
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop",
        available: true,
        featured: true
    },
    {
        name: "Bissap Bouteille 1L",
        description: "Jus de bissap naturel",
        price: 2000,
        category: "jus",
        image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Bouye Bouteille 1L",
        description: "Jus de bouye (pain de singe)",
        price: 2500,
        category: "jus",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Moringa Bouteille 1L",
        description: "Jus de moringa naturel",
        price: 2500,
        category: "jus",
        image: "https://images.unsplash.com/photo-1598512165948-d4d0090e87d9?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Cocktail Bouteille 1L",
        description: "Cocktail de jus naturel",
        price: 3000,
        category: "jus",
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop",
        available: true,
        featured: true
    },
    // Café
    {
        name: "Café Cappuccino",
        description: "Café cappuccino onctueux",
        price: 1500,
        category: "cafe",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Café Espresso",
        description: "Café espresso corsé",
        price: 1000,
        category: "cafe",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Café Lungo",
        description: "Café lungo léger",
        price: 1200,
        category: "cafe",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Chocolat Chaud",
        description: "Chocolat chaud crémeux",
        price: 1500,
        category: "cafe",
        image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400&h=400&fit=crop",
        available: true,
        featured: false
    },
    {
        name: "Thé Lipton",
        description: "Thé Lipton chaud",
        price: 800,
        category: "cafe",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        available: true,
        featured: false
    }
];

async function addBoissons() {
    try {
        console.log('🥤 Ajout des boissons...\n');
        
        for (const boisson of boissons) {
            await databases.createDocument(
                databaseId,
                menuCollectionId,
                ID.unique(),
                boisson
            );
            console.log(`✅ ${boisson.name} (${boisson.category}) - ${boisson.price} FCFA`);
        }
        
        console.log(`\n🎉 ${boissons.length} boissons ajoutées avec succès!`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

addBoissons();
