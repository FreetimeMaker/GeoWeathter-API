# GeoWeather API - Dokumentation

## Überblick

Die GeoWeather API ist eine Cloud-basierte Backend-Lösung für eine Wetter-App mit folgenden Features:

### 1. **Favoriten-Sync (Standorte)**
- Benutzer können Orte speichern und in der Cloud verwalten
- Geräteübergreifende Synchronisation ermöglicht nahtlose Erfahrung über mehrere Geräte
- REST API für CRUD-Operationen auf Favoriten

### 2. **Wetter-History-Archiv**
- App speichert lokale Messungen (Temperatur, Luftdruck, Sensoren)
- Cloud speichert Langzeit-Graphen für Trendanalyse
- Monatliche und jährliche Statistiken
- CSV-Export für Premium-Benutzer

### 3. **Premium-Open-SaaS**
- **Kostenlos**: 5 Favoriten, 30 Tage History, 1 Datenquelle
- **Premium**: 50 Favoriten, 365 Tage History, 3 Datenquellen, Push-Benachrichtigungen, Karten-Layer
- **Enterprise**: Unbegrenzte Ressourcen, 10 Datenquellen, erweiterte API-Limits

## Installation

### Voraussetzungen
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional, für Caching)
- Docker & Docker Compose (optional)

### Setup mit Docker Compose (empfohlen)

\`\`\`bash
# Repository klonen
git clone https://github.com/yourusername/GeoWeathter-API.git
cd GeoWeathter-API

# Environment-Variablen erstellen
cp .env.example .env

# Mit Docker Compose starten
docker-compose up -d

# Datenbankmigrationen ausführen
docker-compose exec api npm run db:migrate
\`\`\`

### Setup lokal

\`\`\`bash
# Dependencies installieren
npm install

# .env Datei mit Datenbankangaben erstellen
cp .env.example .env

# PostgreSQL-Datenbank erstellen
createdb geoweather

# Migrationen ausführen
npm run db:migrate

# Server starten
npm run dev
\`\`\`

## API-Dokumentation

### Authentication

Alle geschützten Endpoints erfordern einen JWT-Token im Header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

### Endpoints

#### Authentication

**POST /api/auth/register**
Neuen Benutzer registrieren

\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
\`\`\`

Response:
\`\`\`json
{
  "message": "Benutzer erfolgreich registriert",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscription_tier": "free"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
\`\`\`

**POST /api/auth/login**
Benutzer anmelden

\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`

#### Favorites

**POST /api/favorites**
Neuen Favorit erstellen

\`\`\`json
{
  "name": "Lieblingslocation",
  "latitude": 48.1234,
  "longitude": 11.5678
}
\`\`\`

**GET /api/favorites**
Alle Favoriten abrufen

**GET /api/favorites/:id**
Einzelnen Favorit abrufen

**PUT /api/favorites/:id**
Favorit aktualisieren

\`\`\`json
{
  "name": "Neue Location",
  "latitude": 48.2000,
  "longitude": 11.6000
}
\`\`\`

**DELETE /api/favorites/:id**
Favorit löschen

**POST /api/favorites/sync**
Favoriten geräteübergreifend synchronisieren

\`\`\`json
{
  "favorites": [
    {"name": "Location 1", "latitude": 48.1, "longitude": 11.5},
    {"name": "Location 2", "latitude": 48.2, "longitude": 11.6}
  ]
}
\`\`\`

#### Weather History

**POST /api/weather-history/record**
Wetterdaten aufzeichnen

\`\`\`json
{
  "location": "München",
  "temperature": 22.5,
  "humidity": 65,
  "pressure": 1013.25,
  "windSpeed": 5.2,
  "conditions": "Wolkig",
  "sensorData": {
    "deviceId": "sensor_001",
    "accuracy": 0.95
  }
}
\`\`\`

**GET /api/weather-history**
Wetterverlauf in Zeitraum abrufen

Query Parameter:
- \`startDate\` (required): ISO-Format Datum
- \`endDate\` (required): ISO-Format Datum
- \`location\` (optional): Filterung nach Ort

\`\`\`
GET /api/weather-history?startDate=2024-01-01&endDate=2024-01-31&location=München
\`\`\`

**GET /api/weather-history/analytics/monthly**
Monatliche Statistiken

Query Parameter:
- \`location\` (required)
- \`year\` (required)
- \`month\` (required)

**GET /api/weather-history/analytics/yearly**
Jährliche Trends

Query Parameter:
- \`location\` (required)
- \`year\` (required)

**GET /api/weather-history/export**
Wetterdaten als CSV exportieren (Premium)

Query Parameter:
- \`startDate\` (required)
- \`endDate\` (required)

#### Subscriptions

**GET /api/subscriptions**
Aktuelles Abonnement abrufen

**POST /api/subscriptions**
Neues Abonnement erstellen

\`\`\`json
{
  "tier": "premium",
  "paymentMethod": "stripe"
}
\`\`\`

**PUT /api/subscriptions**
Abonnement upgraden

\`\`\`json
{
  "tier": "enterprise",
  "paymentMethod": "stripe"
}
\`\`\`

**GET /api/subscriptions/features**
Verfügbare Features basierend auf Tier

Response:
\`\`\`json
{
  "tier": "premium",
  "features": {
    "maxFavorites": 50,
    "maxHistoryDays": 365,
    "dataSourcesCount": 3,
    "pushNotifications": true,
    "mapLayers": true,
    "dataExport": true
  }
}
\`\`\`

## Datenbankschema

### Users
- \`id\`: UUID (Primary Key)
- \`email\`: VARCHAR (Unique)
- \`password\`: VARCHAR (hashed)
- \`name\`: VARCHAR
- \`subscription_tier\`: VARCHAR (free, premium, enterprise)
- \`created_at\`: TIMESTAMP
- \`updated_at\`: TIMESTAMP

### Favorites
- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID (Foreign Key)
- \`name\`: VARCHAR
- \`latitude\`: DECIMAL(10,8)
- \`longitude\`: DECIMAL(11,8)
- \`created_at\`: TIMESTAMP
- \`updated_at\`: TIMESTAMP

### Weather History
- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID (Foreign Key)
- \`location\`: VARCHAR
- \`temperature\`: DECIMAL(5,2)
- \`humidity\`: DECIMAL(5,2)
- \`pressure\`: DECIMAL(7,2)
- \`wind_speed\`: DECIMAL(5,2)
- \`conditions\`: VARCHAR
- \`sensor_data\`: JSONB
- \`recorded_at\`: TIMESTAMP
- \`created_at\`: TIMESTAMP

### Subscriptions
- \`id\`: UUID (Primary Key)
- \`user_id\`: UUID (Foreign Key)
- \`tier\`: VARCHAR (free, premium, enterprise)
- \`payment_method\`: VARCHAR
- \`created_at\`: TIMESTAMP
- \`expires_at\`: TIMESTAMP
- \`is_active\`: BOOLEAN

## Entwicklung

### Befehle

\`\`\`bash
# Development Server mit Hot-Reload
npm run dev

# Produktions-Server
npm start

# Tests ausführen
npm test

# Linting
npm run lint

# Datenbankmigrationen
npm run db:migrate
\`\`\`

## Deployment

### Zu Heroku

\`\`\`bash
# Heroku App erstellen
heroku create geoweather-api

# Environment-Variablen setzen
heroku config:set JWT_SECRET=your_secret_key
heroku config:add buildpacks "heroku/nodejs"

# Deployen
git push heroku main
\`\`\`

### Zu AWS/DigitalOcean

Nutze Docker Compose oder Kubernetes für containerisierte Deployments.

## Sicherheit

- Passwörter sind mit bcrypt gehashed
- JWT-Token für Authentifizierung
- CORS aktiviert
- Helmet.js für Security Headers
- SQL-Injection-Schutz durch parameterized queries
- HTTPS wird empfohlen in Produktion

## Error Handling

Alle API-Responses folgen standardisiertem Format:

Success (2xx):
\`\`\`json
{
  "message": "Success message",
  "data": {}
}
\`\`\`

Error (4xx, 5xx):
\`\`\`json
{
  "message": "Error message",
  "error": {}
}
\`\`\`

## Contributing

1. Fork das Repository
2. Feature Branch erstellen (\`git checkout -b feature/AmazingFeature\`)
3. Changes committen (\`git commit -m 'Add AmazingFeature'\`)
4. Zum Branch pushen (\`git push origin feature/AmazingFeature\`)
5. Pull Request öffnen

## License

MIT License - siehe LICENSE Datei
