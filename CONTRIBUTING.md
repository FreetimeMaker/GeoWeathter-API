# Contributing to GeoWeather API

Danke, dass du einen Beitrag zu GeoWeather API leisten möchtest! 🎉

## Code of Conduct

Dieses Projekt und alle Beteiligten halten sich an unseren [Code of Conduct](CODE_OF_CONDUCT.md). Mit Beiträgen akzeptierst du diese Regeln.

## Wie kann ich beitragen?

### 🐛 Bugs melden

Öffne ein [GitHub Issue](../../issues) mit:
- **Titel:** Kurze Zusammenfassung des Bugs
- **Beschreibung:** Detaillierte Erklärung
- **Schritte zum Reproduzieren:** Konkrete Schritte
- **Erwartetes Verhalten:** Was sollte passieren
- **Aktuelles Verhalten:** Was passiert stattdessen
- **Screenshots/Logs:** Falls relevant
- **Umgebung:** OS, Node.js Version, etc.

### 💡 Features vorschlagen

Öffne ein [GitHub Issue](../../issues) mit:
- **Titel:** Kurze Feature-Beschreibung
- **Motivation:** Warum ist diese Feature nützlich?
- **Vorgeschlagene Implementierung:** Wie könnte es umgesetzt werden?
- **Beispiele:** Use-Cases

### 🔧 Pull Requests

#### Vorbereitung

1. **Fork** das Repository
   ```bash
   git clone https://github.com/yourusername/GeoWeather-API.git
   cd GeoWeather-API
   ```

2. **Erstelle einen Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Setup Development Environment**
   ```bash
   npm install
   cp .env.example .env
   npm run db:migrate
   ```

4. **Implementiere deine Changes**
   - Schreibe sauberen, lesbaren Code
   - Folge dem existierenden Code-Style
   - Schreibe Tests für neue Features
   - Update Dokumentation falls nötig

5. **Tests ausführen**
   ```bash
   npm test              # Unit Tests
   npm run lint          # Code Linting
   npm test -- --coverage  # Coverage Report
   ```

6. **Committe deine Changes**
   ```bash
   git add .
   git commit -m "Add/Fix: Clear description of changes"
   ```

   **Commit Message Format:**
   - `feat:` für neue Features
   - `fix:` für Bug-Fixes
   - `docs:` für Dokumentation
   - `test:` für Tests
   - `refactor:` für Code-Umstrukturierung
   - `perf:` für Performance-Verbesserungen

   **Beispiele:**
   ```bash
   git commit -m "feat: Add email verification for registration"
   git commit -m "fix: Handle null latitude/longitude in favorites"
   git commit -m "docs: Update API documentation for weather endpoints"
   ```

7. **Push zu deinem Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Öffne einen Pull Request**
   - Gehe zu [Pull Requests](../../pulls)
   - Klicke "New Pull Request"
   - Wähle dein Feature Branch
   - Fülle die PR-Template aus

#### PR-Anforderungen

Bevor du einen PR öffnest, stelle sicher:
- ✅ Tests sind geschrieben und alle passen
- ✅ Linting hat keine Fehler
- ✅ Code-Coverage ist nicht gesunken
- ✅ Dokumentation ist aktualisiert
- ✅ Commit Messages sind aussagekräftig
- ✅ Keine Breaking Changes ohne guten Grund

#### PR-Review-Prozess

1. Mindestens 1 Maintainer wird deinen PR reviewen
2. Du wirst feedback erhalten falls nötig
3. Mache angeforderte Änderungen
4. PR wird gemergt wenn alles gut ist

---

## Development Richtlinien

### Code Style

- **Indentation:** 2 Spaces
- **Quotes:** Single Quotes `'`
- **Semicolons:** Always
- **Max Line Length:** 100 characters

```javascript
// ✅ Good
const getName = () => {
  return user.firstName + ' ' + user.lastName;
};

// ❌ Bad
const getName = () => { return user.firstName + ' ' + user.lastName }
```

### Testing

- Schreibe Tests für alle neuen Features
- Tests sollten in `src/__tests__/` liegen
- Nutze Jest und beschreibende Test-Namen
- Ziel: >80% Code Coverage

```javascript
describe('AuthController', () => {
  describe('login', () => {
    test('should return token for valid credentials', async () => {
      // Test code
    });

    test('should throw error for invalid credentials', async () => {
      // Test code
    });
  });
});
```

### Dokumentation

- Update [docs/API.md](docs/API.md) für API-Changes
- Update [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) für Architektur-Changes
- Schreibe Code-Comments für komplexe Logik
- Nutze JSDoc für Funktionen

```javascript
/**
 * Creates a new favorite location for a user
 * @param {string} userId - The user ID
 * @param {string} name - Location name
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} The created favorite
 * @throws {Error} If user has reached favorite limit
 */
async function createFavorite(userId, name, latitude, longitude) {
  // Implementation
}
```

### Git Workflow

```
main (production ready)
  ↓
develop (integration branch)
  ↓
feature/your-feature (your work)
```

---

## Lokale Entwicklung

### Datenbank Setup

```bash
# Mit Docker Compose (empfohlen)
docker-compose up -d

# Migrationen ausführen
npm run db:migrate

# Seed mit Test-Daten (optional)
npm run db:seed
```

### Environment Variables

```bash
cp .env.example .env

# Bearbeite .env mit deinen Settings:
DATABASE_URL=postgresql://user:password@localhost:5432/geoweather
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Development Server

```bash
npm run dev
# Server läuft auf http://localhost:3000
```

### API Testen

```bash
# Mit cURL
curl http://localhost:3000/api/health

# Mit Postman
# Importiere docs/Postman-Collection.json

# Mit npm test
npm test
```

---

## Branching Strategy

- **main:** Production-ready code
- **develop:** Integration branch für nächste Release
- **feature/\*:** Neue Features
- **fix/\*:** Bug-Fixes
- **docs/\*:** Nur Dokumentation

---

## Release-Prozess

1. Alle PRs sind gemergt
2. Version wird bumped (package.json)
3. CHANGELOG wird aktualisiert
4. Tag wird erstellt
5. Release wird gebaut und deployed

---

## FAQ

**Q: Wie lange dauert der Review?**
A: Normalerweise 1-3 Tage, je nach Komplexität.

**Q: Müssen alle Tests passen?**
A: Ja, alle Tests müssen passen vor dem Merge.

**Q: Kann ich mehrere Features in einem PR?**
A: Bitte halte PRs klein und fokussiert.

**Q: Brauche ich Feedback bevor ich anfange?**
A: Für größere Features: öffne zuerst ein Issue.

---

## Nützliche Links

- [API Dokumentation](docs/API.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Jest Documentation](https://jestjs.io/)
- [Express.js Guide](https://expressjs.com/)

---

## Support

- Fragen? Öffne ein [Discussion](../../discussions)
- Probleme? Erstelle ein [Issue](../../issues)
- Chat? Siehe Kontakt im README

---

**Danke für deinen Beitrag! 🚀**
