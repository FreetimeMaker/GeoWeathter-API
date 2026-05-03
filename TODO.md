# GeoWeather API - Supabase Vercel Integration Fixes

## Current Status
- [x] Step 1: `.env.example` created ✅
- [x] Step 2: Fix helpers.js (export getNearbyOrte instead - Vercel crash fixed)
- [x] Step 3: Fix migrate.js (pg Pool + DATABASE_URL + SSL support) ✅
- [ ] Step 4: Vercel env vars + migrations
- [ ] Step 5: Prod verification (existing deploys: geo-weather-api.vercel.app crashing)

**Vercel Status:** CLI not installed. Existing projects crashing on helpers.js import.

**Next:** Read/fix src/utils/helpers.js to resolve ReferenceError.


