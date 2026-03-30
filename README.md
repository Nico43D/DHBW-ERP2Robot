# DHBW-ERP2Robot – E-Commerce Webshop

Ein E-Commerce-Webshop basierend auf einem [Figma-Design](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design), umgesetzt mit React, TypeScript, Vite und Tailwind CSS. Das Backend kommuniziert über eine REST API mit iDempiere ERP.

## Voraussetzungen

Stelle sicher, dass folgende Software installiert ist:

- **Node.js** (Version 18 oder höher) – [Download](https://nodejs.org/)
- **npm** (wird mit Node.js mitgeliefert)
- **iDempiere** mit aktivierter REST API (für Backend-Funktionalität)

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

3. **Environment konfigurieren:**

   ```bash
   cp .env.example .env
   # Dann .env mit echten Werten füllen (iDempiere-URL, Passwort, JWT_SECRET)
   ```

## Starten

### Development (Frontend + Backend gleichzeitig)

```bash
npm start
```

Startet Frontend (Port 5173) und Backend (Port 3001) gleichzeitig mit `concurrently`.

### Einzeln starten

**Terminal 1 – Frontend (React Dev Server):**

```bash
npm run dev
```

Frontend läuft unter [http://localhost:5173](http://localhost:5173)

**Terminal 2 – Backend (Node.js API Server):**

```bash
npm run server
```

Backend läuft unter [http://localhost:3001](http://localhost:3001)

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
| React Router 7 | Routing |
| Radix UI | Barrierefreie UI-Komponenten |
| Node.js/Express | Backend REST API |
| JWT (httpOnly Cookies) | Authentifizierung |
| iDempiere REST API | ERP-Integration |

---

## Features

### Frontend

- **Shop & Katalog** – Produktübersicht aus iDempiere (Bilder, Preise, Bestand)
- **Warenkorb** – Add/Remove/Update mit localStorage Persistierung
- **Checkout** – Bestellprozess mit Zahlungsart-Auswahl
- **Authentication** – JWT-basierter Login & Registrierung
- **Benutzerkonto** – Dashboard, Bestellhistorie, Adressverwaltung
- **Demo-Modus** – Offline-Vorführmodus ohne Backend
- **Responsive Design** – Mobile-first für alle Geräte

### Backend

- **User Authentication** – Login/Register über iDempiere
- **6-Step Registration** – Automatische Erstellung von:
  - C_BPartner (Geschäftspartner)
  - C_Location (Adresse)
  - C_BPartner_Location (Verknüpfung)
  - AD_User (Login-Benutzer)
  - AD_User_Roles (Rollenzuweisung)
- **Order Management** – Bestellungen direkt in iDempiere erstellen und abschließen
- **Security** – Rate Limiting, CORS, httpOnly Cookies
- **Audit Logging** – Alle Login-, Registration- und Order-Events geloggt
- **Error Handling** – Strukturierte JSON-Fehlerresponses

### iDempiere Integration

- **Service Account Pattern** – Alle Backend-Zugriffe über GardenAdmin-Account
- **2-Schritt Auth** – Token + Context Selection für Service Account
- **REST API** – C_BPartner, C_Location, AD_User, C_Order, C_OrderLine
- **No Direct Database Access** – Nur über REST API

---

## Konfiguration

### Environment Variables (`.env`)

Erstelle eine `.env` Datei im Wurzelverzeichnis (siehe `.env.example` für alle Variablen):

```bash
# Server
PORT=3001

# iDempiere Connection
IDEMPIERE_BASE_URL=http://localhost:8080/api/v1
IDEMPIERE_USER=GardenAdmin
IDEMPIERE_PASSWORD=your-idempiere-password

# iDempiere Context Selection
IDEMPIERE_CLIENT_ID=11
IDEMPIERE_ROLE_ID=102
IDEMPIERE_ORG_ID=11
IDEMPIERE_WAREHOUSE_ID=1000000
IDEMPIERE_LANGUAGE=en_US

# Registration
IDEMPIERE_REGISTRATION_ROLE_ID=1000000

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

**Wichtig:**
- `JWT_SECRET` muss mindestens 32 Zeichen lang sein und kryptografisch zufällig
- `.env` sollte nicht in Git committed werden (ist in `.gitignore`)
- Alle iDempiere-Werte müssen für die jeweilige Installation korrekt gesetzt sein
- Siehe `.env.example` für alle verfügbaren Variablen (inkl. Order-Konfiguration)

---

## API Übersicht

Eine detaillierte API-Referenz mit JSON-Payloads ist in der [ARCHITECTURE.md](ARCHITECTURE.md) dokumentiert.

### Wichtige Endpoints

**Authentication:**
- `POST /api/auth/login` – Benutzer-Login
- `POST /api/auth/register` – Neue Registrierung (6-Schritt-Prozess)
- `POST /api/auth/logout` – Logout
- `GET /api/auth/me` – Session-Check

**Orders:**
- `POST /api/orders/create-and-complete` – Bestellung erstellen & abschließen

**Catalog:**
- `GET /api/catalog` – Produktkatalog aus iDempiere

**Health:**
- `GET /health` – Server-Status

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
│ Backend (Node/Express)  │ Port 3001
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

- **Login:** Frontend → Backend → iDempiere (Credentials-Check + User-Data laden)
- **Registration:** Frontend → Backend → iDempiere (6-Schritt-Prozess)
- **Order:** Frontend → Backend → iDempiere (Create Header + Lines + Complete)
- **Catalog:** Frontend → Backend → iDempiere (Produkte, Preise, Bestand, Bilder)

Siehe [ARCHITECTURE.md: Datenflüsse](ARCHITECTURE.md#datenflüsse) für detaillierte Sequence-Diagramme.

---

## Troubleshooting

### Backend startet nicht

```
Error: ENOENT: no such file or directory, open '.env'
```

**Lösung:** `.env` Datei erstellen:

```bash
cp .env.example .env
# Dann .env mit echten Werten füllen
```

### iDempiere Connection Error

```
Error: Failed to connect to iDempiere
```

**Überprüfen:**
1. iDempiere läuft unter der in `IDEMPIERE_BASE_URL` konfigurierten Adresse?
2. Service Account existiert und Passwort korrekt?
3. Netzwerk erlaubt Verbindung Backend → iDempiere?

Test mit:

```bash
curl -X POST $IDEMPIERE_BASE_URL/auth/tokens \
  -H "Content-Type: application/json" \
  -d '{"userName":"GardenAdmin","password":"your-password"}'
```

### JWT Token Issues

**Fehler: "Session abgelaufen"**

- Token ist älter als 7 Tage
- `JWT_SECRET` wurde geändert seit dem Login
- Behebung: Browser-Cookies löschen → neu einloggen

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Überprüfen:**
1. Backend läuft auf Port 3001?
2. Frontend URL ist in der CORS-Konfiguration (`server/index.js`) eingetragen?

Default (Development):
```
origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
```

---

## Development Guide

### Code-Stil

- **TypeScript** – Strikte Typisierung
- **React Hooks** – Keine Class Components
- **Tailwind** – Keine Custom CSS (außer in `styles/`)
- **ESM** – `"type": "module"` in package.json

### Branches

- `main` – Production (merge via PR)
- `dev` – Development (default branch)
- `feature/*` – Feature Branches

---

## Deployment

### Frontend Build

```bash
npm run build
```

Output: `dist/` Ordner – auf Apache, Nginx oder S3 deployen.

**Wichtig für SPA:** Fallback auf `index.html` konfigurieren (z.B. Apache `FallbackResource /index.html`).

### Backend Deployment

Mit PM2:

```bash
npm install -g pm2
pm2 start server/index.js --name "duale-api"
pm2 save
pm2 startup
```

---

## Lizenz & Credits

- **UI:** [shadcn/ui](https://ui.shadcn.com/) (MIT License)
- **Icons:** [Lucide React](https://lucide.dev/) (ISC License)
- **Design:** [Figma Prototype](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design)
- **Backend:** Express.js, JWT, iDempiere REST API
