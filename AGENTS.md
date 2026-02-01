# Agent Instructions for PictRider

## Overview

PictRider is a web-based pairwise testing tool built with React 19, TypeScript, Vite, and Tailwind CSS v4. It uses [@takeyaqa/pict-wasm](https://github.com/takeyaqa/pict-wasm) to generate combinatorial test cases in the browser.

## Build & Test Commands

```bash
# Set up Playwright (required for first-time setup)
pnpm exec playwright install --with-deps

# Install dependencies (pnpm 10.x required, Node 24.x)
pnpm install

# Vite build
pnpm run build

 # Start dev server at http://127.0.0.1:5173
pnpm run dev

# Lint and format
pnpm run fmt
pnpm run lint
pnpm run typecheck

# Unit tests (Vitest with browser mode via Playwright)
pnpm run test:run

# E2E tests (Playwright)
pnpm run test:e2e
```

## Architecture

### Feature-Based Structure

```
src/
├── features/           # Feature modules (self-contained)
│   ├── config/         # Global configuration state (Context + useReducer)
│   ├── model/          # Parameter/constraint model state and logic
│   ├── menu/           # Menu components
│   └── result/         # Result display components
├── layouts/            # Page layout components (TopPanel, BottomPanel, MainArea)
├── shared/             # Shared utilities
│   ├── components/     # Reusable UI components (Button, TextInput, Switch, etc.)
│   ├── helpers/        # Utility functions
│   └── hooks/          # Custom hooks (usePictRunner)
├── pict-constraints-parser/  # Constraint syntax parser/printer
└── types.ts            # Shared TypeScript interfaces
```

### State Management Pattern

- **Context + useReducer**: Used for global config (`ConfigProvider`) and model state
- Reducers are in `reducer.ts` files within feature directories
- Actions are discriminated unions with `type` and `payload`
- State is cloned with `structuredClone()` before modifications

### PICT Integration

The `usePictRunner` hook wraps `@takeyaqa/pict-wasm`. Components accept an optional `pictRunnerInjection` prop for testing with mocked WASM.

### Testing Approach

- **Unit tests** (`*.spec.tsx`): Use Vitest browser mode with `vitest-browser-react`. Tests render components and interact via `screen.getByRole()`.
- **E2E tests** (`tests/`): Playwright tests against the dev server. Follow AAA pattern with `// arrange`, `// act`, `// assert` comments.

## Conventions

- **TypeScript**: Strict mode with `typescript-eslint` strict + stylistic rules
- **Prettier** for formatting
- **React**: Functional components only, hooks for state/effects
- **IDs**: Use `uuidv4()` from `shared/helpers` for generating unique identifiers
- **Validation**: Input validation happens in reducers, setting `isValid*` flags on state objects
- **Before committing** - Always run `pnpm run fmt`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:run`, and `pnpm run test:e2e`
- **Ignore `pnpm-lock.yaml`** - Always skip this file during code review and pull request creation
