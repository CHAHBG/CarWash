import {Client, Account, Databases, Storage, ID, Query, Permission, Role, AppwriteException} from "react-native-appwrite";
import {CreateUserPrams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.carwash.restaurant",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '69063306000938349d80',
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID || '68643e170015edaa95d7',
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || '68629b0a003d27acb18f',
    categoriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
    menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID || 'menu',
    customizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID || '68643c0300297e5abc95',
    menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID || '68643cd8003580ecdd8f',
    ordersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || '',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const getErrorMessage = (error: unknown): string => {
    if (error instanceof AppwriteException) {
        if (error.code === 409) {
            return "Un compte existe déjà avec ces identifiants.";
        }

        if (error.code === 401) {
            return "Votre session a expiré. Veuillez vous reconnecter.";
        }

        return error.message || 'Une erreur est survenue avec Appwrite.';
    }

    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
        return (error as { message: string }).message;
    }

    return 'Une erreur inattendue est survenue, veuillez réessayer.';
};

const clearActiveSession = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        if (error instanceof AppwriteException) {
            if (error.code === 401 || error.code === 404) {
                return;
            }
        }
        throw error;
    }
};

export const createUser = async ({ email, password, name, phone }: CreateUserPrams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) {
            throw new Error("Impossible de créer le compte utilisateur.");
        }

        await clearActiveSession();
        await signIn({ email, password });

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        const permissions = [
            Permission.read(Role.user(newAccount.$id)),
            Permission.update(Role.user(newAccount.$id)),
            Permission.delete(Role.user(newAccount.$id)),
        ];

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                phone: phone || '',
                loyaltyPoints: 0,
                defaultAddress: '',
                accountId: newAccount.$id,
                avatar: avatarUrl,
            },
            permissions,
        );
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        await clearActiveSession();
        await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const signOut = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(getErrorMessage(error));
    }
}

const resolveMenuCategories = (category?: string): string[] => {
    if (!category || category === 'all') return [];

    if (category === 'boissons') {
        return ['jus', 'cafe'];
    }

    if (category === 'grillades') {
        return ['poulet-grille'];
    }

    return [category];
};

export const getMenu = async ({ category = '', query = '', limit }: GetMenuParams) => {
    try {
        const queries: string[] = [];
        const categories = resolveMenuCategories(category);

        if (categories.length === 1) {
            queries.push(Query.equal('category', categories[0]));
        } else if (categories.length > 1) {
            queries.push(Query.equal('category', categories));
        }

        if (query) queries.push(Query.search('name', query));

        const safeLimit = Math.max(1, Math.min(typeof limit === 'number' ? limit : 100, 100));
        queries.push(Query.limit(safeLimit));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        );

        return menus.documents;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}
