# GeoWeather API - Schnellstart-Guide

## 📋 Überblick

Dies ist eine vollständig funktionsfähige REST API für eine Wetter-App mit:

✅ **Authentifizierung** - JWT-basierte Benutzer-Authentifizierung
✅ **Favoriten-Sync** - Geräteübergreifende Synchronisation von Standorten
✅ **Wetter-Archiv** - Speichern und Analysieren von Wetterdaten
✅ **Premium-Features** - Multi-Source Wetterdaten, Push-Benachrichtigungen, Karten-Layer
✅ **Subscriptions** - Free, Premium, Enterprise Tiers

## 🚀 Installation & Start

### Option 1: Docker Compose (empfohlen)

```bash
cd /home/Jamie/Dokumente/Git/GeoWeathter-API
cp .env.example .env
docker-compose up -d
docker-compose exec api npm run db:migrate
```

API läuft dann auf: `http://localhost:3000`

### Option 2: Lokal

```bash
npm install
npm run db:migrate
npm run dev
```

## 🔑 API Endpoints (Übersicht)

### Authentication
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Anmeldung

### Favoriten (mit Token)
- `POST /api/favorites` - Neuer Favorit
- `GET /api/favorites` - Alle Favoriten
- `POST /api/favorites/sync` - Synchronisieren

### Wetter-History (mit Token)
- `POST /api/weather-history/record` - Daten aufzeichnen
- `GET /api/weather-history` - Verlauf abrufen
- `GET /api/weather-history/analytics/monthly` - Monatliche Stats
- `GET /api/weather-history/export` - Exportieren (Premium)

### Subscriptions (mit Token)
- `GET /api/subscriptions` - Aktuelles Abo
- `POST /api/subscriptions` - Neues Abo
- `PUT /api/subscriptions` - Upgrade

### Premium Features (mit Token + Premium-Abo)
- `POST /api/premium/weather-sources` - Multi-Source Daten
- `GET /api/premium/map-layers` - Karten-Layer
- `POST /api/premium/weather-alert` - Push-Benachrichtigungen

## 📝 Schnelle Beispiele

### 1. Benutzer registrieren

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "MyPassword123!",
    "name": "John Doe"
  }'
```

Response: `{ token, refreshToken, user }`

### 2. Favorit erstellen

```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "München",
    "latitude": 48.1351,
    "longitude": 11.5820
  }'
```

### 3. Wetterdaten aufzeichnen

```bash
curl -X POST http://localhost:3000/api/weather-history/record \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "München",
    "temperature": 22.5,
    "humidity": 65,
    "pressure": 1013.25,
    "windSpeed": 5.2,
    "conditions": "Wolkig"
  }'
```

### 4. Premium-Abo erstellen

```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "premium",
    "paymentMethod": "stripe"
  }'
```

## 🗄️ Datenbankstruktur

```
users          - Benutzerkonten
favorites      - Gespeicherte Standorte
weather_history - Aufgezeichnete Wetterdaten
subscriptions  - Abo-Informationen
push_notifications - Benachrichtigungen
```

## 📦 Projektstruktur

```
src/
├── config/          # Datenbank & Auth Config
├── controllers/     # Business Logic
├── middleware/      # Auth & Error Handling
├── models/         # Datenbankmodelle
├── routes/         # API Endpoints
├── services/       # External Integrations
├── utils/          # Helpers & Validators
└── index.js        # Server Entry Point

docs/
├── API.md          # Vollständige API Doku
├── ARCHITECTURE.md # System-Design
└── DEPLOYMENT.md   # Deployment Guides

scripts/
└── migrate.js      # Datenbankmigrationen
```

## 🔐 Authentifizierung

Alle geschützten Endpoints benötigen JWT-Token im Header:

```
Authorization: Bearer <JWT_TOKEN>
```

Token werden beim Login/Register erhalten und sind gültig für `JWT_EXPIRY` (default: 7 Tage).

## 💰 Subscription Tiers

| Feature | Free | Premium | Enterprise |
|---------|:----:|:-------:|:----------:|
| Favoriten | 5 | 50 | ∞ |
| History (Tage) | 30 | 365 | 1825 |
| Datenquellen | 1 | 3 | 10 |
| Push-Benachrichtigungen | ❌ | ✅ | ✅ |
| Karten-Layer | ❌ | ✅ | ✅ |
| Daten-Export | ❌ | ✅ | ✅ |

## 🛠️ Nützliche Befehle

```bash
# Development
npm run dev              # Mit Hot-Reload

# Production
npm start                # Server starten

# Testing
npm test                 # Tests ausführen
npm run lint             # Code-Linting

# Datenbank
npm run db:migrate      # Migrationen ausführen
```

## 🌐 Externe Integrationen

### Wetter-Daten
- **OpenWeather API** - `OPENWEATHER_API_KEY`
- **WeatherAPI** - `WEATHER_API_KEY`

### Notifications
- **Firebase Cloud Messaging** - `PUSH_NOTIFICATION_SERVICE=firebase`

### Payment (geplant)
- **Stripe** - Für Premium-Abo

## 📚 Dokumentation

- **API Dokumentation**: [docs/API.md](docs/API.md)
- **Architektur**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Postman Collection**: [docs/Postman-Collection.json](docs/Postman-Collection.json)

## 🔍 Testing

Die API wurde mit folgenden Tools getestet:

- Postman (API Tests)
- Jest (Unit Tests)
- Docker Compose (Integration Tests)

## 🚨 Häufige Probleme

### Port 3000 ist schon in Verwendung
```bash
lsof -i :3000
kill -9 <PID>
```

### Datenbankverbindung schlägt fehl
- `.env` Datei überprüfen
- PostgreSQL läuft?
- Anmeldedaten richtig?

### Migrations-Fehler
```bash
npm run db:migrate
```

## 📧 Support

Issues & Feature Requests: GitHub Issues
Fragen: Siehe [docs/API.md](docs/API.md)

---

**Viel Erfolg mit der GeoWeather API! 🌤️**
