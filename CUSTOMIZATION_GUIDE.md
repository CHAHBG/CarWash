# Menu Customization System - Database Schema Guide

## Overview
The app now has a comprehensive menu customization system with local images. This guide explains how to update the Appwrite database schema to support customizations.

## Current Implementation

### Local Customizations
Currently, customizations are handled client-side using:
- **File**: `lib/customizationData.ts`
- **Images**: All customization images stored in `assets/images/`
- **Mapping**: `getCustomizationsForItem()` function automatically assigns customizations based on item name/category

### Automatic Assignment Logic
```typescript
- Burgers/Sandwiches → Full burger customizations (sauces, toppings, sides, drinks)
- Yassa dishes → Protein choice, spice level, sides, drinks
- Thiéboudienne → Fish type, vegetables, drinks
- Other items → Default drinks customization
```

## Recommended Database Schema

### MenuItem Collection - Add New Fields

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string (URL)",
  "category": "string",
  "available": "boolean",
  "featured": "boolean",
  "order": "number",
  
  // NEW FIELDS FOR CUSTOMIZATIONS:
  "customizations": "JSON array",  // Array of CustomizationCategory
  "preparationTime": "number",     // in minutes
  "spiceLevel": "string",          // 'mild', 'medium', 'hot', 'very-hot'
  "allergens": "string array",     // ['peanuts', 'dairy', etc.]
  "isVegetarian": "boolean",
  "nutritionInfo": "JSON object"    // Optional: {calories, protein, etc.}
}
```

### Example Customizations Field Structure

```json
{
  "customizations": [
    {
      "id": "sauces",
      "name": "Sauces",
      "description": "Choisissez vos sauces",
      "required": false,
      "multiSelect": true,
      "maxSelections": 3,
      "options": [
        {
          "id": "ketchup",
          "name": "Ketchup",
          "price": 0,
          "icon": "🍅",
          "category": "sauce",
          "image": "https://cloud.appwrite.io/..."
        },
        {
          "id": "mayo",
          "name": "Mayonnaise",
          "price": 0,
          "icon": "🥚",
          "category": "sauce"
        }
      ]
    },
    {
      "id": "toppings",
      "name": "Garnitures",
      "description": "Personnalisez avec des garnitures",
      "required": false,
      "multiSelect": true,
      "maxSelections": 5,
      "options": [
        {
          "id": "onions",
          "name": "Oignons",
          "price": 200,
          "icon": "🧅",
          "category": "topping",
          "maxQuantity": 3,
          "image": "https://cloud.appwrite.io/..."
        }
      ]
    }
  ]
}
```

## Available Customization Images

All images are available in `assets/images/` and imported in `constants/index.ts`:

### Toppings
- onions.png
- tomatoes.png
- cheese.png
- avocado.png
- bacon.png
- mushrooms.png
- cucumber.png

### Sides
- fries.png
- salad.png
- onion-rings.png
- coleslaw.png
- mozarella-sticks.png

### Proteins
- grilled-chicken.png

### Drinks
- drinks.png

## Migration Strategy

### Phase 1: Test with Current Implementation (CURRENT)
- ✅ Customizations work with local data
- ✅ Images display from local assets
- ✅ Cart and kitchen orders support customizations
- ✅ All UI components ready

### Phase 2: Upload Images to Appwrite Storage
1. Create storage bucket named "menu-images"
2. Upload all customization images from `assets/images/`
3. Set appropriate read permissions
4. Get public URLs for each image

### Phase 3: Update Database Schema
1. Add new fields to MenuItem collection in Appwrite console
2. Set `customizations` field type to "JSON"
3. Update existing menu items with customization data

### Phase 4: Migrate Code
1. Update `lib/appwrite.ts` to fetch customizations from database
2. Modify `convertToEnrichedMenuItem()` in `menu.tsx`:
   ```typescript
   const convertToEnrichedMenuItem = (item: DBMenuItem): EnrichedMenuItem => {
       return {
           id: item.$id,
           name: item.name,
           description: item.description,
           price: item.price,
           image: item.image,
           category: item.category,
           // Use database customizations if available, fallback to local
           customizations: item.customizations || getCustomizationsForItem(item.name, item.category),
           preparationTime: item.preparationTime || 15,
           isPopular: item.featured || false,
       };
   };
   ```

## Kitchen Dashboard Integration

The customization data is already structured for kitchen use:

### Order Format for Kitchen
```typescript
{
  orderId: "ABC123",
  orderNumber: 45,
  items: [
    {
      name: "Burger Tambacounda",
      quantity: 2,
      basePrice: 3500,
      customizations: [
        { category: "Sauces", option: "Ketchup", quantity: 1 },
        { category: "Garnitures", option: "Oignons", quantity: 2 },
        { category: "Accompagnements", option: "Frites" }
      ],
      totalPrice: 4400,
      specialInstructions: "Sans oignons crus"
    }
  ]
}
```

### Kitchen Display Features
- **Order Number**: Large, visible
- **Item Name**: Bold
- **Customizations**: Grouped by category with quantities
- **Special Instructions**: Highlighted
- **Preparation Time**: Estimated based on items

## Testing Checklist

- [x] Menu items display from database
- [x] Customization modal opens for items with customizations
- [x] Images display in customization modal
- [x] Price calculation includes customization prices
- [x] Cart stores selected customizations
- [x] Kitchen order format includes customizations
- [ ] Database schema updated (pending)
- [ ] Images uploaded to Appwrite Storage (pending)
- [ ] Database menu items include customizations field (pending)

## Files Modified

### Core Files
- `app/(tabs)/menu.tsx` - Restored database integration with customizations
- `lib/customizationData.ts` - Customization options with local images
- `constants/index.ts` - Image exports updated

### Type Definitions
- `types/menu.types.ts` - MenuItem with customizations
- `types/kitchen.types.ts` - Kitchen order structure
- `type.d.ts` - Original MenuItem from database

### Components
- `components/MenuItemCard.tsx` - Menu display with customization trigger
- `components/MenuItemCustomizationModal.tsx` - Interactive customization UI
- `components/HeartButton.tsx` - Favorites
- `components/NotificationBell.tsx` - Notifications
- `components/OrderTrackingWidget.tsx` - Order status

### State Management
- `store/cart.store.ts` - Enhanced with kitchen order creation
- `store/favorites.store.ts` - Favorites state
- `store/notification.store.ts` - Notifications
- `store/orderTracking.store.ts` - Order tracking

## Support

For questions about the customization system, refer to:
- `lib/customizationData.ts` - Available customizations
- `types/menu.types.ts` - TypeScript interfaces
- `types/kitchen.types.ts` - Kitchen order format
