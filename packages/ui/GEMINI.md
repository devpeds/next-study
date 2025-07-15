# Gemini Project Context: @shared/ui

This document provides context for the Gemini AI assistant to understand and effectively assist with this project.

## Project Overview

This is a component library consumed by Next.js app on `next-study/topics/**`. The library must be built at `/dist` directory before consuming.

## Project Structure

- `lib/`: Contains shared react components, utils and styles
  - `cva/`: class-variant-authorities consumed by components
  - `components/`: Contains all basic components
  - `next/`: Contains Next.js-only components
    - `components/`: Contains Next.js-only components (ex. `Layout`, `Link`)
    - `index.ts`: entry file of the Next.js-only components
  - `index.ts`: entry file of library. All basic components and utils is exported here.
  - `styles.css`: Stylesheet file with tailwind configuration.
- `src/`: Contains code for an example application (SPA) for development

## Component Usage Guidelines

### Imports Components

All components from `@shared/ui` should be imported directly from the root package or from the `/next` subpath. Direct imports from deeper paths like `@shared/ui/typography` are not allowed due to the package's `exports` configuration.

```tsx
// For general UI components (e.g., Typography, Button, TextField)
import { H1, Button, TextField } from "@shared/ui";

// For Next.js specific components (e.g., Layout, Link)
import { Layout } from "@shared/ui/next";
```
