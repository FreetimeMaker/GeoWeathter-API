# Security Policy

## Reporting Security Vulnerabilities

Wenn du ein Sicherheitsproblem entdeckst, melde es **nicht** über GitHub Issues. Bitte sende stattdessen eine E-Mail an:

**security@geoweather.com**

### Was sollte die Meldung enthalten?

- Beschreibung der Sicherheitslücke
- Schritte zum Reproduzieren
- Mögliche Auswirkungen
- Vorgeschlagener Fix (falls vorhanden)

### Sicherheitsrichtlinien

1. **Keine Disclosure vor Fix:** Veröffentliche Details nicht, bevor wir einen Fix haben
2. **Reasonable Timeframe:** Gib uns 90 Tage Zeit für einen Fix
3. **Attribution:** Du wirst anerkannt, wenn gewünscht

## Unterstützte Versionen

| Version | Supported |
|---------|:---------:|
| 1.x.x   | ✅ |
| 0.x.x   | ❌ |

## Sicherheits-Best-Practices

### Authentifizierung
- ✅ JWT Tokens verwenden
- ✅ Tokens regelmäßig rotieren
- ✅ Sichere Secrets in .env speichern
- ✅ HTTPS in Production verwenden

### Passwörter
- ✅ Bcrypt (min. 10 rounds) für Hashing
- ✅ Min. 8 Zeichen erforderlich
- ✅ Komplexitätsanforderungen durchsetzen

### Datenbank
- ✅ Parameterized Queries verwenden
- ✅ Regelmäßige Backups
- ✅ Datenbank-Verschlüsselung aktivieren
- ✅ Least-Privilege Permissions

### API
- ✅ Rate Limiting aktivieren
- ✅ CORS richtig konfigurieren
- ✅ Input-Validierung durchführen
- ✅ Error Details nicht leaken

### Deployment
- ✅ Environment-spezifische Configs
- ✅ Secrets nicht in Git committen
- ✅ Regelmäßige Security Audits
- ✅ Logs für Audit Trail

---

Danke für die Hilfe beim Schutz von GeoWeather! 🔒
