# GeoWeather API Login Fix - TODO

## Status: In Progress

### 1. ✅ Fix passport.js DB mismatch (Supabase instead of pg pool)
   - Replace pool.query with supabase.from('users')
   - Fix serializeUser/deserializeUser
   - Dynamic callbackURL
   
### 2. ✅ Add username/password routes to auth.js
   - POST /api/auth/login
   - POST /api/auth/register
   
### 3. ✅ Improve errorHandler logging
   
### 4. ✅ Add startup health check log in index.js
   
### 5. ✅ Test locally (server running, no crashes)
   
### 6. [ ] Deploy to Vercel
   
### 7. [ ] Verify /api/auth/github works
