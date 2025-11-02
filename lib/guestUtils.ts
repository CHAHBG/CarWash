/**
 * Utilitaires pour le mode invité (guest checkout)
 */

/**
 * Génère un UUID v4 simple pour identifier les invités
 */
export const generateGuestId = (): string => {
    return 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
};

/**
 * Valide les informations d'un invité
 */
export const validateGuestInfo = (name: string, phone: string, address: string): { 
    isValid: boolean; 
    errors: string[] 
} => {
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!phone || phone.trim().length < 9) {
        errors.push('Veuillez entrer un numéro de téléphone valide');
    }

    // Validation format téléphone sénégalais
    const phoneRegex = /^(\+221|221)?[7][0-9]{8}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
        errors.push('Format de téléphone invalide (ex: 77 123 45 67)');
    }

    if (!address || address.trim().length < 10) {
        errors.push('L\'adresse doit contenir au moins 10 caractères');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Stockage local des informations invité (pour pré-remplissage)
 */
export const saveGuestInfoLocally = async (name: string, phone: string, address: string) => {
    try {
        // À implémenter avec AsyncStorage si nécessaire
        console.log('Guest info saved locally:', { name, phone, address });
    } catch (error) {
        console.error('Error saving guest info:', error);
    }
};

/**
 * Récupération des informations invité sauvegardées
 */
export const getLocalGuestInfo = async (): Promise<{ name: string; phone: string; address: string } | null> => {
    try {
        // À implémenter avec AsyncStorage si nécessaire
        return null;
    } catch (error) {
        console.error('Error getting guest info:', error);
        return null;
    }
};
