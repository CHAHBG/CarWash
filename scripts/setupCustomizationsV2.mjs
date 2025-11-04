/**
 * Alternative Appwrite Database Schema Update Script
 * 
 * This approach creates a SEPARATE collection for customizations
 * to avoid hitting the row size limit in the menu table.
 * 
 * Benefits:
 * - No row size limit issues
 * - Better database design (normalized)
 * - Easier to manage customizations separately
 * - Can reuse customization sets across multiple items
 */

import { Client, Databases, Query, ID } from 'node-appwrite';

// Configuration
const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '6905ffc70017b29b34c7',
    apiKey: 'standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e',
    databaseId: '69063306000938349d80',
    menuCollectionId: 'menu',
    customizationPresetsCollectionId: 'customization_presets', // New collection
};

const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

const databases = new Databases(client);

// Predefined customization presets
const CUSTOMIZATION_PRESETS = {
    burger: {
        name: 'Burger Full',
        type: 'burger',
        data: [
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
        ],
    },
    sandwich: {
        name: 'Sandwich Full',
        type: 'sandwich',
        data: [
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
                    { id: 'harissa', name: 'Harissa', price: 0, icon: '🌶️', category: 'sauce' },
                ],
            },
            {
                id: 'extras',
                name: 'Extras',
                description: 'Ajoutez des extras',
                required: false,
                multiSelect: true,
                maxSelections: 4,
                options: [
                    { id: 'onions', name: 'Oignons', price: 200, icon: '🧅', category: 'topping' },
                    { id: 'tomatoes', name: 'Tomates', price: 200, icon: '🍅', category: 'topping' },
                    { id: 'cheese', name: 'Fromage', price: 300, icon: '🧀', category: 'topping' },
                ],
            },
            {
                id: 'drinks',
                name: 'Boissons',
                required: false,
                multiSelect: false,
                options: [
                    { id: 'water', name: 'Eau', price: 300, icon: '💧', category: 'drink' },
                    { id: 'coca', name: 'Coca-Cola', price: 500, icon: '🥤', category: 'drink' },
                ],
            },
        ],
    },
    drinks: {
        name: 'Drinks Only',
        type: 'drinks',
        data: [
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
        ],
    },
};

console.log('============================================================');
console.log('Appwrite Database Setup - Alternative Approach');
console.log('Using Separate Customization Presets Collection');
console.log('============================================================\n');

console.log('📋 MANUAL STEPS REQUIRED:\n');
console.log('1. Go to Appwrite Console → Databases → carwash_db\n');
console.log('2. Click "Create Collection"');
console.log('   - Collection ID: customization_presets');
console.log('   - Collection Name: Customization Presets\n');
console.log('3. Add these attributes to customization_presets:\n');
console.log('   a) Attribute: name');
console.log('      - Type: String');
console.log('      - Size: 100');
console.log('      - Required: Yes\n');
console.log('   b) Attribute: type');
console.log('      - Type: String');
console.log('      - Size: 50');
console.log('      - Required: Yes\n');
console.log('   c) Attribute: data');
console.log('      - Type: String');
console.log('      - Size: 16000');
console.log('      - Required: Yes\n');
console.log('4. Set Permissions for customization_presets:');
console.log('   - Read: Any (so the app can read)');
console.log('   - Create/Update/Delete: Admins only\n');
console.log('5. Go back to menu collection');
console.log('   - Add attribute: customizationPresetId');
console.log('   - Type: String');
console.log('   - Size: 50');
console.log('   - Required: No\n');
console.log('Press Enter once you\'ve completed the above steps...\n');
console.log('============================================================\n');

// Wait for user confirmation
await new Promise(resolve => {
    process.stdin.once('data', resolve);
});

console.log('\n✅ Starting automated setup...\n');

// Step 1: Create customization presets
async function createCustomizationPresets() {
    console.log('Creating customization presets...');
    const presetIds = {};

    for (const [key, preset] of Object.entries(CUSTOMIZATION_PRESETS)) {
        try {
            const doc = await databases.createDocument(
                config.databaseId,
                config.customizationPresetsCollectionId,
                ID.unique(),
                {
                    name: preset.name,
                    type: preset.type,
                    data: JSON.stringify(preset.data),
                }
            );
            presetIds[key] = doc.$id;
            console.log(`  ✓ Created preset: ${preset.name} (ID: ${doc.$id})`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ⚠ Preset ${preset.name} may already exist`);
            } else {
                console.error(`  ✗ Failed to create ${preset.name}:`, error.message);
            }
        }
    }

    return presetIds;
}

// Step 2: Assign presets to menu items
async function assignPresetsToMenuItems(presetIds) {
    console.log('\nAssigning presets to menu items...');

    const response = await databases.listDocuments(
        config.databaseId,
        config.menuCollectionId,
        [Query.limit(100)]
    );

    console.log(`Found ${response.documents.length} menu items\n`);

    for (const item of response.documents) {
        const lowerName = item.name.toLowerCase();
        let presetId = null;

        if (lowerName.includes('burger') || lowerName.includes('hamburger')) {
            presetId = presetIds.burger;
            console.log(`  Assigning burger preset to: ${item.name}`);
        } else if (lowerName.includes('sandwich') || lowerName.includes('wrap') || 
                   lowerName.includes('tacos') || lowerName.includes('panini')) {
            presetId = presetIds.sandwich;
            console.log(`  Assigning sandwich preset to: ${item.name}`);
        } else {
            presetId = presetIds.drinks;
            console.log(`  Assigning drinks preset to: ${item.name}`);
        }

        if (presetId) {
            try {
                await databases.updateDocument(
                    config.databaseId,
                    config.menuCollectionId,
                    item.$id,
                    { customizationPresetId: presetId }
                );
                console.log(`    ✓ Updated`);
            } catch (error) {
                console.error(`    ✗ Failed:`, error.message);
            }
        }
    }
}

// Main execution
try {
    const presetIds = await createCustomizationPresets();
    await assignPresetsToMenuItems(presetIds);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Setup completed successfully!');
    console.log('='.repeat(60));
    console.log('\nNext: Update your app code to fetch presets');
    console.log('See the updated guide for implementation details.');
} catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
}
