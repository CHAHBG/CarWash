import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6905ffc70017b29b34c7')
    .setKey('standard_b857bedd261ab9b0cca06577b96536018c868b49e122db722525e9450465dfaaafa84efffc353608911a35ff5505ddb1001867f1fd427888366ce6acbb5ded419882e5c422b96557bf059a478045089b81209c933cc0f2e6441507856f2051db955f7a17aba6a18145c63d1666cdc7a60151693dc4eaed929a78f7d51176836e');

const databases = new Databases(client);

const databaseId = '69063306000938349d80';
const menuCollectionId = 'menu';

(async () => {
  const response = await databases.listDocuments(databaseId, menuCollectionId, [
    Query.equal('category', 'poulet-grille'),
    Query.limit(10)
  ]);

  console.log(response.documents.map(doc => ({ id: doc.$id, name: doc.name, category: doc.category })));
})();
