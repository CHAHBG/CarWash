import { databases, appwriteConfig } from './appwrite';
import { ID } from 'react-native-appwrite';
import menuData from '../MENU_DATA.json';

/**
 * Script pour importer les données Car Wash Restaurant dans Appwrite
 * 
 * UTILISATION DANS L'APP :
 * 
 * import { seedAllData, checkData } from '@/lib/seedCarWash';
 * 
 * // Vérifier les données existantes
 * await checkData();
 * 
 * // Importer toutes les données
 * await seedAllData();
 */

export const importCategories = async () => {
  console.log('🌱 Import des catégories...');
  
  try {
    const { categories } = menuData;
    let success = 0;
    
    for (const category of categories) {
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          'categories',
          ID.unique(),
          category
        );
        success++;
        console.log(`✅ ${category.name}`);
      } catch (error: any) {
        console.error(`❌ ${category.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ ${success}/${categories.length} catégories importées\n`);
    return { success, total: categories.length };
  } catch (error) {
    console.error('❌ Erreur import catégories:', error);
    throw error;
  }
};

export const importMenu = async () => {
  console.log('🌱 Import des produits...');
  
  try {
    const { menu } = menuData;
    let success = 0;
    
    for (const item of menu) {
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          'menu',
          ID.unique(),
          item
        );
        success++;
        console.log(`✅ ${item.name} - ${item.price} FCFA`);
      } catch (error: any) {
        console.error(`❌ ${item.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ ${success}/${menu.length} produits importés\n`);
    return { success, total: menu.length };
  } catch (error) {
    console.error('❌ Erreur import menu:', error);
    throw error;
  }
};

export const seedAllData = async () => {
  console.log('🚀 Début de l\'importation complète\n');
  
  const categoriesResult = await importCategories();
  await new Promise(r => setTimeout(r, 1000));
  const menuResult = await importMenu();
  
  console.log('📊 RÉSUMÉ:');
  console.log(`Catégories: ${categoriesResult.success}/${categoriesResult.total}`);
  console.log(`Produits: ${menuResult.success}/${menuResult.total}`);
  
  return { categoriesResult, menuResult };
};

export const checkData = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      'categories'
    );
    
    const menu = await databases.listDocuments(
      appwriteConfig.databaseId,
      'menu'
    );
    
    console.log('📊 Données actuelles:');
    console.log(`Catégories: ${categories.total}`);
    console.log(`Produits: ${menu.total}`);
    
    return { categoriesCount: categories.total, menuCount: menu.total };
  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    return null;
  }
};
