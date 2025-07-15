# Gemini Project Context: next-study

This document provides context for the Gemini AI assistant to understand and effectively assist with this project.

## Project Overview

This is a monorepo for studying and experimenting with Next.js and related technologies. The project is structured using pnpm workspaces and managed with Turborepo. It contains shared packages and individual topic-based applications.

## Tech Stack

- **Package Manager:** pnpm
- **Monorepo Tool:** Turborepo
- **Framework:** Next.js
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS (likely, given Next.js ecosystem)
- **Linting:** ESLint
- **Formatting:** Prettier

## Project Structure

- `packages/`: Contains shared packages used across the monorepo.
  - `eslint-config/`: Shared ESLint configurations.
  - `ts-config/`: Shared TypeScript `tsconfig.json` files.
  - `ui/`: A shared UI component library.
- `topics/`: Contains individual Next.js applications, each exploring a different topic.
  - `01-next-auth/`: Project for Next-Auth v4.
  - `02-next-auth-v5/`: Project for Next-Auth v5.
  - `03-monorepo/`: Project demonstrating monorepo setup.
  - `04-react-query/`: Project for React Query with Next.js.
- `turbo/`: Contains Turborepo generator configurations.

## Key Commands

- **Install dependencies:** `pnpm install`
- **Create Next.js app on `/topics` directory:** `pnpm create-topic`
- **Run development server of a specific package:** `pnpm turbo <package-name>#dev`
- **Build a specific package:** `pnpm turbo <package-name>#build`
- **Lint all packages:** `pnpm lint`
- **Format all files:** `pnpm format`

## Coding Style & Conventions

- **Linting:** Adhere to the rules defined in `eslint.config.[m]js` and the shared `eslint-config` packages. Run `pnpm lint` to check for issues.
- **Formatting:** Use Prettier for consistent code formatting. The configuration is in `prettier.config.js`. Run `pnpm format` to format the codebase.
- **Commits:** Follow conventional commit standards if applicable (check `git log`).
