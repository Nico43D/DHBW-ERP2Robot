# Projektarchitektur – DHBW-ERP2Robot

Dieses Dokument beschreibt die Architektur des E-Commerce-Webshops „Duale Süßigkeiten". Die Anwendung ist eine Single-Page-Application (SPA), die mit React, TypeScript und Vite umgesetzt wurde und mit einem Node.js/Express Backend und iDempiere ERP kommuniziert.

---

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Ordnerstruktur](#ordnerstruktur)
3. [Technologie-Stack](#technologie-stack)
4. [Frontend-Architektur](#frontend-architektur)
5. [Backend-Architektur](#backend-architektur)
6. [API-Referenz](#api-referenz)
7. [iDempiere Integration](#idempiere-integration)
8. [Datenflüsse](#datenflüsse)
9. [Authentication & Security](#authentication--security)
10. [Fehlerbehandlung](#fehlerbehandlung)
11. [Audit Logging](#audit-logging)
12. [Konfiguration](#konfiguration)

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
│     Backend (Node.js/Express)           │  Port 3000
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
    │   ├── AuthContext.tsx    #   Benutzer, Login, Adressen, isLoading
    │   └── CartContext.tsx    #   Warenkorb (add, remove, update, clear)
    │
    ├── data/
    │   └── products.ts       # Produktdaten (statisch, 3 Produkte)
    │
    ├── pages/                # 21 Seiten-Komponenten
    │   ├── Home.tsx          #   Startseite
    │   ├── Shop.tsx          #   Produktübersicht
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
│   ├── auth.js               # Service Account Authentication mit iDempiere
│   └── models/               # iDempiere REST API Models (als Referenz)
│
├── routes/                   # API Endpoints (Express Router)
│   ├── auth.js               # POST /api/auth/login, register, logout, GET /api/auth/me
│   ├── orders.js             # POST /api/orders/create-and-complete
│   ├── catalog.js            # GET /api/catalog
│   └── health.js             # GET /health
│
├── services/                 # Business Logic Layer
│   ├── authService.js        # Benutzer-Authentifizierung über iDempiere
│   ├── registrationService.js # 6-Schritt Registrierungsprozess
│   ├── orderService.js       # Order Creation & Completion
│   ├── auditService.js       # Audit Logging
│   └── catalogService.js     # Produktkatalog
│
├── middleware/
│   └── security.js           # Rate Limiting, Authorization, Error Handlers
│
└── logs/                     # Audit-Logs (JSON-Dateien)
    └── audit.log             # Tägliche Audit-Einträge
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
| Node.js | 18+ | JavaScript Runtime |
| Express | 4.x | Web Framework & HTTP Server |
| JWT | – | JSON Web Token Authentication |
| Cookie-Parser | – | HTTP Cookie Parsing |
| CORS | – | Cross-Origin Resource Sharing |
| Express Rate-Limit | – | API Rate Limiting |
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
| `/shop` | Shop | Produktübersicht mit allen Artikeln | Nein |
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

### State Management

#### AuthContext

Verwaltet globalen Authentifizierungs-State.

**Interface:**

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
  businessPartnerId: number;
  bpLocationId: number;
  contactId: number;
}
```

**Bereitgestellte Funktionen:**

| Funktion | Beschreibung |
|---|---|
| `user` | Aktueller Benutzer oder `null` |
| `isAuthenticated` | Boolean – ist der Benutzer eingeloggt? |
| `isLoading` | Boolean – wird gerade die Session validiert? |
| `login(email, password)` | Authentifiziert den Benutzer über Backend-API |
| `register(data)` | Registriert einen neuen Benutzer über Backend-API |
| `updateAddresses(billing, delivery)` | Aktualisiert Adressen |
| `logout()` | Meldet den Benutzer ab |

**Persistenz:** JWT wird in httpOnly Cookie gespeichert. Benutzer wird beim Page-Load via `GET /api/auth/me` wiederhergestellt.

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

---

## Backend-Architektur

### Startup & Middleware-Stack

**`server/index.js`:**

```javascript
app.use(cors({ origin: [...], credentials: true }));    // CORS für Frontend
app.use(express.json({ limit: '2mb' }));                 // JSON Parser
app.use(cookieParser());                                 // Cookie Parser
app.use('/api', apiRateLimiter);                         // Rate Limiting
app.use(healthRoutes);                                   // Health Check
app.use('/api', authRoutes);                             // Auth Endpoints
app.use('/api', catalogRoutes);                          // Catalog Endpoints
app.use('/api', orderRoutes);                            // Order Endpoints
```

### Request Flow

```
Frontend HTTP Request
    ↓
Express Middleware (CORS, JSON Parser, Cookies)
    ↓
Rate Limiter Middleware
    ↓
Authorization Middleware (für geschützte Routes)
    ↓
Route Handler (req, res)
    ↓
Service Layer (Business Logic)
    ├─→ iDempiere Client
    │   └─→ iDempiere REST API
    └─→ Audit Service
    ↓
Response (JSON + Cookie für Auth)
```

---

## API-Referenz

### Frontend ↔ Backend Communication

#### Authentication Endpoints

##### `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
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

**Cookie Set:**

```
Set-Cookie: auth_token=<JWT>; HttpOnly; Secure=false; SameSite=Lax; Max-Age=604800000
```

**Error Responses:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Missing Credentials | `"Email und Passwort sind erforderlich"` |
| 401 | Invalid Credentials | `"Ungültige Email oder Passwort"` |
| 429 | Rate Limited | (nach 5 Versuchen in 15 Min) |
| 500 | Server Error | `"Serverfehler bei der Anmeldung"` |

---

##### `POST /api/auth/register`

**Request:**

```json
{
  "email": "new@example.com",
  "password": "securepassword123",
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
    "billingAddress": { ... },
    "deliveryAddress": { ... }
  }
}
```

**Registration Process (6 Steps in Backend):**

1. **Duplicate Check** – Prüfe ob Email bereits existiert (AD_User.EMail oder C_BPartner.Value)
2. **Create Location** – Erstelle C_Location mit Adresse
3. **Create BusinessPartner** – Erstelle C_BPartner mit Value=Email
4. **Create BPartner Location** – Erstelle C_BPartner_Location mit Name=City
5. **Create User** – Erstelle AD_User mit Email als Login
6. **Assign Role** – Weise Standard-Role zu (Role ID 1000000)

**Error Responses:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Missing Fields | `"Vor- und Nachname sind erforderlich"` |
| 409 | Email Exists | `"Diese Email ist bereits registriert"` |
| 429 | Rate Limited | (nach 5 Versuche in 15 Min) |
| 500 | Server Error | `"Serverfehler bei der Registrierung"` |

---

##### `POST /api/auth/logout`

**Request:** keine Parameter

**Response:**

```json
{
  "success": true,
  "message": "Erfolgreich abgemeldet"
}
```

**Cookie Clear:**

```
Set-Cookie: auth_token=; Max-Age=0
```

---

##### `GET /api/auth/me`

**Purpose:** Session-Validierung nach Page-Reload. Wird vom Frontend beim App-Load aufgerufen.

**Request:** keine Parameter (JWT aus Cookie)

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
    "billingAddress": { ... },
    "deliveryAddress": { ... }
  }
}
```

**Error Responses:**

| Code | Fehler |
|------|--------|
| 401 | Nicht authentifiziert (kein Cookie) |
| 401 | Session abgelaufen (Token ungültig) |

---

#### Order Endpoints

##### `POST /api/orders/create-and-complete`

**Prerequisites:**
- Authentication: JWT Cookie erforderlich
- Authorization: Benutzer muss Rolle haben (ORDER privilege)
- Rate Limit: Max 10 Bestellungen pro 15 Min

**Request:**

```json
{
  "lines": [
    {
      "M_Product_ID": 1000001,
      "QtyOrdered": 2,
      "C_UOM_ID": 100
    },
    {
      "M_Product_ID": 1000002,
      "QtyOrdered": 1,
      "C_UOM_ID": 100
    }
  ],
  "POReference": "PO-123",
  "DateOrdered": "2026-03-30",
  "DatePromised": "2026-03-31"
}
```

**Response (200 OK):**

```json
{
  "id": "1000015",
  "DocumentNo": "SO-0001",
  "DateOrdered": "2026-03-30",
  "DatePromised": "2026-03-31",
  "C_BPartner_ID": { "id": 1000023 },
  "GrandTotal": 50.00,
  "DocStatus": "CO",
  "lines": [
    {
      "id": "1000047",
      "Line": 10,
      "M_Product_ID": { "id": 1000001 },
      "QtyOrdered": 2,
      "LineNetAmt": 30.00
    },
    {
      "id": "1000048",
      "Line": 20,
      "M_Product_ID": { "id": 1000002 },
      "QtyOrdered": 1,
      "LineNetAmt": 20.00
    }
  ]
}
```

**Order Creation Process (3 Steps):**

1. **POST /models/c_order** – Auftragskopf mit Header-Daten erstellen
2. **POST /models/c_orderline** – Für jede Zeile eine Orderline erstellen
3. **PUT /models/c_order/{id}** – Order mit `doc-action=CO` (Complete) abschließen

**Error Responses:**

| Code | Fehler | Beispiel |
|------|--------|---------|
| 400 | Invalid Payload | `"Order payload requires non-empty lines array"` |
| 401 | Not Authenticated | (kein Cookie vorhanden) |
| 403 | Not Authorized | (User hat keine ORDER Role) |
| 429 | Rate Limited | (10 Orders in 15 Min) |
| 500 | iDempiere Error | `"Order create failed: ..."` |

---

#### Catalog Endpoints

##### `GET /api/catalog`

**Request:** keine Parameter

**Response (200 OK):**

```json
[
  {
    "id": "1000001",
    "name": "Knoppers",
    "description": "Knackig, knusprig, köstlich",
    "price": 2.99,
    "image": "/assets/knoppers.jpg",
    "details": ["Schokolade", "Nougat", "Wafer"]
  },
  {
    "id": "1000002",
    "name": "Nougat Happen",
    "description": "Süße Nougat-Praline",
    "price": 4.49,
    "image": "/assets/nougat.jpg",
    "details": ["Nougat", "Praline", "Premium"]
  }
]
```

---

#### Health Check Endpoint

##### `GET /health`

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2026-03-30T10:30:00Z"
}
```

---

### Backend ↔ iDempiere Communication

#### Authentication

**Service Account Pattern:**

- **Account:** GardenAdmin (Benutzername)
- **Token:** Wird von `idempiere/auth.js` automatisch verwaltet
- **Refresh:** Token wird gecacht und bei 401 neu angefordert

**Flow:**

```
Backend needs data
    ↓
authenticate() → Check if Token cached
    ├─→ Token exists & valid? → Use it
    └─→ No/Expired? → POST /auth/tokens with GardenAdmin credentials
                      → Store token in cache
    ↓
idempiereFetch(path, options)
    ├─→ Add Authorization: Bearer {token}
    ├─→ Send HTTP Request to iDempiere REST API
    ├─→ Receive response
    └─→ If 401 → invalidate token cache → retry with new token
```

---

#### iDempiere REST API Models

**Base URL:** `https://idempiere.domain.com/webservices/rest/v1`

**Headers (für alle Requests):**

```
Content-Type: application/json
Authorization: Bearer <token>
```

---

##### User Authentication (für Login-Validierung)

**POST `/auth/tokens`**

```json
{
  "userName": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Purpose:** Validiere User-Credentials ohne volle Context Selection. Response-Status 200 = Credentials OK, 401 = Ungültig.

---

##### BusinessPartner Management

**GET `/models/c_bpartner/{id}`**

Get BusinessPartner by ID:

```json
{
  "id": 1000023,
  "Value": "user@example.com",
  "Name": "Max Mustermann",
  "IsCustomer": true,
  "IsVendor": false,
  "IsCompany": false
}
```

**GET `/models/c_bpartner?$filter=Value eq 'email@example.com'`**

Search BusinessPartner by Value (Email):

```json
{
  "records": [
    { "id": 1000023, "Value": "email@example.com", ... }
  ]
}
```

**POST `/models/c_bpartner`**

Create BusinessPartner:

```json
{
  "AD_Org_ID": { "id": 1000000 },
  "Value": "new.user@example.com",
  "Name": "Anna Schmidt",
  "IsCustomer": true,
  "IsVendor": false,
  "IsEmployee": false,
  "IsSalesRep": false
}
```

Response:
```json
{
  "id": 1000024,
  "Value": "new.user@example.com",
  "Name": "Anna Schmidt"
}
```

---

##### Location Management

**GET `/models/c_location/{id}`**

Get address location:

```json
{
  "id": 1000100,
  "Address1": "Musterstraße",
  "Address2": "42",
  "Postal": "70173",
  "City": "Stuttgart",
  "C_Country_ID": { "id": 99, "identifier": "DE" }
}
```

**POST `/models/c_location`**

Create location:

```json
{
  "Address1": "Leipziger Str.",
  "Address2": "15",
  "Postal": "10115",
  "City": "Berlin",
  "C_Country_ID": { "id": 99 }
}
```

Response:
```json
{
  "id": 1000101,
  "City": "Berlin",
  "Postal": "10115"
}
```

---

##### BusinessPartner Location (nicht C_Location!)

**GET `/models/c_bpartner_location?$filter=C_BPartner_ID eq {id}`**

Get all BPartner Locations:

```json
{
  "records": [
    {
      "id": 1000050,
      "C_BPartner_ID": { "id": 1000023 },
      "C_Location_ID": { "id": 1000100 },
      "Name": "Berlin",
      "IsBillTo": true,
      "IsShipTo": true
    }
  ]
}
```

**POST `/models/c_bpartner_location`**

Create BPartner Location (Verknüpfung):

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

Response:
```json
{
  "id": 1000050,
  "Name": "Berlin",
  "C_BPartner_ID": { "id": 1000023 }
}
```

**WICHTIG:** `C_BPartner_Location_ID` (die `id` hier) wird in Orders als `C_BPartner_Location_ID` verwendet, nicht `C_Location_ID`!

---

##### User Management

**GET `/models/ad_user?$filter=EMail eq 'email@example.com'`**

Search AD_User by email:

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

Create AD_User:

```json
{
  "AD_Org_ID": { "id": 1000000 },
  "Name": "new@example.com",
  "EMail": "new@example.com",
  "Password": "hashedpassword123",
  "C_BPartner_ID": { "id": 1000024 },
  "C_BPartner_Location_ID": { "id": 1000050 },
  "IsActive": true,
  "Description": "Anna Schmidt"
}
```

Response:
```json
{
  "id": 1000022,
  "Name": "new@example.com",
  "EMail": "new@example.com"
}
```

---

##### User Role Assignment

**POST `/models/ad_user_roles`**

Assign Role to User:

```json
{
  "AD_User_ID": { "id": 1000022 },
  "AD_Role_ID": { "id": 1000000 }
}
```

Response:
```json
{
  "id": 1000030,
  "AD_User_ID": { "id": 1000022 },
  "AD_Role_ID": { "id": 1000000 }
}
```

---

##### Order Management

**POST `/models/c_order`**

Create Sales Order:

```json
{
  "IsSOTrx": true,
  "IsSelfService": true,
  "AD_Org_ID": { "id": 1000000 },
  "C_DocTypeTarget_ID": { "id": 1000082 },
  "DateOrdered": "2026-03-30",
  "DatePromised": "2026-03-31",
  "DateAcct": "2026-03-30",
  "C_BPartner_ID": { "id": 1000023 },
  "C_BPartner_Location_ID": { "id": 1000050 },
  "AD_User_ID": { "id": 1000021 },
  "Bill_BPartner_ID": { "id": 1000023 },
  "Bill_Location_ID": { "id": 1000050 },
  "Bill_User_ID": { "id": 1000021 },
  "SalesRep_ID": { "id": 1000016 },
  "C_PaymentTerm_ID": { "id": 1000000 },
  "M_Warehouse_ID": { "id": 1000226 },
  "M_PriceList_ID": { "id": 1000003 },
  "M_Shipper_ID": { "id": 1000000 },
  "PaymentRule": { "id": "P" },
  "DeliveryViaRule": { "id": "D" },
  "POReference": "PO-123"
}
```

Response:
```json
{
  "id": 1000015,
  "DocumentNo": "SO-0001",
  "C_Order_ID": 1000015,
  "DocStatus": "DR"
}
```

---

**POST `/models/c_orderline`**

Create Order Line:

```json
{
  "C_Order_ID": { "id": 1000015 },
  "Line": 10,
  "M_Product_ID": { "id": 1000001 },
  "QtyOrdered": 2,
  "QtyEntered": 2,
  "C_UOM_ID": { "id": 100 },
  "M_Warehouse_ID": { "id": 1000226 }
}
```

Response:
```json
{
  "id": 1000047,
  "Line": 10,
  "M_Product_ID": { "id": 1000001 },
  "QtyOrdered": 2
}
```

---

**PUT `/models/c_order/{id}`**

Complete Order (doc-action=CO):

```json
{
  "id": 1000015,
  "doc-action": "CO"
}
```

Response:
```json
{
  "id": 1000015,
  "DocumentNo": "SO-0001",
  "DocStatus": "CO",
  "GrandTotal": 50.00
}
```

---

## Datenflüsse

### User Login Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. User klickt "Anmelden"
       │ 2. Enter email + password
       ▼
┌─────────────────────┐
│  POST /api/auth/login
│  { email, password }│
└────────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Backend: authService.js         │
    │ authenticateUser(email, pass)   │
    └────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌──────────────┐  ┌──────────────────────┐
   │ iDempiere:   │  │ iDempiere:           │
   │ POST         │  │ GET /models/ad_user  │
   │ /auth/tokens │  │ filter by email      │
   │ (validate)   │  │                      │
   └──────────────┘  └──────────────────────┘
        │                 │
        │ Credentials OK  │
        └────────┬────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ iDempiere: Load BPartner,      │
    │            Location, Contact   │
    └────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Backend: Create JWT Token            │
│ {userId, email, businessPartnerId,   │
│  bpLocationId, contactId}            │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Response 200 + Set-Cookie            │
│ auth_token=<JWT>; HttpOnly           │
│ {user: {...}}                        │
└──────────┬───────────────────────────┘
           │
           ▼
┌─────────────┐
│   Frontend  │
│ - Save user │
│ - Set token │
│ - Redirect  │
│   to /dash  │
└─────────────┘
```

---

### User Registration Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. User klickt "Registrieren"
       │ 2. Fill form + submit
       ▼
┌────────────────────────────────────┐
│  POST /api/auth/register            │
│  {email, password, firstName,       │
│   lastName, billingAddress, ...}    │
└────────┬──────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Backend: registrationService.js          │
│ registerUser(registerData)               │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┬──────┬──────┬──────┬──────┐
    │          │      │      │      │      │
◄───►1. Check if email exists (AD_User + BPartner)
    │  2. POST /models/c_location (create address)
    │  3. POST /models/c_bpartner (create customer)
    │  4. POST /models/c_bpartner_location (link)
    │  5. POST /models/ad_user (create login user)
    │  6. POST /models/ad_user_roles (assign role)
    │
    └────┬────┘
         │ All 6 steps OK? Create JWT
         ▼
┌─────────────────────────┐
│ Response 201 + Cookie   │
│ auth_token=<JWT>        │
│ {user: {...}}           │
└─────────────────────────┘
         │
         ▼
┌─────────────┐
│   Frontend  │
│ - Auto-Login│
│ - Redirect  │
│   to /dash  │
└─────────────┘
```

---

### Order Creation Flow

```
┌──────────────────┐
│     Frontend     │
│   (in /checkout)│
└────────┬─────────┘
         │ 1. User klickt "Bestellen"
         │ 2. Cart items → POST payload
         │ 3. JWT already in cookie
         ▼
┌────────────────────────────────────┐
│  POST /api/orders/create-and-complete
│  {lines: [{M_Product_ID, QtyOrdered}]}│
┌────────┬───────────────────────────┘
         │
         ▼ JWT + Rate Limiter Checks
┌─────────────────────────────────────┐
│ Backend: orderService.js            │
│ createAndCompleteOrder(orderData,   │
│   userData from JWT)                │
└────────┬───────────────────────────┘
         │
    ┌────┴────┬───────┐
    │          │       │
◄───►Step 1: POST /models/c_order (create header)
    │ ├─ C_BPartner_ID = userData.businessPartnerId
    │ ├─ C_BPartner_Location_ID = userData.bpLocationId
    │ ├─ AD_User_ID = userData.contactId
    │ └─ Bill_* = same
    │
    │ Step 2: POST /models/c_orderline (for each line)
    │ └─ Link each product to order
    │
    │ Step 3: PUT /models/c_order/{id}
    │ ├─ doc-action: "CO" (Complete)
    │ └─ Order moves from Draft to Completed
    │
    └────┬────┘
         │
         ▼
┌────────────────────────────────┐
│ Response 200                   │
│ {id, DocumentNo, GrandTotal,   │
│  lines: [...]}                 │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────┐
│     Frontend     │
│ - Order Success! │
│ - Clear cart     │
│ - Redirect to    │
│   /order-confirm │
└──────────────────┘
```

---

## Authentication & Security

### JWT Token Structure

**JWT Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**JWT Payload:**
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

**JWT Secret:** Aus `.env` Variable `JWT_SECRET` (mindestens 32 Zeichen)

**Validity:** 7 days (604800 seconds)

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

| Endpoint | Limit | Fenster |
|----------|-------|---------|
| Login | 5 attempts | 15 minutes |
| Register | 5 attempts | 15 minutes |
| Orders | 10 attempts | 15 minutes |
| General API | 100 requests | 15 minutes |

**Beispiel – Login Rate Limiter:**

```javascript
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Zu viele Login-Versuche, bitte versuchen Sie es später erneut',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

### Authorization

**Middleware: `requireAuth`** in `routes/auth.js`

```javascript
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Authentifizierung erforderlich' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach to request for downstream use
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    return res.status(401).json({ message: 'Ungültige oder abgelaufene Session' });
  }
}
```

**Verwendung in Route:**

```javascript
router.post(
  '/orders/create-and-complete',
  requireAuth,           // Check JWT
  authorize(),          // Check roles/permissions
  orderRateLimiter,     // Check rate limit
  async (req, res) => { ... }
);
```

---

### CORS Configuration

**Allowed Origins (Development):**

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',    // Vite Dev Server
    'http://localhost:3000',    // Backend (for debugging)
    'http://127.0.0.1:5173',
  ],
  credentials: true,  // Allow cookies
}));
```

**Production:** Sollte auf echte Domain geändert werden, z.B.:

```javascript
origin: 'https://dualesuessikeiten.de',
```

---

## Fehlerbehandlung

### Error Response Format

**Standardformat für alle Fehler:**

```json
{
  "message": "Beschreibung des Fehlers",
  "code": "ERROR_CODE" // Optional
}
```

---

### HTTP Status Codes

| Code | Bedeutung | Beispiel |
|------|-----------|---------|
| 200 | OK | Erfolgreiches Request |
| 201 | Created | Benutzer registriert / Bestellung erstellt |
| 400 | Bad Request | Ungültige Eingabe (validierung fehlgeschlagen) |
| 401 | Unauthorized | Keine Authentication (kein JWT) |
| 403 | Forbidden | Nicht autorisiert (User hat keine Rolle) |
| 409 | Conflict | Duplicate (z.B. Email existiert schon) |
| 429 | Too Many Requests | Rate Limit überschritten |
| 500 | Internal Server Error | Fehler im Backend oder iDempiere |

---

### Error Handling Beispiele

**Validierungsfehler:**

```json
HTTP 400 Bad Request

{
  "message": "Email und Passwort sind erforderlich"
}
```

**Authentifizierungsfehler:**

```json
HTTP 401 Unauthorized

{
  "message": "Ungültige Email oder Passwort"
}
```

**Duplicate Email:**

```json
HTTP 409 Conflict

{
  "message": "Diese Email ist bereits registriert"
}
```

**Rate Limit:**

```json
HTTP 429 Too Many Requests

{
  "message": "Zu viele Login-Versuche, bitte versuchen Sie es später erneut"
}
```

**iDempiere Error:**

```json
HTTP 500 Internal Server Error

{
  "message": "Order create failed: [iDempiere error details]"
}
```

---

## Audit Logging

**Datei:** `server/services/auditService.js`

### Logged Events

**LOGIN:**
```json
{
  "timestamp": "2026-03-30T10:30:15.123Z",
  "userId": "1000021",
  "email": "user@example.com",
  "action": "LOGIN_SUCCESS",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

**LOGIN_FAILURE:**
```json
{
  "timestamp": "2026-03-30T10:30:15.123Z",
  "email": "user@example.com",
  "action": "LOGIN_FAILURE",
  "reason": "invalid_credentials",
  "ip": "192.168.1.100",
  "success": false
}
```

**REGISTRATION:**
```json
{
  "timestamp": "2026-03-30T10:35:20.456Z",
  "userId": "1000022",
  "email": "new@example.com",
  "action": "REGISTRATION_SUCCESS",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

**ORDER_CREATION:**
```json
{
  "timestamp": "2026-03-30T11:00:45.789Z",
  "userId": "1000021",
  "email": "user@example.com",
  "action": "ORDER_CREATION_SUCCESS",
  "orderId": "1000015",
  "orderTotal": 50.00,
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

**LOGOUT:**
```json
{
  "timestamp": "2026-03-30T12:00:00.000Z",
  "userId": "1000021",
  "email": "user@example.com",
  "action": "LOGOUT",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

---

### Log Storage

**Datei:** `server/logs/audit.log`

Format: Zeilenweise JSON (eine Event pro Zeile)

```
{"timestamp":"2026-03-30T10:30:15.123Z","userId":"1000021",...}
{"timestamp":"2026-03-30T10:30:20.456Z","userId":"1000022",...}
```

---

## Konfiguration

### Environment Variables (`.env`)

```bash
# Server
PORT=3000
NODE_ENV=development

# iDempiere
IDEMPIERE_BASE_URL=http://localhost:8080/webservices/rest/v1
IDEMPIERE_SERVICE_USER=GardenAdmin
IDEMPIERE_SERVICE_PASSWORD=xxxx

# Auth
JWT_SECRET=your-super-secret-key-min-32-chars-long-xxx
JWT_EXPIRES_IN=7d

# Auth Config (Order Defaults)
AUTH_ORG_ID=1000000
AUTH_WAREHOUSE_ID=1000226

# Order Config (Defaults)
ORDER_IS_SO_TRX=true
ORDER_IS_SELF_SERVICE=true
ORDER_AD_ORG_ID=1000000
ORDER_DOC_TYPE_TARGET_ID=1000082
ORDER_SALES_REP_ID=1000016
ORDER_PAYMENT_TERM_ID=1000000
ORDER_PRICE_LIST_ID=1000003
ORDER_SHIPPER_ID=1000000
ORDER_PAYMENT_RULE=P
ORDER_DELIVERY_VIA_RULE=D
```

---

### Configuration File (`server/config.js`)

```javascript
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const IDEMPIERE_BASE_URL = process.env.IDEMPIERE_BASE_URL;
export const IDEMPIERE_CREDENTIALS = {
  userName: process.env.IDEMPIERE_SERVICE_USER,
  password: process.env.IDEMPIERE_SERVICE_PASSWORD,
};

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const AUTH_CONFIG = {
  parameters: {
    organizationId: parseInt(process.env.AUTH_ORG_ID || '1000000'),
    warehouseId: parseInt(process.env.AUTH_WAREHOUSE_ID || '1000226'),
  },
};

export const ORDER_CONFIG = {
  IsSOTrx: JSON.parse(process.env.ORDER_IS_SO_TRX || 'true'),
  IsSelfService: JSON.parse(process.env.ORDER_IS_SELF_SERVICE || 'true'),
  AD_Org_ID: parseInt(process.env.ORDER_AD_ORG_ID || '1000000'),
  C_DocTypeTarget_ID: parseInt(process.env.ORDER_DOC_TYPE_TARGET_ID || '1000082'),
  SalesRep_ID: parseInt(process.env.ORDER_SALES_REP_ID || '1000016'),
  C_PaymentTerm_ID: parseInt(process.env.ORDER_PAYMENT_TERM_ID || '1000000'),
  M_PriceList_ID: parseInt(process.env.ORDER_PRICE_LIST_ID || '1000003'),
  M_Shipper_ID: parseInt(process.env.ORDER_SHIPPER_ID || '1000000'),
  PaymentRule: process.env.ORDER_PAYMENT_RULE || 'P',
  DeliveryViaRule: process.env.ORDER_DELIVERY_VIA_RULE || 'D',
  POReference: 'WebShop',
};
```

---

## Deployment Notes

### Frontend

- Build: `npm run build` → `dist/` folder
- Deploy to Apache, Nginx, or S3
- Environment: `.env.production` for API_URL

### Backend

- Node.js 18+ erforderlich
- Process Manager empfohlen: PM2, systemd, Docker
- Environment: `.env` mit iDempiere-Credentials
- CORS: Auf Production-Domain anpassen
- Cookies: `secure: true` wenn HTTPS aktiv

### iDempiere

- REST API muss erreichbar sein
- Service Account (GardenAdmin) muss existieren
- Rollen und Berechtigungen konfigurieren
- Index erstellen für schnelle Queries

---

## Security Checklist

- [ ] JWT_SECRET: Mindestens 32 Zeichen, zufällig
- [ ] HTTPS in Production (Set cookie `secure: true`)
- [ ] CORS: Auf Production-Domains beschränken
- [ ] Rate Limiting: Alle Auth-Endpoints geschützt
- [ ] iDempiere-Credentials: In `.env`, nicht in Code
- [ ] Audit Logs: Regelmäßig überprüft
- [ ] SQL Injection: N/A (iDempiere REST API ist ORM, kein SQL)
- [ ] XSS: React escapet automatisch, aber DOMPurify bei User Input empfohlen

