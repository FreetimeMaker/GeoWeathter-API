# GitHub Configuration

## .github Folder Structure

```
.github/
├── workflows/          # GitHub Actions
│   └── ci-cd.yml      # CI/CD Pipeline
├── ISSUE_TEMPLATE/    # Issue Templates
│   ├── bug_report.yml
│   └── feature_request.yml
├── pull_request_template.md  # PR Template
└── README.md          # This file
```

## Workflows

### CI/CD Pipeline (.github/workflows/ci-cd.yml)

Automatisch auf jeden Push/PR:
1. **Tests**: Unit Tests mit Jest
2. **Linting**: Code Style Checks
3. **Security**: Vulnerability Audit
4. **Build**: Docker Image Build
5. **Staging**: Deploy zu Staging (nur develop branch)
6. **Production**: Deploy zu Production (nur main branch)

**Trigger:**
- Push zu main oder develop
- Pull Request gegen main oder develop

**Services:**
- PostgreSQL 15 für Test-Datenbank
- Node.js 18 Runtime

---

## Issue Templates

### Bug Report (.github/ISSUE_TEMPLATE/bug_report.yml)

Standardisierter Template für Bug-Reports mit:
- Bug-Titel
- Beschreibung
- Reproduzierschritte
- Erwartetes Verhalten
- Aktuelles Verhalten
- Screenshots/Logs
- Umgebung (Node.js, OS)
- Severity Level

### Feature Request (.github/ISSUE_TEMPLATE/feature_request.yml)

Template für Feature-Requests mit:
- Feature-Titel
- Problem-Statement
- Proposed Solution
- Alternative Approaches
- Use Cases
- Priority Level

---

## Pull Request Template (.github/pull_request_template.md)

Wird automatisch in neue PRs eingefügt:
- Description
- Related Issues
- Type of Change
- Changes Made
- Testing
- Checklist

---

## Setup Instructions

### 1. Repository Settings

```
Settings > General
├─ Repository name: GeoWeather-API
├─ Description: Cloud REST API for Weather App
└─ Visibility: Public

Settings > Branches
├─ Default branch: main
└─ Branch protection rules (see .github/README.md)
```

### 2. Activate GitHub Actions

```
Settings > Actions > General
├─ Actions permissions: Allow all actions
└─ Workflow permissions: Read and write
```

### 3. Secrets (im Repository)

Für die Workflows Secret hinzufügen:

```
Settings > Secrets and variables > Actions > New repository secret

Required:
- HEROKU_API_KEY (für Heroku Deploy)
- DOCKER_HUB_USERNAME (für Docker Hub)
- DOCKER_HUB_PASSWORD (für Docker Hub)
- DATABASE_URL (für Production)
- JWT_SECRET (für Production)
```

### 4. Labels

```
Issues > Labels > Create label

Recommended Labels:
- bug (Red #d73a4a)
- enhancement (Green #a2eeef)
- documentation (Blue #0075ca)
- good-first-issue (Purple #7057ff)
- help-wanted (Orange #ed1f5e)
- priority: critical (Red)
- priority: high (Orange)
- priority: medium (Yellow)
- priority: low (Green)
```

### 5. Milestones

```
Issues > Milestones > Create milestone

Examples:
- v1.1.0
- v1.2.0
- v2.0.0
```

---

## Best Practices

### Issue Management
1. **Label Issues** sofort mit Kategorie
2. **Set Priority** basierend auf Severity
3. **Assign zu Milestone** für Release-Planung
4. **Close mit PR** wenn möglich (Closes #123)

### Pull Requests
1. **Use Template** - wird automatisch eingefügt
2. **Link Issues** - referenziere zugehörige Issues
3. **Run Checks** - stelle sicher CI/CD passt
4. **Wait for Review** - braucht mindestens 1 Approval
5. **Squash & Merge** - clean commit history

### Workflows
1. **Commit to develop** für neue Features
2. **Create PR** gegen develop
3. **Merge** nach Approval
4. **Create Release** von main
5. **Tag Release** mit Version

---

## Automation Scripts (Optional)

### Auto-Label PRs
```yaml
# .github/workflows/auto-label.yml
name: Auto Label

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
```

### Auto-Close Stale Issues
```yaml
# .github/workflows/stale.yml
name: Close Stale

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v7
```

### Dependency Updates
```yaml
# .github/workflows/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## Monitoring

### GitHub Insights
- Settings > Insights > Network
- Settings > Insights > Traffic
- Settings > Insights > Contributors

### Status Badge

Für README.md:
```markdown
[![CI/CD](https://github.com/yourusername/GeoWeather-API/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/yourusername/GeoWeather-API/actions)
```

---

## Troubleshooting

### Workflows nicht ausgelöst?
- Check: Actions > All workflows (Enabled?)
- Check: Branch protection rules (Conflicting?)
- Check: Secrets konfiguriert?

### Secrets nicht verfügbar?
- Settings > Secrets and variables
- New repository secret (nicht organization)
- Workflow muss richtig referenzieren

### Tests failing in CI?
- Check PostgreSQL Service Status
- Check .env Variablen
- Lokale Tests laufen?

---

## Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Job Conditional Logic](https://docs.github.com/en/actions/using-jobs/using-conditions-to-control-job-execution)
- [Secret Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Viel Erfolg mit GeoWeather API auf GitHub! 🚀**
