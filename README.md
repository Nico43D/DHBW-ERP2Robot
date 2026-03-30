# DHBW-ERP2Robot – E-Commerce Webshop

Ein E-Commerce-Webshop basierend auf einem [Figma-Design](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design), umgesetzt mit React, TypeScript, Vite und Tailwind CSS.

## Voraussetzungen

Stelle sicher, dass folgende Software installiert ist:

- **Node.js** (Version 18 oder höher) – [Download](https://nodejs.org/)
- **npm** (wird mit Node.js mitgeliefert)

Überprüfe die Installation im Terminal:

```bash
node --version
npm --version
```

## Installation

1. **Repository klonen:**

   ```bash
   git clone <repository-url>
   cd DHBW-ERP2Robot
   ```

2. **Abhängigkeiten installieren:**

   ```bash
   npm install
   ```

## Starten

### Development (Frontend + Backend)

**Terminal 1 – Frontend (React Dev Server):**

```bash
npm run dev
```

Frontend läuft unter [http://localhost:5173](http://localhost:5173)

**Terminal 2 – Backend (Node.js API Server):**

```bash
npm run server
```

Backend läuft unter [http://localhost:3000](http://localhost:3000)

**Voraussetzungen für Backend:**
- `.env` Datei mit iDempiere-Credentials (siehe [Konfiguration](#konfiguration))
- iDempiere REST API erreichbar
- Node.js 18+

### Full Stack Test

Nach dem Start beider Server:

1. Frontend: http://localhost:5173 öffnen
2. Mit Test-Benutzer einloggen oder neu registrieren
3. Bestellungen können dann erstellt werden

## Produktiv-Build erstellen

Um einen optimierten Build für die Produktion zu erzeugen:

```bash
npm run build
```

Die fertige Anwendung liegt danach im `dist/`-Ordner.

## Technologien

| Technologie | Zweck |
|---|---|
| React 18 | UI-Framework |
| TypeScript | Typsicherheit |
| Vite | Build-Tool & Dev-Server |
| Tailwind CSS 4 | Styling |
| React Router | Routing |
| Radix UI | Barrierefreie UI-Komponenten |
| Node.js/Express | Backend REST API |
| JWT | Authentifizierung |
| iDempiere REST API | ERP-Integration |

---

## Features

### Frontend

- **Shop & Katalog** – Produktübersicht mit Such- und Filterfunktion
- **Warenkorb** – Add/Remove/Update mit localStorage Persistierung
- **Checkout** – Mehrstufiger Bestellprozess
- **Authentication** – JWT-basierter Login & Registrierung
- **Benutzerkonto** – Dashboard, Bestellhistorie, Adressverwaltung
- **Responsive Design** – Mobile-first für alle Geräte

### Backend

- **User Authentication** – Login/Register über iDempiere
- **6-Step Registration** – Automatische Erstellung von:
  - iDempiere Business Partner
  - iDempiere Location (Adressdaten)
  - iDempiere User (AD_User)
  - Automatische Rollenvergabe
- **Order Management** – Bestellungen direkt aus dem Shop in iDempiere erstellen
- **Security** – Rate Limiting, CORS, httpOnly Cookies
- **Audit Logging** – Alle Login-, Registration- und Order-Events geloggt
- **Error Handling** – Strukturierte Fehlerresponses

### iDempiere Integration

- **Service Account Pattern** – Alle Backend-Zugriffe über GardenAdmin-Account
- **REST API** – Nicht-invasive Integration über iDempiere REST API
- **Models** – C_BPartner, C_Location, AD_User, C_Order, C_OrderLine
- **No Direct Database Access** – Nur über REST API

---

## Konfiguration

### Environment Variables (`.env`)

Erstelle eine `.env` Datei im Wurzelverzeichnis:

```bash
# Server
PORT=3000
NODE_ENV=development

# iDempiere REST API
IDEMPIERE_BASE_URL=http://localhost:8080/webservices/rest/v1
IDEMPIERE_SERVICE_USER=GardenAdmin
IDEMPIERE_SERVICE_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# Order Configuration
AUTH_ORG_ID=1000000
AUTH_WAREHOUSE_ID=1000226
ORDER_DOC_TYPE_TARGET_ID=1000082
ORDER_SALES_REP_ID=1000016
ORDER_PAYMENT_TERM_ID=1000000
ORDER_PRICE_LIST_ID=1000003
```

**Wichtig:**
- `JWT_SECRET` muss mindestens 32 Zeichen lang sein
- `.env` sollte nicht in Git committed werden (ist in `.gitignore`)
- Alle iDempiere-Werte müssen für die Installation korrekt gesetzt sein

---

## API Übersicht

Eine detaillierte API-Referenz mit JSON-Payloads ist in der [ARCHITECTURE.md](ARCHITECTURE.md) dokumentiert.

### Wichtige Endpoints

**Authentication:**
- `POST /api/auth/login` – Benutzer-Login
- `POST /api/auth/register` – Neue Registrierung
- `POST /api/auth/logout` – Logout
- `GET /api/auth/me` – Session-Check

**Orders:**
- `POST /api/orders/create-and-complete` – Bestellung erstellen & abschließen

**Catalog:**
- `GET /api/catalog` – Produktkatalog laden

## Architektur

Eine ausführliche Dokumentation der Projektarchitektur, Ordnerstruktur, Datenflüsse und API-Integrationswege befindet sich in der [ARCHITECTURE.md](ARCHITECTURE.md).

### 3-Schichten-Modell

```
┌─────────────────────────┐
│   Frontend (React)      │ Port 5173
│   - SPA, Routing        │
│   - Context API State   │
└────────────┬────────────┘
             │ HTTP/REST (JSON)
             ▼
┌─────────────────────────┐
│ Backend (Node/Express)  │ Port 3000
│ - REST API Endpoints    │
│ - Authentication        │
│ - Rate Limiting         │
│ - Audit Logging         │
└────────────┬────────────┘
             │ HTTP/REST (iDempiere API)
             ▼
┌─────────────────────────┐
│  iDempiere (ERP)        │ Port 8080
│  - Business Partner     │
│  - Orders               │
│  - Inventory            │
└─────────────────────────┘
```

### Datenflüsse

- **Login:** Frontend → Backend → iDempiere (Credentials-Check + User Data load)
- **Registration:** Frontend → Backend → iDempiere (6-Step-Prozess)
- **Order:** Frontend → Backend → iDempiere (Create Header + Lines + Complete)

Siehe [ARCHITECTURE.md: Datenflüsse](ARCHITECTURE.md#datenflüsse) für detaillierte Sequence Diagramme.

---

## Troubleshooting

### Backend startet nicht

```
Error: ENOENT: no such file or directory, open '.env'
```

**Lösung:** `.env` Datei erstellen mit iDempiere-Credentials:

```bash
cp .env.example .env
# Dann .env mit echten Werten füllen
```

### iDempiere Connection Error

```
Error: Failed to connect to iDempiere
```

**Überprüfen:**
1. iDempiere läuft unter `IDEMPIERE_BASE_URL`?
2. Service Account (`GardenAdmin`) existiert und Passwort korrekt?
3. Firewall/Netzwerk erlaubt Zuconnect Backend → iDempiere?

Test mit:

```bash
curl -X POST http://IDEMPIERE_URL/webservices/rest/v1/auth/tokens \
  -H "Content-Type: application/json" \
  -d '{"userName":"GardenAdmin","password":"xxx"}'
```

### JWT Token Issues

**Fehler: "Session abgelaufen"**

- Token ist älter als 7 Tage
- `JWT_SECRET` von `.env` stimmt nicht mit Backend überein
- Behebung: Browser-Cookies löschen → neu einloggen

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Überprüfen:**
1. Backend läuft auf Port 3000?
2. `CORS_ORIGIN` in `.env` enthält Frontend-URL?

Development (default OK):
```
origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
```

---

## Development Guide

### Code-Stil

- **TypeScript** – Strikte Typisierung everywhere
- **React Hooks** – Keine Class Components
- **Tailwind** – Keine Custom CSS (außer in `styles/`)
- **Components** – Kleine, wiederverwendbare Komponenten

### Branches

- `main` – Production (merge via PR)
- `dev` – Development (default branch)
- `feature/*` – Feature Branches

### Commits

Nutze aussagekräftige Commit Messages:

```
✨ feat: Add order history page
🐛 fix: Fix cart item quantity bug
📝 docs: Update API documentation
🔧 chore: Update dependencies
```

---

## Testing

### Frontend

```bash
npm run test          # Jest Tests
npm run test:watch   # Watch Mode
npm run lint         # ESLint
```

### Backend

```bash
npm run test:server  # Backend Tests (wenn vorhanden)
npm run server       # Dev Server mit Hot Reload
```

---

## Performance Tipps

- **Frontend:** Vite HMR für schnelle Reloads
- **Backend:** Rate Limiting schützt vor Abuse
- **iDempiere:** Nutze GardenAdmin-Account Token Caching
- **Browser:** Dev Tools Performance Tab checken

---

## Deployment

### Frontend Build

```bash
npm run build
```

Output: `dist/` folder – auf Apache, Nginx oder S3 deployen.

### Backend Deployment

Mit PM2:

```bash
npm install -g pm2
pm2 start server/index.js --name "duale-api"
pm2 save
pm2 startup
```

Mit Docker (optional):

```bash
docker build -t duale-api .
docker run -p 3000:3000 --env-file .env duale-api
```

---

## Lizenz & Credits

- **UI:** [shadcn/ui](https://ui.shadcn.com/) (MIT License)
- **Icons:** [Lucide React](https://lucide.dev/) (ISC License)
- **Design:** [Figma Prototype](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design)
- **Backend:** Express.js, JWT, iDempiere REST API
  