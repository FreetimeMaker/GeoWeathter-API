# GeoWeather Orte Migration & Free Plan TODO

## Status: COMPLETED ✅

### 1. [DONE] Analysis & Planning
- ✅ Analyzed all favorite-related files
- ✅ Created detailed edit plan
- ✅ User approved plan

### 2. DB Schema Update
- ✅ Updated scripts/migrate.js: favorites → orte table/index
- [ ] Run `node scripts/migrate.js`
- [ ] Verify Vercel DB schema

### 3. Rename Files & Core Changes
- [ ] Create src/models/Orte.js (from Favorite.js)
- [ ] Create src/controllers/OrteController.js (from FavoriteController.js)
- [ ] Create src/routes/orte.js (from favorites.js)
- [ ] Update src/index.js: imports/routes

### 4. Free Plan for Unauthenticated
- [ ] Create src/middleware/optionalAuth.js
- [ ] Update orte.js routes to use optionalAuth
- [ ] Update OrteController: Handle anon userId gen + free limits

### 5. Feature Renames & Fixes
- [ ] Update src/models/Subscription.js: maxOrte
- [ ] Update src/utils/helpers.js: getNearbyOrte
- [ ] Update tests/subscription-limits.test.js

### 6. Notifications Android Only
- [ ] Update src/services/PushNotificationService.js: Android check
- [ ] Update routes/freemium.js & premium.js: pass platform

### 7. Testing & Deploy
- [ ] `npm test`
- [ ] Test endpoints (auth/anon)
- [ ] Vercel deploy
- [ ] [DONE] Update this TODO

**Next step: DB migration → Run migrate.js**

