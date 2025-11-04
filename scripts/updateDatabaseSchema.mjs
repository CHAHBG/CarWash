/**
 * Appwrite Database Schema Update Script
 * 
 * This script helps you update your MenuItem collection to include customizations.
 * Run this using Node.js with Appwrite Node SDK.
 * 
 * Prerequisites:
 * 1. Install node-appwrite: npm install node-appwrite
 * 2. Have your Appwrite admin API key ready
 * 3. Update the config below with your values
 */

import { Client, Databases, Query } from 'node-appwrite';

// Configuration - UPDATE THESE VALUES
const config = {
    endpoint: 'https://cloud.appwrite.io/v1', // e.g., 'https://cloud.appwrite.io/v1'
    projectId: '6905ffc70017b29b34c7',
    apiKey: 'standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e', // Admin API key from Appwrite console
    databaseId: '69063306000938349d80',
    menuCollectionId: 'menu',
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

const databases = new Databases(client);

/**
 * Step 1: Add customizations attribute to MenuItem collection
 * 
 * This needs to be done manually in Appwrite Console:
 * 1. Go to your Appwrite Console
 * 2. Navigate to Databases → Your Database → menu collection
 * 3. Click "Attributes" tab
 * 4. Click "Add Attribute"
 * 5. Select "JSON"
 * 6. Set attribute key: "customizations"
 * 7. Set as optional (not required)
 * 8. Save
 */

// Sample customizations structure for different menu items
const burgerCustomizations = [
    {
        id: 'sauces',
        name: 'Sauces',
        description: 'Choisissez vos sauces',
        required: false,
        multiSelect: true,
        maxSelections: 3,
        options: [
            { id: 'ketchup', name: 'Ketchup', price: 0, icon: '🍅', category: 'sauce' },
            { id: 'mayo', name: 'Mayonnaise', price: 0, icon: '🥚', category: 'sauce' },
            { id: 'mustard', name: 'Moutarde', price: 0, icon: '🌭', category: 'sauce' },
            { id: 'bbq', name: 'Sauce BBQ', price: 200, icon: '🔥', category: 'sauce' },
            { id: 'yassa', name: 'Sauce Yassa', price: 300, icon: '🌶️', category: 'sauce' },
        ],
    },
    {
        id: 'toppings',
        name: 'Garnitures',
        description: 'Personnalisez avec des garnitures',
        required: false,
        multiSelect: true,
        maxSelections: 5,
        options: [
            { id: 'onions', name: 'Oignons', price: 200, icon: '🧅', category: 'topping', maxQuantity: 3 },
            { id: 'tomatoes', name: 'Tomates', price: 200, icon: '🍅', category: 'topping', maxQuantity: 3 },
            { id: 'cheese', name: 'Fromage', price: 300, icon: '🧀', category: 'topping', maxQuantity: 2 },
            { id: 'avocado', name: 'Avocat', price: 400, icon: '🥑', category: 'topping', maxQuantity: 2 },
            { id: 'bacon', name: 'Bacon', price: 500, icon: '🥓', category: 'topping', maxQuantity: 2 },
            { id: 'mushrooms', name: 'Champignons', price: 300, icon: '🍄', category: 'topping', maxQuantity: 2 },
            { id: 'cucumber', name: 'Concombre', price: 150, icon: '🥒', category: 'topping', maxQuantity: 3 },
        ],
    },
    {
        id: 'sides',
        name: 'Accompagnements',
        description: 'Choisissez un accompagnement',
        required: false,
        multiSelect: false,
        options: [
            { id: 'fries', name: 'Frites', price: 500, icon: '🍟', category: 'side' },
            { id: 'salad', name: 'Salade', price: 400, icon: '🥗', category: 'side' },
            { id: 'onion-rings', name: "Rondelles d'Oignon", price: 600, icon: '🍱', category: 'side' },
            { id: 'coleslaw', name: 'Coleslaw', price: 400, icon: '🥬', category: 'side' },
        ],
    },
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: [
            { id: 'water', name: 'Eau', price: 300, icon: '💧', category: 'drink' },
            { id: 'coca', name: 'Coca-Cola', price: 500, icon: '🥤', category: 'drink' },
            { id: 'juice', name: 'Jus Bissap', price: 600, icon: '🧃', category: 'drink' },
            { id: 'ginger', name: 'Jus Gingembre', price: 700, icon: '🌿', category: 'drink' },
        ],
    },
];

const yassaCustomizations = [
    {
        id: 'protein',
        name: 'Protéine',
        description: 'Choisissez votre protéine',
        required: true,
        multiSelect: false,
        options: [
            { id: 'chicken', name: 'Poulet Grillé', price: 800, icon: '🍗', category: 'protein' },
            { id: 'beef', name: 'Bœuf', price: 1000, icon: '🥩', category: 'protein' },
            { id: 'fish', name: 'Poisson', price: 900, icon: '🐟', category: 'protein' },
        ],
    },
    {
        id: 'spice',
        name: 'Niveau de Piquant',
        description: 'À quel point voulez-vous le piquant?',
        required: false,
        multiSelect: false,
        options: [
            { id: 'mild', name: 'Doux', price: 0, icon: '😌', category: 'base' },
            { id: 'medium', name: 'Moyen', price: 0, icon: '🌶️', category: 'base' },
            { id: 'hot', name: 'Piquant', price: 0, icon: '🔥', category: 'base' },
            { id: 'very-hot', name: 'Très Piquant', price: 0, icon: '🌋', category: 'base' },
        ],
    },
    {
        id: 'sides',
        name: 'Accompagnements',
        description: 'Choisissez un accompagnement',
        required: false,
        multiSelect: false,
        options: [
            { id: 'fries', name: 'Frites', price: 500, icon: '🍟', category: 'side' },
            { id: 'salad', name: 'Salade', price: 400, icon: '🥗', category: 'side' },
        ],
    },
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: [
            { id: 'water', name: 'Eau', price: 300, icon: '💧', category: 'drink' },
            { id: 'coca', name: 'Coca-Cola', price: 500, icon: '🥤', category: 'drink' },
            { id: 'juice', name: 'Jus Bissap', price: 600, icon: '🧃', category: 'drink' },
        ],
    },
];

const thiebouCustomizations = [
    {
        id: 'fish-type',
        name: 'Type de Poisson',
        description: 'Choisissez votre poisson',
        required: true,
        multiSelect: false,
        options: [
            { id: 'thiof', name: 'Thiof', price: 0, icon: '🐟', category: 'protein' },
            { id: 'yete', name: 'Yété', price: 200, icon: '🐠', category: 'protein' },
            { id: 'sole', name: 'Sole', price: 300, icon: '🐡', category: 'protein' },
        ],
    },
    {
        id: 'vegetables',
        name: 'Légumes',
        description: 'Ajoutez des légumes supplémentaires',
        required: false,
        multiSelect: true,
        maxSelections: 4,
        options: [
            { id: 'carrot', name: 'Carotte', price: 100, icon: '🥕', category: 'topping' },
            { id: 'cabbage', name: 'Chou', price: 100, icon: '🥬', category: 'topping' },
            { id: 'eggplant', name: 'Aubergine', price: 150, icon: '🍆', category: 'topping' },
            { id: 'okra', name: 'Gombo', price: 150, icon: '🌱', category: 'topping' },
        ],
    },
];

const drinksOnlyCustomization = [
    {
        id: 'drinks',
        name: 'Boissons',
        description: 'Ajoutez une boisson',
        required: false,
        multiSelect: false,
        options: [
            { id: 'water', name: 'Eau', price: 300, icon: '💧', category: 'drink' },
            { id: 'coca', name: 'Coca-Cola', price: 500, icon: '🥤', category: 'drink' },
            { id: 'juice', name: 'Jus Bissap', price: 600, icon: '🧃', category: 'drink' },
            { id: 'ginger', name: 'Jus Gingembre', price: 700, icon: '🌿', category: 'drink' },
        ],
    },
];

/**
 * Step 2: Update menu items with customizations
 * This function assigns customizations to menu items based on their name/category
 */
async function updateMenuItemsWithCustomizations() {
    try {
        console.log('Fetching all menu items...');
        
        // Fetch all menu items
        const response = await databases.listDocuments(
            config.databaseId,
            config.menuCollectionId,
            [Query.limit(100)]
        );

        console.log(`Found ${response.documents.length} menu items`);

        for (const item of response.documents) {
            const lowerName = item.name.toLowerCase();
            let customizations = [];

            // Determine customizations based on item name/category
            if (lowerName.includes('burger') || lowerName.includes('sandwich')) {
                customizations = burgerCustomizations;
                console.log(`  Assigning burger customizations to: ${item.name}`);
            } else if (lowerName.includes('yassa')) {
                customizations = yassaCustomizations;
                console.log(`  Assigning yassa customizations to: ${item.name}`);
            } else if (lowerName.includes('thieb') || lowerName.includes('ceeb')) {
                customizations = thiebouCustomizations;
                console.log(`  Assigning thieboudienne customizations to: ${item.name}`);
            } else {
                customizations = drinksOnlyCustomization;
                console.log(`  Assigning drinks-only customizations to: ${item.name}`);
            }

            // Update the document
            try {
                await databases.updateDocument(
                    config.databaseId,
                    config.menuCollectionId,
                    item.$id,
                    { customizations: JSON.stringify(customizations) }
                );
                console.log(`    ✓ Updated: ${item.name}`);
            } catch (updateError) {
                console.error(`    ✗ Failed to update ${item.name}:`, updateError.message);
            }
        }

        console.log('\n✅ All menu items updated successfully!');
    } catch (error) {
        console.error('Error updating menu items:', error);
        throw error;
    }
}

/**
 * Step 3: Verify the updates
 */
async function verifyUpdates() {
    try {
        console.log('\nVerifying updates...');
        
        const response = await databases.listDocuments(
            config.databaseId,
            config.menuCollectionId,
            [Query.limit(5)]
        );

        console.log(`\nSample of updated items (first 5):`);
        for (const item of response.documents) {
            console.log(`\n${item.name}:`);
            if (item.customizations) {
                const customizations = typeof item.customizations === 'string' 
                    ? JSON.parse(item.customizations) 
                    : item.customizations;
                console.log(`  - Has ${customizations.length} customization categories`);
                customizations.forEach(cat => {
                    console.log(`    • ${cat.name}: ${cat.options.length} options`);
                });
            } else {
                console.log('  - No customizations set');
            }
        }
    } catch (error) {
        console.error('Error verifying updates:', error);
    }
}

// Main execution
async function main() {
    console.log('='.repeat(60));
    console.log('Appwrite Database Update Script');
    console.log('Adding Customizations to Menu Items');
    console.log('='.repeat(60));
    console.log('');

    // Validate configuration
    if (!config.apiKey || config.apiKey === 'YOUR_API_KEY') {
        console.error('❌ Error: Please update the configuration with your Appwrite credentials');
        console.error('   Update the config object at the top of this file');
        process.exit(1);
    }

    try {
        await updateMenuItemsWithCustomizations();
        await verifyUpdates();
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Database update completed successfully!');
        console.log('='.repeat(60));
        console.log('\nNext steps:');
        console.log('1. Test the app to see customizations in action');
        console.log('2. Adjust customizations for specific items if needed');
        console.log('3. The app will now use database customizations instead of local ones');
    } catch (error) {
        console.error('\n❌ Database update failed:', error);
        process.exit(1);
    }
}

// Run the script (ES modules don't have require.main)
main();

export { updateMenuItemsWithCustomizations, verifyUpdates };
