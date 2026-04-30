# Architektur der GeoWeather API

## System-Architektur

```
┌─────────────────────────────────────────────────────────┐
│                   Client Applications                    │
│        (Mobile App, Web App, Desktop Client)            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Load Balancer / API Gateway                 │
│                  (Nginx/HAProxy)                         │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  API Pod 1  │ │  API Pod 2  │ │  API Pod 3  │
│ (Node.js)   │ │ (Node.js)   │ │ (Node.js)   │
└────┬────────┘ └────┬────────┘ └────┬────────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
┌──────────────┐            ┌──────────────┐
│  PostgreSQL  │            │    Redis     │
│  (Database)  │            │  (Cache)     │
└──────────────┘            └──────────────┘
```

## Service-Struktur

### 1. API Layer (Express.js)
- REST Endpoints
- Request Validation
- Authentication (JWT)
- Error Handling
- Rate Limiting

### 2. Business Logic Layer (Controllers)
- User Management
- Favorite Management
- Weather Data Processing
- Subscription Management
- Premium Features

### 3. Data Access Layer (Models)
- Database Queries
- Data Transformation
- Caching Logic

### 4. External Integrations
- **Weather Data**: OpenWeather, WeatherAPI
- **Push Notifications**: Firebase Cloud Messaging
- **Payment Processing**: Stripe (Future)
- **Map Tiles**: OpenWeather Maps, Mapbox

## Datenfluss für Favoriten-Sync

```
┌─────────────────────────────────────────────┐
│ Device A: Save Favorite                     │
└────────────────┬────────────────────────────┘
                 │ POST /api/favorites
                 ▼
         ┌──────────────────┐
         │   API Server     │
         │  Authenticate    │
         └────────┬─────────┘
                  │ INSERT
                  ▼
         ┌──────────────────┐
         │   PostgreSQL     │
         │   (favorites)    │
         └────────┬─────────┘
                  │ SYNC EVENT
     ┌────────────┼────────────┐
     ▼            ▼            ▼
Device A      Device B      Device C
(Updated)     (Notified)    (Notified)
```

## Datenfluss für Weather History

```
┌──────────────┐
│  Sensor Data │
└────────┬─────┘
         │ POST /api/weather-history/record
         ▼
    ┌──────────────┐
    │  API Server  │
    │  Validate    │
    └────────┬─────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │   Redis      │
│ (persistent) │  │ (cache/agg)  │
└──────────────┘  └──────────────┘
         │
         ├─ History Table
         ├─ Analytics (monthly/yearly)
         └─ Archival after 1 year
```

## Premium Feature Flow

```
┌──────────────────────────┐
│  User: Premium Subscriber│
└────────────┬─────────────┘
             │
             ▼
    ┌──────────────────┐
    │ Check Tier       │
    │ subscription:    │
    │ 'premium'        │
    └────────┬─────────┘
             │ ✓ Authorized
    ┌────────┴──────────────────┐
    ▼                           ▼
┌──────────────┐         ┌──────────────┐
│ Weather Data │         │ Map Layers   │
│ from 3       │         │ Radar +      │
│ sources      │         │ Satellite    │
└──────────────┘         └──────────────┘
    │                           │
    ├─ OpenWeather             ├─ Radar tile
    ├─ WeatherAPI              ├─ Satellite
    └─ Custom Sources          └─ Temperature
             │                   Heat map
             └─────────┬────────┘
                       │
                       ▼
            ┌──────────────────┐
            │ Premium Response │
            │ (aggregated)     │
            └──────────────────┘
```

## Database Schema

### Users Table
```sql
users
├─ id (UUID, PK)
├─ email (VARCHAR, UNIQUE)
├─ password (VARCHAR, hashed)
├─ name (VARCHAR)
├─ subscription_tier (VARCHAR)
├─ created_at
└─ updated_at
```

### Favorites Table
```sql
favorites
├─ id (UUID, PK)
├─ user_id (FK → users)
├─ name (VARCHAR)
├─ latitude (DECIMAL)
├─ longitude (DECIMAL)
├─ created_at
└─ updated_at
```

### Weather History Table
```sql
weather_history
├─ id (UUID, PK)
├─ user_id (FK → users)
├─ location (VARCHAR)
├─ temperature (DECIMAL)
├─ humidity (DECIMAL)
├─ pressure (DECIMAL)
├─ wind_speed (DECIMAL)
├─ conditions (VARCHAR)
├─ sensor_data (JSONB)
├─ recorded_at
└─ created_at
```

### Subscriptions Table
```sql
subscriptions
├─ id (UUID, PK)
├─ user_id (FK → users)
├─ tier (VARCHAR)
├─ payment_method (VARCHAR)
├─ created_at
├─ expires_at
└─ is_active (BOOLEAN)
```

### Push Notifications Table
```sql
push_notifications
├─ id (UUID, PK)
├─ user_id (FK → users)
├─ title (VARCHAR)
├─ message (TEXT)
├─ event_type (VARCHAR)
├─ latitude (DECIMAL)
├─ longitude (DECIMAL)
├─ read (BOOLEAN)
└─ created_at
```

## Security Architecture

```
Client Request
    │
    ▼
┌─────────────────────────┐
│  1. HTTPS/TLS          │
│  Encryption in transit │
└────────────┬────────────┘
             │
             ▼
    ┌──────────────────┐
    │ 2. CORS Check    │
    │ Origin Validation│
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ 3. JWT Verify    │
    │ Authentication   │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ 4. Input Validate│
    │ Type checking    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ 5. Rate Limit    │
    │ DoS Protection   │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ 6. SQL Injection │
    │ Parameterized    │
    └────────┬─────────┘
             │
             ▼
        Process Request
```

## Scaling Strategy

### Horizontal Scaling
- Load Balancer distributes traffic
- Multiple API instances (pods)
- Stateless application design
- Database replicas for read operations

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers

### Database Optimization
- Connection pooling
- Query indexing
- Partitioning large tables
- Read replicas

## Disaster Recovery

```
Primary Datacenter    Backup Datacenter
┌──────────────────┐  ┌──────────────────┐
│   Active API     │  │    Standby API   │
│  Primary DB      │  │  Replica DB      │
└────────┬─────────┘  └────────┬─────────┘
         │ Real-time replication
         │ Continuous sync
         ▼
    ┌─────────────┐
    │ S3 Backups  │
    │ Daily 23:00 │
    └─────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────┐
│         Application Metrics             │
├─────────────────────────────────────────┤
│ • Request count & latency              │
│ • Error rates                          │
│ • Database query performance           │
│ • Cache hit rates                      │
│ • Memory & CPU usage                   │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌────────────┐          ┌──────────┐
    │ Prometheus │          │  Grafana │
    │(Collecting)│          │(Dashboard)│
    └────────────┘          └──────────┘
        │
        ▼
    ┌────────────┐
    │  AlertMgr  │
    │ (Alerts)   │
    └────────────┘
```
