# Projektarchitektur – DHBW-ERP2Robot

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

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| React | 18.3 | UI-Framework |
| TypeScript | – | Typsicherheit |
| Vite | 6.3 | Build-Tool & Dev-Server |
| Tailwind CSS | 4.1 | Utility-First Styling |
| React Router | 7.13 | Client-Side Routing |
| shadcn/ui + Radix UI | – | Barrierefreie UI-Primitives |
| Recharts | 2.15 | Diagramme (Dashboard) |
| Lucide React | – | Icons |

## Architektur-Übersicht

```
┌─────────────────────────────────────────────┐
│  main.tsx                                   │
│  └── <App />                                │
│       ├── AuthProvider  (Benutzer-State)    │
│       ├── CartProvider  (Warenkorb-State)   │
│       └── RouterProvider                    │
│            └── Layout (Header + Footer)     │
│                 └── Seiten via <Outlet />   │
└─────────────────────────────────────────────┘
```

## Datenfluss

1. **AuthContext** – Verwaltet Benutzerdaten (Login, Registrierung, Adressen). Stellt `user`, `login()`, `logout()`, `register()` bereit.
2. **CartContext** – Verwaltet den Warenkorb. Stellt `items`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `totalItems`, `totalPrice` bereit.
3. **Produkte** – Statisch in `data/products.ts` definiert (3 Süßwaren-Produkte mit Bild, Preis, Details).
4. **Routing** – Alle Seiten sind als Kinder des `Layout`-Wrappers definiert. React Router v7 mit `createBrowserRouter`.
