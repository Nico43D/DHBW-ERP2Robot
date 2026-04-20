# Projektarchitektur – DHBW-ERP2Robot

Dieses Dokument beschreibt die Architektur des E-Commerce-Webshops „Duale Süßigkeiten". Die Anwendung ist eine Single-Page-Application (SPA), die mit React, TypeScript und Vite umgesetzt wurde und mit einem Node.js/Express Backend und iDempiere ERP kommuniziert.

---

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Ordnerstruktur](#ordnerstruktur)
3. [Technologie-Stack](#technologie-stack)
4. [Frontend-Architektur](#frontend-architektur)
5. [Backend-Architektur](#backend-architektur)
6. [API-Referenz: Frontend ↔ Backend](#api-referenz-frontend--backend)
7. [API-Referenz: Backend ↔ iDempiere](#api-referenz-backend--idempiere)
8. [Datenflüsse](#datenflüsse)
9. [Authentication & Security](#authentication--security)
10. [Fehlerbehandlung](#fehlerbehandlung)
11. [Audit Logging](#audit-logging)
12. [Konfiguration](#konfiguration)
13. [Deployment Notes](#deployment-notes)
14. [Security Checklist](#security-checklist)

---

## Übersicht

Die Architektur folgt einem **3-Schichten-Modell**:

```
┌─────────────────────────────────────────┐
│         Frontend (React/TypeScript)     │  Port 5173 (Dev)
│      - SPA mit React Router             │
│      - Context API für State Mgmt       │  Browser-basiert
│      - Tailwind CSS für Styling         │
└────────────────────┬────────────────────┘
                     │ HTTP/REST
                     │ (JSON Payloads)
                     ▼
┌─────────────────────────────────────────┐
│     Backend (Node.js/Express)           │  Port 3001 (Default)
│    - REST API Endpoints                 │
│    - JWT Authentication                 │
│    - Rate Limiting & Security           │  .env konfiguriert
│    - Audit Logging                      │
│    - iDempiere Client                   │
└────────────────────┬────────────────────┘
                     │ HTTP/REST
                     │ (iDempiere REST API)
                     ▼
┌─────────────────────────────────────────┐
│      iDempiere (ERP System)             │  Port 8080 (oder custom)
│    - Business Partner Management        │
│    - Order Management                   │
│    - Inventory & Warehouse              │
│    - User & Authentication              │
└─────────────────────────────────────────┘
```

---

## Ordnerstruktur

### Frontend (`src/`)

```
src/
├── main.tsx                  # Einstiegspunkt – rendert <App /> in #root
├── assets/                   # Bilder (Produktfotos)
├── styles/                   # Globale Styles
│   ├── index.css             #   CSS-Einstieg
│   ├── tailwind.css          #   Tailwind-Konfiguration
│   ├── theme.css             #   Farben, Design-Tokens
│   └── fonts.css             #   Schriftarten
│
└── app/
    ├── App.tsx               # Root-Komponente (AuthProvider → CartProvider → Router)
    ├── routes.ts             # Alle Routen (React Router v7)
    │
    ├── components/           # Wiederverwendbare Komponenten
    │   ├── Layout.tsx        #   Seiten-Shell: Header → Inhalt → Footer
    │   ├── Header.tsx        #   Navigation, Logo, Warenkorb-Icon
    │   ├── Footer.tsx        #   Footer mit Links
    │   ├── ProductCard.tsx   #   Produktkarte für Shop-Übersicht
    │   ├── QuantityStepper.tsx    #  +/- Mengenauswahl
    │   ├── Button.tsx        #   Custom Button
    │   ├── Card.tsx          #   Custom Card
    │   ├── Badge.tsx         #   Custom Badge
    │   ├── Input.tsx         #   Custom Input
    │   ├── figma/            #   Figma-spezifische Helfer
    │   └── ui/               #   shadcn/ui Primitives (40+ Komponenten)
    │
    ├── contexts/             # React Context für globalen State
    │   ├── AuthContext.tsx    #   Benutzer, Login, Registrierung, isLoading
    │   └── CartContext.tsx    #   Warenkorb (add, remove, update, clear)
    │
    ├── services/
    │   └── api.ts            # API-Client (fetchCatalog, createOrder)
    │
    ├── pages/                # 21 Seiten-Komponenten
    │   ├── Home.tsx          #   Startseite
    │   ├── Shop.tsx          #   Produktübersicht (Produkte aus API)
    │   ├── ProductDetail.tsx #   Produktdetailseite
    │   ├── Cart.tsx          #   Warenkorb
    │   ├── Checkout.tsx      #   Bestellvorgang
    │   ├── OrderConfirmation.tsx # Bestellbestätigung
    │   ├── Orders.tsx        #   Bestellhistorie
    │   ├── OrderDetail.tsx   #   Einzelne Bestellung
    │   ├── Login.tsx         #   Anmeldung
    │   ├── Register.tsx      #   Registrierung
    │   ├── Dashboard.tsx     #   Benutzerkonto
    │   ├── AddressManagement.tsx # Adressverwaltung
    │   └── [weitere Seiten]  #   AGB, Datenschutz, FAQ, etc.
    │
    └── utils/
        └── cn.ts             # Tailwind className-Merge Hilfsfunktion
```

### Backend (`server/`)

```
server/
├── index.js                  # Express App Startdatei
├── config.js                 # Umgebungsvariablen & Konfiguration
├── idempiere/
│   ├── client.js             # HTTP-Client für iDempiere REST API
│   ├── auth.js               # Service Account Authentication (2-Schritt)
│   └── models/               # iDempiere REST API Models (als Referenz)
│
├── routes/                   # API Endpoints (Express Router)
│   ├── auth.js               # POST /api/auth/login, /register, /logout, GET /api/auth/me
│   ├── orders.js             # POST /api/orders/create-and-complete
│   ├── catalog.js            # GET /api/catalog
│   ├── bankAccount.js        # GET /api/bank-account
│   └── health.js             # GET /health
│
├── services/                 # Business Logic Layer
│   ├── authService.js        # Benutzer-Authentifizierung über iDempiere
│   ├── registrationService.js # 6-Schritt Registrierungsprozess
│   ├── orderService.js       # Order Creation & Completion
│   ├── auditService.js       # Audit Logging
│   ├── catalogService.js     # Produktkatalog (aus iDempiere)
│   └── bankAccountService.js # Kreditkarten-Bankdaten (C_BP_BankAccount)
│
├── middleware/
│   └── security.js           # Rate Limiting, Authorization, Error Handlers
│
└── logs/                     # Audit-Logs (JSON-Dateien)
    └── audit.log             # NDJSON Audit-Einträge
```

---

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| **Frontend** | | |
| React | 18.3 | UI-Framework (Komponentenbasiert) |
| TypeScript | 5.x | Statische Typisierung für JavaScript |
| Vite | 6.3 | Build-Tool & Entwicklungsserver mit HMR |
| Tailwind CSS | 4.1 | Utility-First CSS-Framework |
| React Router | 7.13 | Client-Side Routing (SPA-Navigation) |
| shadcn/ui + Radix UI | – | Barrierefreie, anpassbare UI-Primitives |
| **Backend** | | |
| Node.js | 18+ | JavaScript Runtime (ESM) |
| Express | 4.x | Web Framework & HTTP Server |
| jsonwebtoken | – | JSON Web Token Authentication |
| cookie-parser | – | HTTP Cookie Parsing |
| cors | – | Cross-Origin Resource Sharing |
| express-rate-limit | – | API Rate Limiting |
| **Integration** | | |
| iDempiere REST API | – | ERP System Communication |

---

## Frontend-Architektur

### Komponentenhierarchie

```
main.tsx
└── <App />
    ├── <AuthProvider>        ← Globaler Benutzer-State + isLoading
    │   └── <CartProvider>    ← Globaler Warenkorb-State
    │       └── <RouterProvider>
    │           └── <Layout>
    │               ├── <Header />    ← Navigation, Logo, Warenkorb-Badge, Login/Logout
    │               ├── <Outlet />    ← Aktive Seite (React Router)
    │               └── <Footer />    ← Footer-Links (Kundenservice, Rechtliches)
```

### Routing

| Pfad | Seite | Beschreibung | Auth Required |
|---|---|---|---|
| `/` | Home | Startseite mit Hero, Features, Produktvorschau | Nein |
| `/shop` | Shop | Produktübersicht (Produkte aus iDempiere API) | Nein |
| `/products/:id` | ProductDetail | Detailseite eines einzelnen Produkts | Nein |
| `/cart` | Cart | Warenkorb-Ansicht | Nein |
| `/checkout` | Checkout | Bestellvorgang (Adresse, Zahlung) | Ja |
| `/order-confirmation/:orderNumber` | OrderConfirmation | Bestellbestätigung | Ja |
| `/login` | Login | Anmeldeformular | Nein |
| `/register` | Register | Registrierungsformular | Nein |
| `/dashboard` | Dashboard | Benutzer-Dashboard | Ja |
| `/orders` | Orders | Bestellhistorie | Ja |
| `/orders/:orderNumber` | OrderDetail | Einzelne Bestellung | Ja |
| `/account/addresses` | AddressManagement | Adressverwaltung | Ja |
| `/kontakt` | Kontakt | Kontaktseite | Nein |
| `/versand-lieferung` | VersandLieferung | Versand und Lieferung | Nein |
| `/rueckgabe-umtausch` | RueckgabeUmtausch | Rückgabe und Umtausch | Nein |
| `/faq` | FAQ | Häufig gestellte Fragen | Nein |
| `/agb` | AGB | Allgemeine Geschäftsbedingungen | Nein |
| `/datenschutz` | Datenschutz | Datenschutzerklärung | Nein |
| `/impressum` | Impressum | Impressum | Nein |
| `/widerrufsrecht` | Widerrufsrecht | Widerrufsbelehrung | Nein |
| `*` | NotFound | 404-Fehlerseite | Nein |

Route-Guards sind nicht auf Router-Ebene implementiert. Geschützte Seiten prüfen `isAuthenticated` und `isLoading` in der Komponente selbst und leiten ggf. zu `/login` weiter.

### State Management

#### AuthContext

Verwaltet globalen Authentifizierungs-State.

**Interfaces:**

```typescript
interface Address {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  customerType: 'private' | 'company';
  company?: string;
  billingAddress: Address;
  deliveryAddress: Address;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  customerType: 'private' | 'company';
  company?: string;
  billingAddress: Address;
  deliveryAddress: Address;
}
```

**Hinweis:** Die Backend-spezifischen Felder `businessPartnerId`, `bpLocationId` und `contactId` sind nur im JWT-Payload auf dem Backend vorhanden, nicht im Frontend `User` Interface.

**Bereitgestellte Funktionen:**

| Funktion | Beschreibung |
|---|---|
| `user` | Aktueller Benutzer oder `null` |
| `isAuthenticated` | Boolean – `!!user` |
| `isLoading` | Boolean – wird gerade die Session via `/api/auth/me` validiert? |
| `isSimplifiedMode` | Boolean – Demo-Modus ohne Backend aktiv? |
| `toggleSimplifiedMode()` | Wechselt zwischen Demo- und ERP-Modus |
| `login(email, password)` | Authentifiziert den Benutzer über `POST /api/auth/login` |
| `register(data)` | Registriert über `POST /api/auth/register` |
| `updateAddresses(billing, delivery)` | Aktualisiert Adressen (nur lokal, kein Backend-Call) |
| `logout()` | Meldet ab via `POST /api/auth/logout` |

**Persistenz:** JWT wird in httpOnly Cookie gespeichert. Benutzer wird beim Page-Load via `GET /api/auth/me` wiederhergestellt. Wenn `isLoading` noch `true` ist, zeigen geschützte Seiten einen Ladeindikator statt zur Login-Seite weiterzuleiten.

**Simplified Mode (Demo-Modus):**

Ein Offline-Demo-Modus für Vorführungen ohne Backend-Anbindung. Wird über `localStorage` Key `simplified-mode` persistiert. Im Demo-Modus:
- `login()` gibt sofort `true` zurück (kein API-Call)
- `register()` gibt sofort `{ success: true }` zurück
- Der User wird auf einen `DEMO_USER` gesetzt (id: `demo-user`, email: `demo@duale-suessigkeiten.de`)
- Bestellungen werden unter `duale-demo-orders` in localStorage gespeichert

#### CartContext

Verwaltet globalen Warenkorb-State.

```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
```

| Funktion | Beschreibung |
|---|---|
| `items` | Array aller Warenkorb-Artikel |
| `totalItems` | Gesamtanzahl aller Artikel |
| `totalPrice` | Gesamtpreis des Warenkorbs |
| `addToCart(product, quantity)` | Fügt Produkt hinzu (erhöht Menge bei Duplikat) |
| `removeFromCart(productId)` | Entfernt ein Produkt |
| `updateQuantity(productId, quantity)` | Ändert die Menge (entfernt bei ≤ 0) |
| `clearCart()` | Leert den gesamten Warenkorb |

**Persistenz:** Der Warenkorb wird in `localStorage` unter dem Key `duale-cart` gespeichert. Kein Backend-Call -- rein clientseitig.

### API-Client (`services/api.ts`)

Zentraler API-Client für Frontend-Backend-Kommunikation:

```typescript
interface ApiProduct {
  id: string;
  name: string;
  description: string;
  searchKey: string;
  price: number;
  stock: number;
  image: string;       // Base64 Data-URL oder leer
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  searchKey?: string;
}
```

**Funktionen:**

| Funktion | API-Call | Beschreibung |
|---|---|---|
| `fetchCatalog()` | `GET /api/catalog` | Lädt Produktkatalog aus iDempiere |
| `createOrder(orderData)` | `POST /api/orders/create-and-complete` | Erstellt Bestellung |
| `mapApiProductToProduct(p)` | – | Mapped API-Response auf Frontend-Product |

---

## Backend-Architektur

### Startup & Middleware-Stack

**`server/index.js`:**

```javascript
app.use(cors({ origin: [...], credentials: true }));    // CORS für Frontend
app.use(express.json({ limit: '2mb' }));                // JSON Parser
app.use(cookieParser());                                // Cookie Parser
app.use('/api', apiRateLimiter);                        // Rate Limiting (alle /api Routen)
app.use(healthRoutes);                                  // GET /health (kein /api Prefix)
app.use('/api', authRoutes);                            // Auth Endpoints
app.use('/api', catalogRoutes);                         // Catalog Endpoints
app.use('/api', orderRoutes);                           // Order Endpoints
app.use('/api', bankAccountRoutes);                     // Bank Account Endpoints
```

### Request Flow

```
Frontend HTTP Request
    ↓
Express Middleware (CORS, JSON Parser, Cookies)
    ↓
Rate Limiter Middleware (auf /api Routen)
    ↓
Route Handler (req, res)
    ↓
[Optional: requireAuth → authorize() Middleware]
    ↓
Service Layer (Business Logic)
    ├─→ iDempiere Client → iDempiere REST API
    └─→ Audit Service → audit.log
    ↓
Response (JSON + ggf. Set-Cookie)
```

---

## API-Referenz: Frontend ↔ Backend

### Authentication Endpoints

#### `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "user": {
    "id": "1000023",
    "email": "user@example.com",
    "firstName": "Max",
    "lastName": "Mustermann",
    "customerType": "private",
    "company": null,
    "billingAddress": {
      "street": "Musterstraße",
      "houseNumber": "42",
      "zipCode": "70173",
      "city": "Stuttgart",
      "country": "Deutschland"
    },
    "deliveryAddress": {
      "street": "Musterstraße",
      "houseNumber": "42",
      "zipCode": "70173",
      "city": "Stuttgart",
      "country": "Deutschland"
    }
  }
}
```

**Hinweis:** `billingAddress` und `deliveryAddress` sind derzeit immer identisch, da nur eine C_Location pro BPartner geladen wird.

**Cookie gesetzt:**

```
Set-Cookie: auth_token=<JWT>; HttpOnly; Secure=false; SameSite=Lax; Max-Age=604800000
```

**Fehler:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Fehlende Felder | `"Email und Passwort sind erforderlich"` |
| 401 | Falsche Credentials | `"Ungültige Email oder Passwort"` |
| 429 | Rate Limited | nach 5 Versuchen in 15 Min (nur fehlgeschlagene zählen) |
| 500 | Server Error | `"Serverfehler bei der Anmeldung"` |

---

#### `POST /api/auth/register`

**Request:**

```json
{
  "email": "new@example.com",
  "password": "password123",
  "firstName": "Anna",
  "lastName": "Schmidt",
  "customerType": "private",
  "company": null,
  "billingAddress": {
    "street": "Leipziger Str.",
    "houseNumber": "15",
    "zipCode": "10115",
    "city": "Berlin",
    "country": "Deutschland"
  },
  "deliveryAddress": {
    "street": "Leipziger Str.",
    "houseNumber": "15",
    "zipCode": "10115",
    "city": "Berlin",
    "country": "Deutschland"
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "user": {
    "id": "1000024",
    "email": "new@example.com",
    "firstName": "Anna",
    "lastName": "Schmidt",
    "customerType": "private",
    "company": null,
    "billingAddress": { "..." },
    "deliveryAddress": { "..." }
  }
}
```

**Registrierungsprozess (6 Schritte im Backend):**

1. **Duplicate Check** – Prüfe ob Email bereits existiert (AD_User.EMail und C_BPartner.Value)
2. **Create Location** – Erstelle C_Location mit Adressdaten (oder verwende existierende)
3. **Create BusinessPartner** – Erstelle C_BPartner mit Value=Email
4. **Create BPartner Location** – Erstelle C_BPartner_Location mit Name=Stadtname
5. **Create User** – Erstelle AD_User mit Name=Email für Login
6. **Assign Role** – Weise Standard-Role zu (Rollenzuweisung ist nicht-fatal -- schlägt sie fehl, wird trotzdem registriert)

**Fehler:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Fehlende Felder | `"Vor- und Nachname sind erforderlich"` |
| 409 | Email existiert | `"Diese Email ist bereits registriert"` |
| 429 | Rate Limited | nach 5 Versuchen in 15 Min |
| 500 | Server Error | `"Serverfehler bei der Registrierung"` |

---

#### `POST /api/auth/logout`

**Request:** kein Body

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Erfolgreich abgemeldet"
}
```

**Cookie gelöscht:**

```
Set-Cookie: auth_token=; Max-Age=0
```

---

#### `GET /api/auth/me`

**Zweck:** Session-Validierung nach Page-Reload. Wird vom Frontend beim App-Load automatisch aufgerufen.

**Request:** kein Body (JWT aus Cookie wird gelesen)

**Response (200 OK):**

```json
{
  "user": {
    "id": "1000023",
    "email": "user@example.com",
    "firstName": "Max",
    "lastName": "Mustermann",
    "customerType": "private",
    "company": null,
    "billingAddress": { "..." },
    "deliveryAddress": { "..." }
  }
}
```

**Fehler:**

| Code | Fehler |
|------|--------|
| 401 | Nicht authentifiziert (kein Cookie oder Token ungültig) |

---

### Order Endpoints

#### `POST /api/orders/create-and-complete`

**Middleware-Kette:**
1. `requireAuth` – JWT aus Cookie prüfen
2. `authorize()` – Prüft ob `req.user` existiert
3. `orderRateLimiter` – Max 10 Bestellungen pro Stunde (pro User)

**Request (vom Frontend gesendet):**

```json
{
  "lines": [
    {
      "M_Product_ID": 1000001,
      "QtyOrdered": 2
    },
    {
      "M_Product_ID": 1000002,
      "QtyOrdered": 1
    }
  ],
  "POReference": "WebShop-1711953000123"
}
```

**Hinweis:** Das Frontend sendet nur `M_Product_ID` und `QtyOrdered` pro Zeile. `C_UOM_ID` wird vom Backend mit Default 100 (Each) gesetzt. Datum-Felder werden automatisch auf heute gesetzt.

**Response (200 OK):**

```json
{
  "id": 1000015,
  "DocumentNo": "SO-0001",
  "C_Order_ID": 1000015,
  "DocStatus": "CO",
  "GrandTotal": 50.00
}
```

**Fehler:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Ungültige Payload | `"Order payload requires non-empty lines array"` |
| 401 | Nicht authentifiziert | kein Cookie |
| 429 | Rate Limited | 10 Orders pro Stunde |
| 500 | iDempiere Error | `"Order create failed: ..."` |

---

### Catalog Endpoints

#### `GET /api/catalog`

**Request:** kein Body, keine Auth erforderlich (öffentlich)

**Response (200 OK):**

```json
[
  {
    "id": "1000001",
    "name": "Knoppers",
    "description": "Knackig, knusprig, köstlich",
    "documentNote": "<b>Zutaten:</b><br/>Weizen, Zucker, ...<br/><b>Allergene:</b> ...",
    "searchKey": "knoppers-01",
    "price": 2.99,
    "stock": 150,
    "image": "data:image/jpeg;base64,/9j/4AAQ..."
  }
]
```

**Feld-Zuordnung (iDempiere → Frontend):**

| iDempiere Feld | API Feld | Verwendung im Frontend |
|---|---|---|
| `Name` | `name` | Produktname (Überschrift überall) |
| `Description` | `description` | Produktbeschreibung (Detailseite) |
| `DocumentNote` | `documentNote` | Inhaltsstoffe & Allergene (Detailseite, HTML erlaubt) |
| `Value` | `searchKey` | Such-Schlüssel |

**DocumentNote HTML-Konventionen:** Das Feld unterstützt HTML-Formatierung. Allergene werden per `<u>` hervorgehoben (Lebensmittelkennzeichnung). Beispiel:

```html
<b>Zutaten:</b><br/>
Haselnüsse (26,5%), Milchschokolade, Palmöl, Molkenpulver
<br/><br/>
<b>Allergene:</b> Enthält <u>Milch</u>, <u>Schalenfrüchte</u> und <u>Soja</u>.
<br/><br/>
<b>Nährwerte (pro 100g)</b>
<ul>
<li>Energie: 2614 kJ / 630 kcal</li>
<li>Fett: 47,3 g</li>
</ul>
```

**Datenquelle:** Produkte werden live aus iDempiere geladen (4 Queries: m_product, m_productprice, m_storageonhand, Attachments). Bilder werden als Base64 Data-URLs geliefert. Es gibt keine statische `products.ts` Datei.

---

### Health Check

#### `GET /health`

**Hinweis:** Kein `/api` Prefix, daher nicht rate-limited.

**Response (200 OK):**

```json
{
  "ok": true
}
```

---

### Bank Account Endpoints

#### `GET /api/bank-account`

**Auth:** `requireAuth` (JWT Cookie erforderlich)

Lädt gespeicherte Kreditkartendaten des eingeloggten Business Partners aus iDempiere (`C_BP_BankAccount` mit `IsACH = false`).

**Response (200 OK) – Karte vorhanden:**

```json
{
  "exists": true,
  "cardHolder": "Tim Tester",
  "cardNumber": "**** **** **** 1111",
  "cardNumberRaw": "0000000000001111",
  "expiryDate": "12/26",
  "cvc": "000",
  "creditCardType": "V"
}
```

**Response (200 OK) – Keine Karte:**

```json
{
  "exists": false
}
```

**Hinweise:**
- `cardNumber` ist die vom Backend maskierte Darstellung (Sternchen + letzte 4 Ziffern)
- `cardNumberRaw` enthält die iDempiere-maskierte Version (Nullen + letzte 4 Ziffern)
- `cvc` wird von iDempiere immer als `"000"` zurückgegeben (Sicherheitsfeature)
- `creditCardType`: `V` = Visa, `M` = MasterCard, `A` = Amex, `D` = Discover

**Service:** `bankAccountService.js → getBPBankAccount(businessPartnerId)`

#### Kreditkarte anlegen/aktualisieren (via Order)

Kreditkartendaten werden **nicht** über einen eigenen Endpoint gespeichert, sondern als Teil des Order-Prozesses in `POST /api/orders/create-and-complete`. Wenn `paymentMethod === 'kreditkarte'` und `creditCard`-Daten im Payload enthalten sind, wird `createOrUpdateBPBankAccount()` aufgerufen (nach Orderline-Erstellung, vor Order-Completion).

Wird die Karte im Checkout nicht bearbeitet (Kachel-Ansicht), werden keine `creditCard`-Daten mitgesendet und der bestehende `C_BP_BankAccount`-Eintrag bleibt unverändert.

---

## API-Referenz: Backend ↔ iDempiere

### Service Account Authentication (2-Schritt)

Das Backend verwendet einen **Service Account (GardenAdmin)** für alle iDempiere-Zugriffe. Die Authentifizierung ist ein 2-Schritt-Prozess:

**Implementierung:** `server/idempiere/auth.js`

```
Backend benötigt Daten
    ↓
authenticate() → Gecachter Token vorhanden & noch gültig? (< 20 Min)
    ├─→ JA → Token verwenden
    └─→ NEIN →
        Schritt 1: POST /auth/tokens
            Body: { userName: "GardenAdmin", password: "..." }
            Response: { token: "<temp-token>" }

        Schritt 2: PUT /auth/tokens
            Header: Authorization: Bearer <temp-token>
            Body: { clientId, roleId, organizationId, warehouseId, language }
            Response: { token: "<context-token>" }

        → context-token cachen (TTL: 20 Minuten)
    ↓
idempiereFetch(path, options)
    ├─→ Setzt: Authorization: Bearer <context-token>
    ├─→ Setzt: Content-Type: application/json
    ├─→ Führt HTTP Request gegen iDempiere aus
    └─→ Bei 401 → Token invalidieren (nächster Request holt neuen)
```

**Base URL:** Konfiguriert über `IDEMPIERE_BASE_URL` (z.B. `http://localhost:8080/api/v1`)

**Headers für alle iDempiere Requests:**

```
Content-Type: application/json
Authorization: Bearer <context-token>
```

---

### User Authentication (für Login-Validierung)

**POST `/auth/tokens`**

Für die Login-Validierung eines Endnutzers. Das Backend sendet die User-Credentials direkt an iDempiere:

```json
{
  "userName": "user@example.com",
  "password": "userpassword"
}
```

- Response-Status 200 = Credentials gültig
- Response-Status 401 = Credentials ungültig

Dieses Token wird **nicht weiter verwendet** -- es dient nur zur Validierung. Danach werden die User-Daten mit dem GardenAdmin-Token geladen.

---

### BusinessPartner Management

**GET `/models/c_bpartner?$filter=Value eq '{email}'`**

Suche BusinessPartner nach Value (= Email bei Webshop-Kunden):

```json
{
  "records": [
    {
      "id": 1000023,
      "Value": "user@example.com",
      "Name": "Max Mustermann"
    }
  ]
}
```

**POST `/models/c_bpartner`**

Erstellt neuen BusinessPartner bei Registrierung:

```json
{
  "AD_Org_ID": { "id": 11 },
  "Value": "new@example.com",
  "Name": "Anna Schmidt",
  "IsCustomer": true,
  "IsVendor": false,
  "IsEmployee": false,
  "IsSalesRep": false
}
```

Bei Firmenkunden wird zusätzlich `Name2` mit dem vollen Namen gesetzt und `Name` enthält den Firmennamen.

---

### Location Management

**POST `/models/c_location`**

Erstellt eine Adresse:

```json
{
  "Address1": "Leipziger Str.",
  "Address2": "15",
  "Postal": "10115",
  "City": "Berlin",
  "C_Country_ID": { "id": 101 }
}
```

`C_Country_ID: 101` = Deutschland. `Address1` = Straße, `Address2` = Hausnummer.

---

### BusinessPartner Location

**WICHTIG:** `C_BPartner_Location_ID` (die `id` aus dieser Tabelle) wird in Orders verwendet, **nicht** `C_Location_ID`!

**POST `/models/c_bpartner_location`**

Verknüpft einen BPartner mit einer Location:

```json
{
  "C_BPartner_ID": { "id": 1000023 },
  "C_Location_ID": { "id": 1000100 },
  "Name": "Berlin",
  "IsBillTo": true,
  "IsShipTo": true,
  "IsPayFrom": true,
  "IsRemitTo": true
}
```

`Name` wird auf den Stadtnamen gesetzt (nicht "Standard").

---

### AD_User Management

**GET `/models/ad_user?$filter=EMail eq '{email}'`**

Suche User per Email:

```json
{
  "records": [
    {
      "id": 1000021,
      "Name": "user@example.com",
      "EMail": "user@example.com",
      "C_BPartner_ID": { "id": 1000023 },
      "C_BPartner_Location_ID": { "id": 1000050 }
    }
  ]
}
```

**POST `/models/ad_user`**

Erstellt Login-User:

```json
{
  "AD_Org_ID": { "id": 11 },
  "Name": "new@example.com",
  "EMail": "new@example.com",
  "Password": "userpassword",
  "C_BPartner_ID": { "id": 1000024 },
  "C_BPartner_Location_ID": { "id": 1000050 },
  "IsActive": true,
  "Description": "Anna Schmidt"
}
```

**Wichtig:** `Name = Email` -- dies ist der Login-Name in iDempiere. `Description` speichert den realen Namen.

---

### User Role Assignment

**POST `/models/ad_user_roles`**

```json
{
  "AD_User_ID": { "id": 1000022 },
  "AD_Role_ID": { "id": 1000000 },
  "AD_Org_ID": { "id": 11 }
}
```

---

### Order Management

**POST `/models/c_order`**

Erstellt den Auftragskopf:

```json
{
  "IsSOTrx": true,
  "IsSelfService": true,
  "AD_Org_ID": { "id": 11 },
  "C_DocTypeTarget_ID": { "id": 133 },
  "DateOrdered": "2026-03-30",
  "DatePromised": "2026-03-30",
  "DateAcct": "2026-03-30",
  "C_BPartner_ID": { "id": 1000023 },
  "C_BPartner_Location_ID": { "id": 1000050 },
  "AD_User_ID": { "id": 1000021 },
  "Bill_BPartner_ID": { "id": 1000023 },
  "Bill_Location_ID": { "id": 1000050 },
  "Bill_User_ID": { "id": 1000021 },
  "SalesRep_ID": { "id": 101 },
  "C_PaymentTerm_ID": { "id": 105 },
  "M_Warehouse_ID": { "id": 1000000 },
  "M_PriceList_ID": { "id": 101 },
  "M_Shipper_ID": { "id": 100 },
  "PaymentRule": { "id": "P" },
  "DeliveryViaRule": { "id": "S" },
  "POReference": "WebShop-1711953000123"
}
```

**Feldzuordnung:**
- `C_BPartner_ID`, `C_BPartner_Location_ID`, `AD_User_ID` = aus JWT (eingeloggter User)
- `Bill_*` = identisch mit den Hauptfeldern
- Alle anderen Felder = aus `ORDER_CONFIG` / `AUTH_CONFIG` in `server/config.js`

---

**POST `/models/c_orderline`**

Erstellt eine Auftragszeile:

```json
{
  "C_Order_ID": { "id": 1000015 },
  "Line": 10,
  "M_Product_ID": { "id": 1000001 },
  "QtyOrdered": 2,
  "QtyEntered": 2,
  "C_UOM_ID": { "id": 100 },
  "M_Warehouse_ID": { "id": 1000000 }
}
```

`Line` wird automatisch berechnet: `(index + 1) * 10` (also 10, 20, 30, ...).

---

**PUT `/models/c_order/{id}`**

Order abschließen (Complete):

```json
{
  "doc-action": "CO"
}
```

Ändert `DocStatus` von `DR` (Draft) auf `CO` (Completed).

---

### Bank Account Management (Kreditkarte)

**Implementierung:** `server/services/bankAccountService.js`

**GET `/models/c_bp_bankaccount?$filter=C_BPartner_ID eq {id} and IsACH eq false&$top=1`**

Sucht den bestehenden Kreditkarten-Eintrag eines Business Partners. `IsACH eq false` filtert auf Kreditkarten-Modus (ACH = Banküberweisung/SEPA).

---

**POST `/models/c_bp_bankaccount`**

Erstellt einen neuen Kreditkarten-Eintrag:

```json
{
  "AD_Org_ID": { "id": 11 },
  "C_BPartner_ID": { "id": 1000021 },
  "IsACH": false,
  "A_Name": "Tim Tester",
  "CreditCardType": "V",
  "CreditCardNumber": "4111111111111111",
  "CreditCardExpMM": 12,
  "CreditCardExpYY": 26,
  "CreditCardVV": "123",
  "IsActive": true
}
```

**Felder:**
- `IsACH: false` → Kreditkarten-Modus (zeigt CC-Felder statt Bank/IBAN in iDempiere)
- `CreditCardType`: `V` (Visa), `M` (MasterCard), `A` (Amex), `D` (Discover) — wird im Frontend per Regex aus der Kartennummer erkannt
- `CreditCardExpYY`: 2-stellig (z.B. `26` für 2026)
- `A_Name`: Karteninhaber

**Hinweis:** iDempiere maskiert bei der Rückgabe automatisch `CreditCardNumber` (Nullen + letzte 4) und `CreditCardVV` (`"000"`). Die echten Daten werden nur beim Schreiben akzeptiert.

---

**PUT `/models/c_bp_bankaccount/{id}`**

Aktualisiert einen bestehenden Eintrag (gleiches Payload wie POST). Wird verwendet wenn `getBPBankAccount()` bereits einen Eintrag findet.

---

## Datenflüsse

### User Login Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. User gibt Email + Passwort ein
       │ 2. POST /api/auth/login { email, password }
       ▼
┌─────────────────────────────┐
│ Backend: authService.js     │
│ authenticateUser(email, pw) │
└────────┬────────────────────┘
         │
    ┌────┴──────────────────────────┐
    │                               │
    ▼                               ▼
┌──────────────────┐  ┌──────────────────────────┐
│ iDempiere:       │  │ iDempiere:               │
│ POST /auth/tokens│  │ GET /models/ad_user      │
│ (User-Creds      │  │ ?$filter=EMail eq '...'  │
│  validieren)     │  │ (User-Daten laden)       │
└──────────────────┘  └──────────────────────────┘
         │                   │
         │ 200 = OK          │ User + BPartner
         └───────┬───────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ iDempiere: GET BPartner,         │
│            GET BPartner_Location, │
│            GET C_Location         │
│ (Adressdaten laden)              │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Backend: JWT Token erstellen     │
│ Payload: { userId, email,       │
│   businessPartnerId,            │
│   bpLocationId, contactId }     │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Response 201 + Set-Cookie        │
│ auth_token=<JWT>; HttpOnly       │
│ { success: true, user: {...} }   │
└──────────┬───────────────────────┘
           │
           ▼
┌─────────────┐
│   Frontend  │
│ - user State│
│   setzen    │
│ - Redirect  │
│   → /dash   │
└─────────────┘
```

---

### User Registration Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ POST /api/auth/register
       │ { email, password, firstName,
       │   lastName, billingAddress, ... }
       ▼
┌────────────────────────────────────┐
│ Backend: registrationService.js    │
│ registerUser(registerData)         │
└────────┬───────────────────────────┘
         │
         ▼ Sequenzielle Schritte gegen iDempiere:
    ┌────────────────────────────────────────────────────┐
    │                                                     │
    │  1. Check: Email bereits vergeben?                  │
    │     GET /models/ad_user?$filter=EMail eq '...'      │
    │     GET /models/c_bpartner?$filter=Value eq '...'   │
    │     → Bei Fund: Abbruch mit 409                     │
    │                                                     │
    │  2. POST /models/c_location (Adresse erstellen)     │
    │     → locationId                                    │
    │                                                     │
    │  3. POST /models/c_bpartner (Kunde erstellen)       │
    │     → bPartnerId                                    │
    │                                                     │
    │  4. POST /models/c_bpartner_location (Verknüpfung)  │
    │     Name = Stadtname                                │
    │     → bpLocationId                                  │
    │                                                     │
    │  5. POST /models/ad_user (Login-User erstellen)     │
    │     Name = Email (für iDempiere Login)               │
    │     → adUserId                                      │
    │                                                     │
    │  6. POST /models/ad_user_roles (Rolle zuweisen)     │
    │     Role: 1000000 (nicht-fatal bei Fehler)          │
    │                                                     │
    └────────────────┬───────────────────────────────────┘
                     │ Alle Schritte OK
                     ▼
┌─────────────────────────┐
│ JWT erstellen + Cookie   │
│ Response 201             │
│ { success: true,         │
│   user: {...} }          │
└─────────────────────────┘
         │
         ▼
┌─────────────┐
│   Frontend  │
│ - Auto-Login│
│ - Redirect  │
│   → /dash   │
└─────────────┘
```

---

### Order Creation Flow

```
┌──────────────────┐
│     Frontend     │
│  (in /checkout)  │
└────────┬─────────┘
         │ User klickt "Bestellen"
         │ Cart items → { lines: [{M_Product_ID, QtyOrdered}],
         │                POReference: "WebShop-<timestamp>" }
         │ JWT Cookie wird automatisch mitgesendet
         ▼
┌──────────────────────────────────────────┐
│  POST /api/orders/create-and-complete    │
│  Middleware: requireAuth → authorize()   │
│             → orderRateLimiter           │
└────────┬─────────────────────────────────┘
         │ userData aus JWT extrahiert:
         │ { businessPartnerId, bpLocationId, contactId }
         ▼
┌──────────────────────────────────────────┐
│ Backend: orderService.js                 │
│ createAndCompleteOrder(orderData, userData)│
└────────┬─────────────────────────────────┘
         │
    ┌────┴──────────────────────────────────────┐
    │                                            │
    │ Step 1: POST /models/c_order               │
    │  ├─ C_BPartner_ID = userData.bPartnerId    │
    │  ├─ C_BPartner_Location_ID = userData.bpLoc│
    │  ├─ AD_User_ID = userData.contactId        │
    │  ├─ Bill_* = same                          │
    │  └─ Config-Werte aus ORDER_CONFIG          │
    │  → orderId                                 │
    │                                            │
    │ Step 2: POST /models/c_orderline (je Zeile)│
    │  └─ M_Product_ID + QtyOrdered              │
    │                                            │
    │ Step 2.5: Kreditkarte (optional)           │
    │  └─ Nur wenn paymentMethod='kreditkarte'   │
    │     UND creditCard-Daten im Payload        │
    │  └─ bankAccountService:                    │
    │     createOrUpdateBPBankAccount()          │
    │     → GET c_bp_bankaccount (existiert?)    │
    │     → POST oder PUT c_bp_bankaccount       │
    │                                            │
    │ Step 3: PUT /models/c_order/{orderId}      │
    │  └─ doc-action: "CO" (Complete)            │
    │                                            │
    └────────────┬──────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│ Response 200                   │
│ { id, DocumentNo, DocStatus,   │
│   GrandTotal }                 │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────┐
│     Frontend     │
│ - Order in       │
│   localStorage   │
│ - Cart leeren    │
│ - Redirect →     │
│  /order-confirm  │
└──────────────────┘
```

---

### Bank Account Flow (Kreditkarten-Kachel im Checkout)

```
┌──────────────────┐
│     Frontend     │
│  (Checkout.tsx)  │
└────────┬─────────┘
         │ User wählt "Kreditkarte" als Zahlungsart
         │ useEffect → GET /api/bank-account
         │ (JWT Cookie wird mitgesendet)
         ▼
┌──────────────────────────────────────────┐
│  GET /api/bank-account                   │
│  Middleware: requireAuth                 │
│  → businessPartnerId aus JWT             │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ bankAccountService.js                    │
│ getBPBankAccount(businessPartnerId)      │
│ → GET /models/c_bp_bankaccount           │
│   ?$filter=C_BPartner_ID eq {id}        │
│            and IsACH eq false            │
└────────┬─────────────────────────────────┘
         │
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
 Eintrag               Kein Eintrag
 gefunden              gefunden
    │                     │
    ▼                     ▼
┌────────────────┐  ┌────────────────┐
│ Response:      │  │ Response:      │
│ { exists: true │  │ { exists: false│
│   cardHolder,  │  │ }              │
│   cardNumber,  │  └───────┬────────┘
│   ... }        │          │
└───────┬────────┘          │
        │                   │
        ▼                   ▼
┌────────────────┐  ┌────────────────┐
│   Frontend:    │  │   Frontend:    │
│ Kachel mit     │  │ Leeres Formular│
│ maskierten     │  │ zur Eingabe    │
│ Kartendaten    │  │ neuer Daten    │
│ + "Bearbeiten" │  └────────────────┘
└────────────────┘
```

---

## Authentication & Security

### JWT Token Structure

**JWT Payload (Backend-seitig):**

```json
{
  "userId": "1000021",
  "email": "user@example.com",
  "businessPartnerId": 1000023,
  "bpLocationId": 1000050,
  "contactId": 1000021,
  "iat": 1711953000,
  "exp": 1712558800
}
```

**JWT Secret:** Aus `.env` Variable `JWT_SECRET`. Default in config.js: `'your-secret-key-change-in-production'` -- **muss in Produktion geändert werden!**

**Gültigkeit:** 7 Tage

---

### Cookie Configuration

```javascript
res.cookie('auth_token', token, {
  httpOnly: true,        // Nicht zugänglich via JavaScript
  secure: false,         // TODO: true bei HTTPS
  sameSite: 'lax',       // CSRF Protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
});
```

---

### Rate Limiting

**Implementierung:** `server/middleware/security.js`

| Limiter | Fenster | Max | Key | Besonderheit | Angewendet auf |
|---------|---------|-----|-----|-------------|----------------|
| `apiRateLimiter` | 15 Min | 100 | IP | – | Alle `/api` Routen |
| `loginRateLimiter` | 15 Min | 5 | IP | `skipSuccessfulRequests: true` | Login + Register |
| `orderRateLimiter` | 1 Stunde | 10 | `user:<userId>` | Pro User, nicht pro IP | Order-Erstellung |

**`skipSuccessfulRequests`** beim Login-Limiter bedeutet: Nur fehlgeschlagene Versuche zählen. Erfolgreiche Logins verbrauchen kein Rate-Limit-Budget.

---

### Authorization Middleware

**`requireAuth`** in `server/routes/auth.js`:

```javascript
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Authentifizierung erforderlich' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    return res.status(401).json({ message: 'Ungültige oder abgelaufene Session' });
  }
}
```

**`authorize()`** in `server/middleware/security.js`:

Wird in der Order-Route mit `authorize()` (ohne Argumente) aufgerufen. Prüft im Wesentlichen nur ob `req.user` existiert. Enthält Placeholder-Logik für `customerType`- und `resourceOwnership`-Checks (nicht implementiert).

---

### CORS Configuration

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',    // Vite Dev Server
    'http://localhost:3000',    // Alternative
    'http://127.0.0.1:5173',
  ],
  credentials: true,  // Cookies erlauben
}));
```

---

## Fehlerbehandlung

### Error Response Format

```json
{
  "message": "Beschreibung des Fehlers"
}
```

### HTTP Status Codes

| Code | Bedeutung | Beispiel |
|------|-----------|---------|
| 200 | OK | Erfolgreiches Request |
| 201 | Created | Benutzer registriert / Login erfolgreich |
| 400 | Bad Request | Ungültige Eingabe |
| 401 | Unauthorized | Keine/ungültige Authentication |
| 409 | Conflict | Email bereits registriert |
| 429 | Too Many Requests | Rate Limit überschritten |
| 500 | Internal Server Error | Fehler im Backend oder iDempiere |

---

## Audit Logging

**Implementierung:** `server/services/auditService.js`

**Speicherort:** `server/logs/audit.log` (NDJSON -- eine JSON-Zeile pro Event)

### Log Entry Format

```json
{
  "timestamp": "2026-03-30T10:30:15.123Z",
  "userId": "1000021",
  "email": "user@example.com",
  "action": "LOGIN",
  "resource": "auth",
  "details": { "method": "email_password" },
  "ip": "::1",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

### Logged Events

| Funktion | action | resource | details |
|---|---|---|---|
| `logLoginSuccess(...)` | `LOGIN` | `auth` | `{ method: "email_password" }` |
| `logLoginFailure(...)` | `LOGIN_FAILED` | `auth` | `{ reason: "..." }` |
| `logLogout(...)` | `LOGOUT` | `auth` | `{}` |
| `logRegistration(...)` | `REGISTER` | `auth` | `{}` |
| `logRegistrationFailure(...)` | `REGISTER_FAILED` | `auth` | `{ reason: "..." }` |
| `logOrderCreation(...)` | `CREATE_ORDER` | `orders` | `{ orderId, total }` |
| `logOrderCreationFailure(...)` | `CREATE_ORDER_FAILED` | `orders` | `{ reason: "..." }` |
| `logCatalogAccess(...)` | `VIEW_CATALOG` | `catalog` | `{}` |
| `logUnauthorizedAccess(...)` | `UNAUTHORIZED_ACCESS` | (dynamisch) | `{ attemptedAction, reason }` |

---

## Konfiguration

### Environment Variables (`.env`)

Siehe `.env.example` fuer die vollstaendige kommentierte Vorlage.

**Pflicht (Demo + normaler Betrieb):**

```bash
IDEMPIERE_BASE_URL=http://localhost:8080/api/v1
IDEMPIERE_USER=GardenAdmin
IDEMPIERE_PASSWORD=your-idempiere-password
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

**Optional (haben Code-Defaults in `server/config.js`):**

| Variable | Default | Zweck |
|---|---|---|
| `PORT` | 3001 | Backend-Port |
| `IDEMPIERE_CLIENT_ID` | 11 | Mandant (GardenWorld) |
| `IDEMPIERE_ROLE_ID` | 102 | Rolle fuer Admin-Token |
| `IDEMPIERE_ORG_ID` | 11 | Organisation |
| `IDEMPIERE_WAREHOUSE_ID` | 1000000 | Lager (global fuer Orders) |
| `IDEMPIERE_LANGUAGE` | en_US | Sprache |
| `IDEMPIERE_PRODUCT_CATEGORY_ID` | 1000000 | Katalogfilter |
| `IDEMPIERE_PRICE_LIST_VERSION_ID` | 104 | Preisliste |
| `IDEMPIERE_ORDER_*` | diverse | Bestell-Defaults (Org, DocType, Zahlung, Versand) |
| `IDEMPIERE_REGISTRATION_ROLE_ID` | 1000000 | Rolle fuer neue Webshop-User |

**Hinweis zur Benutzerzuordnung bei Orders:**

Im normalen Checkout kommen `C_BPartner_ID`, `C_BPartner_Location_ID`, `AD_User_ID` und `Bill_*`-Felder aus dem JWT (eingeloggter User). Die `ORDER_CONFIG`-Variablen fuer BPartner/User (z.B. `IDEMPIERE_ORDER_BPARTNER_ID`, `IDEMPIERE_ORDER_BILL_USER_ID`) werden nur in der Demo-Route als Fallback verwendet, da dort kein Login/JWT existiert.

---

### Configuration File (`server/config.js`)

Die Konfigurationsdatei liest Umgebungsvariablen und exportiert:

| Export | Beschreibung |
|---|---|
| `PORT` | Server-Port (Default: 3001) |
| `IDEMPIERE_BASE_URL` | iDempiere REST API URL |
| `AUTH_CONFIG` | Service Account Credentials + Context Selection Parameter |
| `CATALOG_CONFIG` | Produktkategorie + Preislisten-Version |
| `ORDER_CONFIG` | Alle Order-Default-Werte |
| `TOKEN_TTL_MS` | iDempiere Token Cache TTL (20 Minuten) |
| `JWT_SECRET` | JWT Signing Secret |
| `JWT_EXPIRES_IN` | JWT Gültigkeitsdauer (`'7d'`) |

---

## Deployment Notes

### Frontend

- Build: `npm run build` → `dist/` Ordner
- Deploy auf Apache, Nginx oder S3
- SPA-Routing erfordert Fallback auf `index.html` (Apache: `FallbackResource`, Nginx: `try_files`)

### Backend

- Node.js 18+ erforderlich (ESM)
- Empfohlen: PM2 oder systemd als Process Manager
- `.env` Datei mit iDempiere-Credentials
- CORS-Origins auf Production-Domain anpassen
- Cookie `secure: true` setzen wenn HTTPS aktiv

### iDempiere

- REST API muss erreichbar sein
- Service Account (GardenAdmin) muss existieren mit korrekter Rolle
- Webshop-Rolle (ID 1000000) muss für neue User existieren
- Produkte müssen `IsWebStoreFeatured = true` haben für Katalog-Anzeige

---

## Security Checklist

- [ ] `JWT_SECRET` in `.env`: Mindestens 32 Zeichen, kryptografisch zufällig
- [ ] HTTPS in Production aktivieren + Cookie `secure: true`
- [ ] CORS: Auf Production-Domain beschränken
- [ ] Rate Limiting: Konfiguriert und getestet
- [ ] iDempiere-Credentials: In `.env`, nicht in Code
- [ ] `.env` in `.gitignore` (keine Secrets im Repository)
- [ ] Audit Logs: Regelmäßig überprüfen
- [ ] OData Filter: Email-Input sanitieren (aktuell keine Sanitisierung)
- [ ] XSS: React escapet automatisch, DOMPurify bei User-Input empfohlen
