# Deployment Guide

## Overview

This document describes various ways to deploy the GeoWeather API.

## 1. Docker Compose (Local Development & Staging)

### Quick Start

```bash
docker-compose up -d
docker-compose exec api npm run db:migrate
```

The API is then available at `http://localhost:3000`

### View Logs

```bash
docker-compose logs -f api
```

### Stop

```bash
docker-compose down
```

## 2. Heroku

### Preparation

```bash
npm install -g heroku
heroku login
```

### Deployment

```bash
# Create app
heroku create geoweather-api

# Set environment variables
heroku config:set \
  JWT_SECRET="your_long_secret_key" \
  OPENWEATHER_API_KEY="your_key" \
  WEATHER_API_KEY="your_key" \
  NODE_ENV=production

# Install PostgreSQL Add-on
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
```

### Logs

```bash
heroku logs --tail
```

## 3. AWS (EC2 + RDS)

### EC2 Instance Setup

```bash
# SSH into EC2 instance
ssh -i key.pem ec2-user@your-instance.amazonaws.com

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Clone repository
git clone https://github.com/yourusername/GeoWeathter-API.git
cd GeoWeathter-API

# Install dependencies
npm install

# Set environment variables
nano .env
# Add RDS connection details
```

### Create RDS PostgreSQL

```bash
# Via AWS Management Console:
# 1. RDS > Create Database
# 2. Engine: PostgreSQL 15
# 3. DB Instance: db.t3.micro (Free Tier)
# 4. Save endpoint and credentials
```

### Environment Variables

```
DATABASE_URL=postgresql://user:password@rds-endpoint:5432/geoweather
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secret
```

### Create Systemd Service

```bash
sudo nano /etc/systemd/system/geoweather-api.service
```

```ini
[Unit]
Description=GeoWeather API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/GeoWeathter-API
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable geoweather-api
sudo systemctl start geoweather-api
```

## 4. DigitalOcean (App Platform)

### Via Dashboard

1. Apps > Create App
2. Connect GitHub Repository
3. Add environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - etc.
4. Deploy

### Via CLI

```bash
# Install doctl
sudo snap install doctl

# Authenticate
doctl auth init

# Configure deployment
doctl apps create --spec app.yaml
```

## 5. Vercel (Serverless)

### Preparation

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

### Set up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Storage > Create Database > Postgres
4. Copy the `DATABASE_URL`

### Deployment

```bash
# In project directory
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add OPENWEATHER_API_KEY
vercel env add WEATHER_API_KEY
vercel env add CORS_ORIGIN

# Deploy
vercel --prod
```

### Run Migrations

After the first deployment:

```bash
vercel run npm run db:migrate
```

### Notes

- Vercel uses serverless functions, so WebSocket connections (Socket.io) are not supported
- For production with high load, consider Heroku or AWS
- Costs: Free tier available, paid from 1000 function calls/month

## 6. Google Cloud Run

### Preparation

```bash
# Install Cloud SDK
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login
```

### Deployment

```bash
# Build image
docker build -t gcr.io/PROJECT_ID/geoweather-api .

# Push to Container Registry
docker push gcr.io/PROJECT_ID/geoweather-api

# Deploy to Cloud Run
gcloud run deploy geoweather-api \
  --image gcr.io/PROJECT_ID/geoweather-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL="..." \
  --allow-unauthenticated
```

## 7. Kubernetes (Production)

### Create Helm Chart

```bash
helm create geoweather-api
```

### Values anpassen

```yaml
# values.yaml
replicaCount: 3

image:
  repository: gcr.io/PROJECT_ID/geoweather-api
  tag: latest

resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"

env:
  - name: NODE_ENV
    value: production
  - name: PORT
    value: "3000"
```

### Deployment

```bash
helm install geoweather-api ./geoweather-api \
  --namespace production \
  --create-namespace
```

## Monitoring & Logging

### Health Checks

```bash
curl http://your-api.com/api/health
```

### Logs aggregieren

```bash
# Mit ELK Stack, DataDog, New Relic etc.
```

## SSL/TLS Certificates

### Let's Encrypt mit Certbot

```bash
sudo certbot certonly --standalone -d api.geoweather.com
```

### Nginx als Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api.geoweather.com;

    ssl_certificate /etc/letsencrypt/live/api.geoweather.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.geoweather.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backups

### Datenbank-Backups automatisieren

```bash
# Täglich um 2 Uhr nachts
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### S3 Backup

```bash
aws s3 sync /backups s3://geoweather-backups/
```

## Performance Optimization

### Caching

- Redis für Session-Caching
- CloudFlare für CDN
- Browser-Caching mit ETag/Cache-Control Headers

### Database Indexing

Siehe `scripts/migrate.js` für Index-Konfiguration

### Rate Limiting

```javascript
// Express rate limiter
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## Scaling

- **Horizontal**: Load Balancer + mehrere API-Instanzen
- **Vertikal**: Größere Server-Ressourcen
- **Database**: Read Replicas, Sharding bei Bedarf

## Troubleshooting

### Connection refused

```bash
# Port-Bindung prüfen
netstat -tlnp | grep 3000
```

### Memory Leaks

```bash
node --max-old-space-size=4096 src/index.js
```

### Slow Queries

```sql
-- PostgreSQL slow query log aktivieren
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

---

Für weitere Fragen siehe [docs/API.md](API.md)
