#!/bin/bash

# GeoWeather API Setup Script

echo "🚀 GeoWeather API Setup"
echo "======================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm ist nicht installiert"
    exit 1
fi

echo "✓ Node.js $(node -v) gefunden"
echo "✓ npm $(npm -v) gefunden"

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo "✓ Docker $(docker --version) gefunden"
    read -p "Möchtest du Docker Compose verwenden? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ Docker Compose ist nicht installiert"
            exit 1
        fi
        echo "✓ Docker Compose wird verwendet"
        docker-compose up -d
        echo "⏳ Warte auf Datenbankverbindung..."
        sleep 5
        docker-compose exec -T api npm run db:migrate
        echo "✅ Setup mit Docker Compose abgeschlossen!"
        exit 0
    fi
fi

# Local setup
echo "📦 Installiere Abhängigkeiten..."
npm install

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL-CLI nicht gefunden"
    echo "Bitte stelle sicher, dass PostgreSQL installiert und konfiguriert ist"
    read -p "PostgreSQL-Host [localhost]: " db_host
    db_host=${db_host:-localhost}
else
    echo "✓ PostgreSQL gefunden"
    db_host="localhost"
fi

# Setup .env
if [ ! -f .env ]; then
    echo "📝 Erstelle .env Datei..."
    cp .env.example .env
    echo "⚠️  Bitte .env Datei bearbeiten mit deinen Datenbankangaben"
    read -p "Drücke Enter wenn .env konfiguriert ist..."
fi

echo "🔧 Führe Datenbankmigrationen aus..."
npm run db:migrate

echo "✅ Setup abgeschlossen!"
echo ""
echo "Starten mit: npm run dev"
