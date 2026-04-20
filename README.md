# DHBW-ERP2Robot – E-Commerce Webshop

Ein E-Commerce-Webshop (SPA) mit React, TypeScript, Vite und Tailwind CSS. Das Node.js/Express-Backend kommuniziert ueber eine REST API mit iDempiere ERP.

> Ausfuehrliche Architektur, Datenfluss-Diagramme und API-Referenz: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Voraussetzungen

- **Node.js 18+** – [Download](https://nodejs.org/)
- **npm** (mit Node.js mitgeliefert)
- **iDempiere** mit aktivierter REST API

```bash
node --version   # >= 18
npm --version
```

---

## Lokale Entwicklung

### 1. Setup

```bash
git clone <repository-url>
cd DHBW-ERP2Robot
npm install
cp .env.example .env
# .env mit echten Werten fuellen (siehe Abschnitt Konfiguration)
```

### 2. Starten (Frontend + Backend gleichzeitig)

```bash
npm start
```

Startet mit `concurrently`:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001

### 3. Einzeln starten

```bash
# Terminal 1 – Frontend
npm run dev

# Terminal 2 – Backend
npm run server
```

### 4. Testen

1. http://localhost:5173 oeffnen
2. Registrieren oder einloggen
3. Produkte in den Warenkorb legen und bestellen

---

## Deployment (Produktion)

### Frontend bauen

```bash
npm run build
```

Erzeugt optimierte Dateien im `dist/`-Ordner.

### Apache-Konfiguration (Beispiel)

```apache
<VirtualHost *:80>
    ServerName dualsweets.example.com
    DocumentRoot /var/www/dualsweets/dist

    # SPA-Routing: alle Pfade auf index.html
    <Directory /var/www/dualsweets/dist>
        FallbackResource /index.html
    </Directory>

    # API-Requests an Backend weiterleiten
    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:3001/api
    ProxyPassReverse /api http://127.0.0.1:3001/api
    ProxyPass /health http://127.0.0.1:3001/health
    ProxyPassReverse /health http://127.0.0.1:3001/health
</VirtualHost>
```

Benoetigte Apache-Module: `mod_proxy`, `mod_proxy_http`, `mod_rewrite`.

```bash
sudo a2enmod proxy proxy_http rewrite
sudo systemctl restart apache2
```

### Backend mit PM2

```bash
# Starten
cd /var/www/dualsweets
pm2 start server/index.js --name erp2robot

# Prozessliste speichern (fuer Autostart)
pm2 save

# Autostart bei Reboot einrichten (einmalig)
pm2 startup systemd
# Den ausgegebenen sudo-Befehl ausfuehren, dann:
pm2 save
```

### Checkliste Produktion

- [ ] `.env` mit echten Credentials (nicht `.env.example`)
- [ ] `JWT_SECRET`: min. 32 Zeichen, kryptografisch zufaellig
- [ ] CORS-Origins in `server/index.js` auf Produktions-Domain aendern
- [ ] Cookie `secure: true` setzen wenn HTTPS aktiv
- [ ] iDempiere REST API vom Server erreichbar
- [ ] Apache/Nginx: Proxy auf Backend-Port, SPA-Fallback auf `index.html`

---

## Konfiguration (.env)

Erstelle `.env` im Wurzelverzeichnis. Siehe `.env.example` fuer die vollstaendige kommentierte Vorlage.

### Pflicht (Demo + normaler Betrieb)

```bash
IDEMPIERE_BASE_URL=http://localhost:8080/api/v1
IDEMPIERE_USER=GardenAdmin
IDEMPIERE_PASSWORD=your-idempiere-password
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

### Optional (haben Code-Defaults)

Alle weiteren Variablen haben sinnvolle Defaults in `server/config.js` und muessen nur gesetzt werden, wenn man vom Default abweichen will:

| Variable | Default | Zweck |
|---|---|---|
| `PORT` | 3001 | Backend-Port |
| `IDEMPIERE_CLIENT_ID` | 11 | iDempiere Mandant (GardenWorld) |
| `IDEMPIERE_ROLE_ID` | 102 | iDempiere Rolle fuer Admin-Token |
| `IDEMPIERE_ORG_ID` | 11 | Organisation |
| `IDEMPIERE_WAREHOUSE_ID` | 1000000 | Lager-ID (fuer Orders) |
| `IDEMPIERE_LANGUAGE` | en_US | Sprache |
| `IDEMPIERE_PRODUCT_CATEGORY_ID` | 1000000 | Katalogfilter |
| `IDEMPIERE_PRICE_LIST_VERSION_ID` | 104 | Preisliste |
| `IDEMPIERE_REGISTRATION_ROLE_ID` | 1000000 | Rolle fuer neue User |

Bestell-Defaults und Demo-spezifische Variablen sind in `.env.example` dokumentiert.

**Wichtig:**
- `.env` ist in `.gitignore` und darf nicht committed werden
- Alle iDempiere-IDs muessen zur jeweiligen Installation passen

Fuer API-Referenz, Architektur und Troubleshooting: [ARCHITECTURE.md](ARCHITECTURE.md)

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
