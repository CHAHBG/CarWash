import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '6905ffc70017b29b34c7')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);

const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '69063306000938349d80';
const userCollectionId = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || 'users';

const ensureAttribute = async (fn, label) => {
    try {
        await fn();
        console.log(`✅ ${label}`);
    } catch (error) {
        if (error?.code === 409) {
            console.log(`⚠️  ${label} déjà configuré`);
        } else {
            console.error(`❌ ${label}`, error?.message || error);
        }
    }
};

(async () => {
    console.log('🔧 Configuration de la collection users...');

    await ensureAttribute(
        () => databases.createStringAttribute(databaseId, userCollectionId, 'phone', 20, false, undefined, false),
        'Attribut phone'
    );

    await ensureAttribute(
        () => databases.createIntegerAttribute(databaseId, userCollectionId, 'loyaltyPoints', false, undefined, undefined, 0, false),
        'Attribut loyaltyPoints'
    );

    await ensureAttribute(
        () => databases.createStringAttribute(databaseId, userCollectionId, 'defaultAddress', 255, false, '', false),
        'Attribut defaultAddress'
    );

    await ensureAttribute(
        () => databases.createStringAttribute(databaseId, userCollectionId, 'accountId', 64, true, undefined, false),
        'Attribut accountId'
    );

    await ensureAttribute(
        () => databases.createIndex(databaseId, userCollectionId, 'idx_users_phone', 'fulltext', ['phone']),
        'Index phone'
    );

    await ensureAttribute(
        () => databases.createIndex(databaseId, userCollectionId, 'idx_users_account', 'key', ['accountId']),
        'Index accountId'
    );

    console.log('🎉 Configuration terminée.');
})();
