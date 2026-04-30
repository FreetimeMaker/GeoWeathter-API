# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial GitHub public release preparation

### Changed
- Updated README for GitHub
- Added GitHub Actions CI/CD pipeline
- Added community guidelines

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- None

---

## [1.0.0] - 2024-01-XX

### Added
- ☁️ **Favoriten-Sync**: Geräteübergreifende Standort-Synchronisation
- 📊 **Wetter-History-Archiv**: Speichern und Analysieren von Wetterdaten
- 💰 **Premium-Abonnement-System**: Free, Premium, Enterprise Tiers
- 🎯 **Premium-Features**:
  - Multi-Source Wetterdaten (OpenWeather, WeatherAPI)
  - Push-Benachrichtigungen für Wetterwarnungen
  - Karten-Layer (Radar, Satellit, Heatmap)
  - CSV-Datenexport
- 🔐 **Authentifizierung**: JWT-basierte User-Auth mit Bcrypt
- 🧪 **Testing**: Jest Unit Tests und Integration Tests
- 🐳 **Containerization**: Docker & Docker Compose Support
- 📚 **Dokumentation**: Vollständige API, Architecture und Deployment Guides
- 🚀 **Deployment**: Guides für 6 verschiedene Plattformen
- ✅ **Production-Ready**: Skalierbar, sicher und dokumentiert

### Changed
- None (Initial release)

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- JWT Token Authentifizierung
- Bcrypt Passwort-Hashing
- CORS + Helmet Security Headers
- SQL-Injection Schutz
- Input-Validierung

---

## How to Update Changelog

### For Contributors
When making a change, add it to the [Unreleased] section under the appropriate category:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Upcoming removal
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

Format: `- [SCOPE]: Short description`

Example:
```markdown
### Added
- [AUTH]: Add password reset functionality
- [API]: Add rate limiting to endpoints

### Fixed
- [FAVORITES]: Fix duplicate favorites appearing after sync
- [HISTORY]: Handle missing sensor data gracefully
```

### For Maintainers
When preparing a release:
1. Update version number following semver
2. Change [Unreleased] to [VERSION] with date
3. Add new [Unreleased] section
4. Create git tag
5. Create GitHub Release

---

## Version History

| Version | Release Date | Status |
|---------|--------------|--------|
| 1.0.0 | 2024-01-XX | 🎉 Initial Release |

---

## Planned Features (Roadmap)

### v1.1.0
- [ ] WebSocket Support
- [ ] Real-time Notifications
- [ ] User Profiles

### v1.2.0
- [ ] Stripe Payment Integration
- [ ] Advanced Analytics Dashboard
- [ ] User Preferences/Settings

### v2.0.0
- [ ] GraphQL API
- [ ] Mobile SDKs
- [ ] Machine Learning Predictions

---

## Notes

- Breaking changes require major version bump
- Security fixes should trigger patch release
- Use ISO 8601 date format (YYYY-MM-DD)
- Link to related issues when applicable

---

**Keep this changelog updated! It helps users understand what's new.** 📖
