```
GeoWeathter-API/
│
├── 📄 README.md                    # Projekt-Übersicht
├── 📄 QUICKSTART.md                # Schnellstart-Guide  
├── 📄 IMPLEMENTATION_SUMMARY.md    # Was wurde implementiert
├── 📄 package.json                 # Dependencies & Scripts
├── 📄 jest.config.js               # Test-Konfiguration
├── 📄 .eslintrc.json               # Linting-Regeln
├── 📄 .env.example                 # Environment-Template
├── 🔧 .gitignore                   # Git-Ignore
│
├── 🐳 Dockerfile                   # Production Image
├── 🐳 docker-compose.yml           # Development Environment
│
├── 📂 src/                          # Quellcode
│   ├── index.js                    # Express Server Entry Point
│   ├── 📂 config/
│   │   ├── database.js             # PostgreSQL Connection Pool
│   │   └── auth.js                 # JWT Token-Generierung
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js                 # JWT-Validierung
│   │   └── errorHandler.js         # Error-Handling
│   │
│   ├── 📂 models/
│   │   ├── User.js                 # User CRUD + Auth
│   │   ├── Favorite.js             # Favoriten Management + Sync
│   │   ├── WeatherHistory.js       # History Recording + Analytics
│   │   └── Subscription.js         # Abo-System + Feature-Control
│   │
│   ├── 📂 controllers/
│   │   ├── AuthController.js       # Register/Login Logic
│   │   ├── FavoriteController.js   # Favoriten Business Logic
│   │   ├── WeatherHistoryController.js # History Logic
│   │   └── SubscriptionController.js   # Abo Logic
│   │
│   ├── 📂 services/
│   │   ├── WeatherDataService.js   # OpenWeather + WeatherAPI Integration
│   │   ├── MapTileService.js       # Radar + Satellit + Heatmap
│   │   └── PushNotificationService.js # Alerts + Notifications
│   │
│   ├── 📂 routes/
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── favorites.js            # /api/favorites/*
│   │   ├── weatherHistory.js       # /api/weather-history/*
│   │   ├── subscriptions.js        # /api/subscriptions/*
│   │   └── premium.js              # /api/premium/*
│   │
│   ├── 📂 utils/
│   │   ├── validators.js           # Email, Koordinaten, Temp, etc.
│   │   └── helpers.js              # Pagination, Distance, Formatierung
│   │
│   └── 📂 __tests__/
│       ├── database.test.js        # DB Connection Tests
│       └── user.test.js            # User Model Tests
│
├── 📂 scripts/
│   └── migrate.js                  # PostgreSQL Migrationen
│
├── 📂 docs/
│   ├── API.md                      # 📖 Vollständige API-Dokumentation
│   ├── ARCHITECTURE.md             # 🏗️ System-Architektur & Datenfluss
│   ├── DEPLOYMENT.md               # 🚀 6 verschiedene Deployment-Optionen
│   └── Postman-Collection.json     # 📮 Postman API-Tests
│
└── 📂 .git/                        # Git Repository

═══════════════════════════════════════════════════════════════

KERNKOMPONENTEN:

🔐 AUTHENTIFIZIERUNG
   • JWT Token-basiert (7 Tage gültig)
   • Bcrypt Passwort-Hashing
   • Refresh Token Support

🌍 FAVORITEN-SYNC
   • Geräteübergreifende Synchronisation
   • Batch-Upload / Download
   • Limit basierend auf Tier

📊 WETTER-HISTORY
   • Temperatur, Luftdruck, Sensoren
   • Monatliche & jährliche Analytics
   • Automatische 1-Jahres-Archivierung
   • CSV-Export (Premium)

💰 SUBSCRIPTION-SYSTEM
   3 Tiers: Free (5 Favoriten, 30 Tage) →
             Premium (50 Favoriten, 365 Tage) →
             Enterprise (Unlimited)

🎯 PREMIUM-FEATURES
   • Multi-Source Wetterdaten
   • Push-Benachrichtigungen
   • Karten-Layer (Radar, Satellit)
   • Erweiterte Analytics

🗄️ DATENBANK
   • PostgreSQL 15
   • 5 Haupttabellen
   • Indizes für Performance
   • Foreign Keys mit Cascade

📦 ZUSÄTZLICH
   • Error Handling
   • Input Validierung
   • CORS Protection
   • Security Headers
   • Logging-ready
   • Test-Suite
   • Docker-ready
   • 6 Deployment-Optionen

═══════════════════════════════════════════════════════════════

ENDPOINTS ÜBERSICHT:

AUTH (3)
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout

FAVORITES (6)
  POST   /api/favorites
  GET    /api/favorites
  GET    /api/favorites/:id
  PUT    /api/favorites/:id
  DELETE /api/favorites/:id
  POST   /api/favorites/sync

WEATHER-HISTORY (5)
  POST   /api/weather-history/record
  GET    /api/weather-history
  GET    /api/weather-history/analytics/monthly
  GET    /api/weather-history/analytics/yearly
  GET    /api/weather-history/export

SUBSCRIPTIONS (4)
  POST   /api/subscriptions
  GET    /api/subscriptions
  PUT    /api/subscriptions
  GET    /api/subscriptions/features

PREMIUM (3)
  POST   /api/premium/weather-sources
  GET    /api/premium/map-layers
  POST   /api/premium/weather-alert

UTILITY (1)
  GET    /api/health

TOTAL: 24 Endpoints
═══════════════════════════════════════════════════════════════

QUICK START:

1. Mit Docker Compose:
   docker-compose up -d
   docker-compose exec api npm run db:migrate

2. Lokal:
   npm install
   npm run db:migrate
   npm run dev

API verfügbar auf: http://localhost:3000

═══════════════════════════════════════════════════════════════
```
