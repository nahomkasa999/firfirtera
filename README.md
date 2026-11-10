# Firfirtera

A bot with real users that matches people who want to eat with random people and get to know each other.

## Stack

Turborepo + TypeScript · Next.js 16 (web app in `apps/web`) · React 19 · Tailwind CSS 4 · TanStack Query · React Hook Form + Zod

## Run it

Requires Node >= 18 and pnpm 9.

```bash
pnpm install
pnpm dev     # turbo run dev
pnpm build   # turbo run build
pnpm lint    # turbo run lint
```

## Structure

```
apps/
  web/   # Next.js web app
  docs/  # docs app (Turborepo starter)
packages/
  @repo/ui                # shared React components
  @repo/eslint-config     # shared ESLint config
  @repo/typescript-config # shared tsconfig
```
