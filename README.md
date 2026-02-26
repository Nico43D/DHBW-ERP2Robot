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

Starte den Entwicklungsserver:

```bash
npm run dev
```

Die Anwendung ist dann im Browser unter [http://localhost:5173](http://localhost:5173) erreichbar.

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
| Recharts | Diagramme |

## Architektur

Eine ausführliche Dokumentation der Projektarchitektur, Ordnerstruktur und des Datenflusses befindet sich in der [ARCHITECTURE.md](ARCHITECTURE.md).

## Quellen & Lizenzen

- UI-Komponenten basieren auf [shadcn/ui](https://ui.shadcn.com/), verwendet unter [MIT-Lizenz](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).
- Produktfotos stammen von [Unsplash](https://unsplash.com), verwendet unter der [Unsplash-Lizenz](https://unsplash.com/license).
- Das ursprüngliche Design basiert auf einem [Figma-Projekt](https://www.figma.com/design/o305f8TipHjElF629FAhSd/E-commerce-website-design).
  