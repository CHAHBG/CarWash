# Database Schema Update Guide

## ✅ Fixed: Freeze Issue

The app freeze when clicking "Personnaliser" has been fixed! The issue was caused by:
- Complex BlurView component causing performance problems
- Heavy animations (Animated.parallel with spring/timing)

**Solution Applied:**
- Removed BlurView - now uses simple semi-transparent background
- Simplified to native Modal with "slide" animation
- Modal state resets properly when closed

## 📋 Steps to Update Appwrite Database

### Step 1: Add Customizations Attribute (Manual in Appwrite Console)

1. **Open Appwrite Console**
   - Go to: https://cloud.appwrite.io (or your self-hosted URL)
   - Navigate to your project

2. **Go to Databases**
   - Click "Databases" in left sidebar
   - Select your database (ID: `69063306000938349d80`)

3. **Select Menu Collection**
   - Find and click "menu" collection

4. **Add New Attribute**
   - Click "Attributes" tab
   
   **IMPORTANT: If you already created the attribute, delete it first:**
   - Find "customizations" attribute
   - Click the trash icon to delete it
   - Confirm deletion
   
   - Click "+ Create attribute" button
   - Select **"String"** as attribute type (NOT JSON!)
   
   **Configuration:**
   - Attribute Key: `customizations`
   - Size: **16000** (important! Default 255 is too small)
   - Required: ❌ No (leave unchecked)
   - Array: ❌ No (leave unchecked)
   - Default: (leave empty)
   - Encrypt: ❌ No
   
   - Click "Create"

5. **Optional: Add Preparation Time**
   - Click "+ Create attribute" again
   - Select **"Integer"** type
   
   **Configuration:**
   - Attribute Key: `preparationTime`
   - Min: 1
   - Max: 120
   - Required: ❌ No
   - Default: 15
   
   - Click "Create"

### Step 2: Run Database Update Script

1. **Install Node Appwrite SDK** (if not already installed)
   ```powershell
   npm install node-appwrite
   ```

2. **Get Your API Key**
   - In Appwrite Console, go to "Settings" → "API Keys"
   - Click "Create API Key"
   - Name: "Database Update Script"
   - Expiration: Set to 1 day (you can delete after)
   - Scopes: Check:
     - ✅ `databases.read`
     - ✅ `databases.write`
   - Click "Create"
   - **Copy the API key** (you won't see it again!)

3. **Update Script Configuration**
   - Open: `scripts/updateDatabaseSchema.mjs`
   - Update these values at the top:
     ```javascript
     const config = {
         endpoint: 'https://cloud.appwrite.io/v1',  // Your Appwrite URL
         projectId: 'YOUR_PROJECT_ID',               // From Appwrite console
         apiKey: 'YOUR_API_KEY',                     // From step 2
         databaseId: '69063306000938349d80',         // Already correct
         menuCollectionId: 'menu',                   // Already correct
     };
     ```

4. **Run the Script**
   ```powershell
   node scripts/updateDatabaseSchema.mjs
   ```

   The script will:
   - ✅ Fetch all menu items
   - ✅ Assign appropriate customizations based on item names
   - ✅ Update each item in the database
   - ✅ Verify the updates

### Step 3: Test the App

1. **Restart the App** (if running)
   ```powershell
   npm start
   ```

2. **Test Customization Flow**
   - Navigate to Menu tab
   - Click on any item with "Personnaliser" button
   - Modal should open smoothly (no freeze!)
   - Select customizations
   - Verify price updates correctly
   - Add to cart
   - Check cart shows customizations

## 🎯 What Changed in the App

### Files Modified:

1. **`components/MenuItemCustomizationModal.tsx`**
   - ✅ Removed BlurView (performance issue)
   - ✅ Removed complex Animated API usage
   - ✅ Now uses native Modal with "slide" animation
   - ✅ Proper state reset on close
   - ✅ Added null check for customizations array

2. **`app/(tabs)/menu.tsx`**
   - ✅ Now checks database for customizations first
   - ✅ Falls back to local customizations if not in database
   - ✅ Handles JSON parsing safely with try/catch

3. **`type.d.ts`**
   - ✅ Added `customizations?: any` field to MenuItem interface
   - ✅ Added `preparationTime?: number` field

### How It Works Now:

```
┌─────────────────────────────────────────┐
│  Menu Item Loading                       │
├─────────────────────────────────────────┤
│  1. Fetch from Appwrite Database        │
│  2. Check if item.customizations exists │
│     ├─ YES: Parse and use database data │
│     └─ NO: Use local customizations     │
│  3. Display menu item                   │
│  4. User clicks "Personnaliser"         │
│  5. Modal opens with customizations     │
│  6. User selects options                │
│  7. Add to cart with selections         │
└─────────────────────────────────────────┘
```

## 🔍 Verification Checklist

After running the update script:

- [ ] All menu items have customizations field
- [ ] Burgers have: sauces, toppings, sides, drinks
- [ ] Yassa has: protein choice, spice level, sides, drinks
- [ ] Thiéboudienne has: fish type, vegetables, drinks
- [ ] Other items have: drinks only
- [ ] Modal opens without freezing
- [ ] Customizations display correctly
- [ ] Price calculation works
- [ ] Items add to cart with customizations

## 📊 Customization Assignment Logic

The script assigns customizations based on item names:

| Item Name Contains | Customizations Assigned |
|-------------------|------------------------|
| "burger", "sandwich" | Full burger set (sauces, toppings, sides, drinks) |
| "yassa" | Yassa set (protein, spice level, sides, drinks) |
| "thieb", "ceeb" | Thiéboudienne set (fish type, vegetables, drinks) |
| Other items | Drinks only |

## 🛠️ Troubleshooting

### Issue: Script fails with "Invalid API key"
**Solution:** Make sure you copied the full API key and it has `databases.read` and `databases.write` permissions.

### Issue: "Attribute 'customizations' doesn't exist"
**Solution:** Complete Step 1 (Manual Console Steps) first before running the script.

### Issue: Modal still freezes
**Solution:** 
1. Clear app cache: Close app completely
2. Restart Metro bundler: `npm start` and press `r` to reload
3. If on iOS simulator: Device → Erase All Content and Settings

### Issue: Customizations not showing
**Solution:**
1. Check Appwrite Console → menu collection → pick any item
2. Verify "customizations" field has data
3. Check app console for parsing errors
4. Verify database ID and collection ID in `lib/appwrite.ts`

## 🎉 Success!

After completing these steps:
- ✅ App loads menu from database
- ✅ Customizations stored in database (not hardcoded)
- ✅ Modal opens smoothly without freeze
- ✅ You can update customizations per item in Appwrite Console
- ✅ Kitchen dashboard will receive detailed customization data

## 📝 Future Enhancements

You can now easily:
- Add new customization options via Appwrite Console
- Change prices for specific items
- Add seasonal items with unique customizations
- A/B test different customization sets
- Track which customizations are most popular

---

**Need Help?** Check the logs when running the script - they show exactly what's being updated!
