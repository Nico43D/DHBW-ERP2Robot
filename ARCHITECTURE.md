# Projektarchitektur – DHBW-ERP2Robot

Dieses Dokument beschreibt die Architektur des E-Commerce-Webshops „Duale Süßigkeiten". Die Anwendung ist eine Single-Page-Application (SPA), die mit React, TypeScript und Vite umgesetzt wurde. Das Design basiert auf einem [Figma-Prototyp](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design).

---

## Ordnerstruktur

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
    │   ├── QuantityStepper.tsx #  +/- Mengenauswahl
    │   ├── Button.tsx        #   Custom Button
    │   ├── Card.tsx          #   Custom Card
    │   ├── Badge.tsx         #   Custom Badge
    │   ├── Input.tsx         #   Custom Input
    │   ├── figma/            #   Figma-spezifische Helfer
    │   └── ui/               #   shadcn/ui Primitives (40+ Komponenten)
    │
    ├── contexts/             # React Context für globalen State
    │   ├── AuthContext.tsx    #   Benutzer, Login, Adressen
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
    │   ├── AGB.tsx           #   Allgemeine Geschäftsbedingungen
    │   ├── Datenschutz.tsx   #   Datenschutzerklärung
    │   ├── FAQ.tsx           #   Häufige Fragen
    │   ├── Impressum.tsx     #   Impressum
    │   ├── Kontakt.tsx       #   Kontaktseite
    │   ├── RueckgabeUmtausch.tsx # Rückgabe & Umtausch
    │   ├── VersandLieferung.tsx  # Versand & Lieferung
    │   ├── Widerrufsrecht.tsx    # Widerrufsbelehrung
    │   └── NotFound.tsx      #   404-Seite
    │
    └── utils/
        └── cn.ts             # Tailwind className-Merge Hilfsfunktion
```

---

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 18.3 | UI-Framework (Komponentenbasiert) |
| TypeScript | – | Statische Typisierung für JavaScript |
| Vite | 6.3 | Build-Tool & Entwicklungsserver mit HMR |
| Tailwind CSS | 4.1 | Utility-First CSS-Framework |
| React Router | 7.13 | Client-Side Routing (SPA-Navigation) |
| shadcn/ui + Radix UI | – | Barrierefreie, anpassbare UI-Primitives |
| Recharts | 2.15 | Diagramme (z. B. im Dashboard) |
| Lucide React | 0.487 | SVG-Icon-Bibliothek |
| Motion | 12.23 | Animationen |

---

## Architektur-Übersicht

### Komponentenhierarchie

```
main.tsx
└── <App />
    ├── <AuthProvider>        ← Globaler Benutzer-State
    │   └── <CartProvider>    ← Globaler Warenkorb-State
    │       └── <RouterProvider>
    │           └── <Layout>
    │               ├── <Header />    ← Navigation, Logo, Warenkorb-Badge, Login/Logout
    │               ├── <Outlet />    ← Aktive Seite (React Router)
    │               └── <Footer />    ← Footer-Links (Kundenservice, Rechtliches)
```

### Einstiegspunkt

`main.tsx` rendert die `<App />`-Komponente in das DOM-Element `#root` (definiert in `index.html`). Globale CSS-Styles werden hier eingebunden.

### App-Komponente

`App.tsx` verschachtelt drei Provider in folgender Reihenfolge:

1. **AuthProvider** – Stellt Authentifizierungs-State bereit
2. **CartProvider** – Stellt Warenkorb-State bereit (hat Zugriff auf Auth-Context)
3. **RouterProvider** – Initialisiert React Router mit allen Routen

---

## Routing

Alle Routen sind in `routes.ts` mit `createBrowserRouter` (React Router v7) definiert. Sämtliche Seiten sind Kinder der `<Layout>`-Komponente.

| Pfad | Seite | Beschreibung |
|---|---|---|
| `/` | Home | Startseite mit Hero, Features, Produktvorschau |
| `/shop` | Shop | Produktübersicht mit allen Artikeln |
| `/products/:id` | ProductDetail | Detailseite eines einzelnen Produkts |
| `/cart` | Cart | Warenkorb-Ansicht |
| `/checkout` | Checkout | Bestellvorgang (Adresse, Zahlung) |
| `/order-confirmation/:orderNumber` | OrderConfirmation | Bestellbestätigung |
| `/login` | Login | Anmeldeformular |
| `/register` | Register | Registrierungsformular |
| `/dashboard` | Dashboard | Benutzer-Dashboard (nur eingeloggt) |
| `/orders` | Orders | Bestellhistorie (nur eingeloggt) |
| `/orders/:orderNumber` | OrderDetail | Einzelne Bestellung (nur eingeloggt) |
| `/account/addresses` | AddressManagement | Adressverwaltung (nur eingeloggt) |
| `/kontakt` | Kontakt | Kontaktseite |
| `/versand-lieferung` | VersandLieferung | Versand- & Lieferinformationen |
| `/rueckgabe-umtausch` | RueckgabeUmtausch | Rückgabe & Umtausch |
| `/faq` | FAQ | Häufig gestellte Fragen |
| `/agb` | AGB | Allgemeine Geschäftsbedingungen |
| `/datenschutz` | Datenschutz | Datenschutzerklärung |
| `/impressum` | Impressum | Impressum |
| `/widerrufsrecht` | Widerrufsrecht | Widerrufsbelehrung |
| `*` | NotFound | 404-Fehlerseite |

---

## State Management

Die Anwendung verwendet **React Context** für globalen State. Es gibt kein externes State-Management-Framework (z. B. Redux). Daten werden im `localStorage` persistiert.

### AuthContext

Verwaltet den Benutzer-State und die Authentifizierung.

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
```

**Bereitgestellte Funktionen:**

| Funktion | Beschreibung |
|---|---|
| `user` | Aktueller Benutzer oder `null` |
| `isAuthenticated` | Boolean – ist der Benutzer eingeloggt? |
| `login(email, password)` | Authentifiziert den Benutzer (gibt `true`/`false` zurück) |
| `register(data)` | Registriert einen neuen Benutzer |
| `updateAddresses(billing, delivery)` | Aktualisiert Rechnungs- und Lieferadresse |
| `logout()` | Meldet den Benutzer ab |

**Persistenz:** Benutzerdaten werden in `localStorage` unter den Keys `duale-user` (aktueller Benutzer) und `duale-users` (alle registrierten Benutzer) gespeichert.

### CartContext

Verwaltet den Warenkorb-State.

**Interface:**

```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
```

**Bereitgestellte Funktionen:**

| Funktion | Beschreibung |
|---|---|
| `items` | Array aller Warenkorb-Artikel |
| `totalItems` | Gesamtanzahl aller Artikel |
| `totalPrice` | Gesamtpreis des Warenkorbs |
| `addToCart(product, quantity)` | Fügt Produkt hinzu (erhöht Menge bei Duplikat) |
| `removeFromCart(productId)` | Entfernt ein Produkt |
| `updateQuantity(productId, quantity)` | Ändert die Menge (entfernt bei ≤ 0) |
| `clearCart()` | Leert den gesamten Warenkorb |

**Persistenz:** Der Warenkorb wird in `localStorage` unter dem Key `duale-cart` gespeichert und beim Laden der Seite wiederhergestellt.

---

## Datenmodell

### Produkte

Produkte sind statisch in `data/products.ts` definiert. Es gibt aktuell 3 Süßwaren-Artikel.

```typescript
interface Product {
  id: string;        // Eindeutige ID
  name: string;      // Produktname
  description: string; // Kurzbeschreibung
  price: number;     // Preis in Euro
  image: string;     // Importiertes Bild (Vite Asset)
  details: string[]; // Liste von Produkteigenschaften
}
```

| ID | Produkt | Preis |
|---|---|---|
| 1 | Knoppers | 2,99 € |
| 2 | Nougat Happen | 4,49 € |
| 3 | Ferrero Küsschen | 5,99 € |

---

## Komponenten

### Layout-Komponenten

| Komponente | Beschreibung |
|---|---|
| `Layout` | Seiten-Shell mit Flex-Column für Sticky-Footer. Enthält Header, `<Outlet />` und Footer. |
| `Header` | Sticky-Header mit Logo („Duale Süßigkeiten"), Navigation (Home, Shop, Dashboard, Bestellungen), Warenkorb-Icon mit Badge und Login/Logout-Button. |
| `Footer` | Dreispaltiger Footer: Beschreibung, Kundenservice-Links, Rechtliches. |

### Produkt-Komponenten

| Komponente | Beschreibung |
|---|---|
| `ProductCard` | Produktkarte mit Bild, Name, Preis und „In den Warenkorb"-Button. Wird auf Shop- und Home-Seite verwendet. |
| `QuantityStepper` | +/- Stepper zur Mengenauswahl, eingesetzt im Warenkorb und auf der Produktdetailseite. |

### UI-Primitives (`components/ui/`)

Über 40 Komponenten aus **shadcn/ui**, basierend auf Radix UI. Diese stellen barrierefreie, unstyled Primitives bereit (Dialog, Dropdown, Tabs, Accordion etc.), die mit Tailwind CSS gestylt werden.

---

## Styling

Das Styling basiert auf **Tailwind CSS 4** mit folgender Konfiguration:

| Datei | Zweck |
|---|---|
| `styles/index.css` | Globaler CSS-Einstieg, importiert alle anderen Styles |
| `styles/tailwind.css` | Tailwind-Basis-Import |
| `styles/theme.css` | Design-Tokens: Farben, Rundungen, Abstände |
| `styles/fonts.css` | Schriftarten-Deklarationen |

Die Hauptfarbe der Anwendung ist **#EB1A2B** (Rot), ergänzt durch **#6E7C85** (Grau) für den Footer.
