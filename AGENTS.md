# PictRider

## Project overview

**PictRider** is a web-based tool for generating pairwise test cases quickly and easily, with no installation required.

### Core Purpose:

PictRider implements pairwise testing—a combinatorial testing technique that reduces the number of test cases while maintaining high coverage by ensuring all possible combinations of input values for every pair of parameters are tested.

### Key Features:

- Define test parameters and their possible values
- Create complex constraints between parameters
- Generate optimized test cases covering all pairwise combinations
- View and export generated test cases
- Browser-based with no installation needed

### Technology Stack:

- React 19 + TypeScript with Vite
- Tailwind CSS for styling
- PICT WASM (@takeyaqa/pict-wasm) for test case generation
- Vitest for unit testing
- Playwright for E2E testing
- pnpm workspace management

### Why Pairwise Testing:

Most defects result from interactions between two parameters rather than multiple simultaneous factors. Pairwise testing is especially effective when you need to cover wide parameter combinations, full combinatorial testing is impractical, or you want to systematically reduce redundant test cases without sacrificing coverage quality.

### Project Status:

Open-source, inspired by PictMaster, independent of Microsoft Corporation, and provided "as is" without warranty.

## Build and test commands

- Install dependencies:
  ```bash
   pnpm install
   pnpm exec playwright install --with-deps
  ```
- Run `pnpm run dev` to start development server (http://localhost:5173)
- Run `pnpm run build` to build for production
- Run `pnpm run preview` to preview production build
- Run `pnpm run test:run` to run unit tests with Vitest
- Run `pnpm run test:run:coverage` to generate test coverage report
- Run `pnpm run test:e2e` to run end-to-end tests with Playwright
- Run `pnpm run typecheck` to check types
- Run `pnpm run lint` to check lint
- Run `pnpm run fmt:check` to check format style

## Project Structure

```
src/
├── App.tsx                          # Main application component with providers
├── main.tsx                         # Entry point
├── types.ts                         # Core TypeScript interfaces
├── styles.css                       # Global styles
├── features/                        # Feature modules (organized by domain)
│   ├── config/                      # Configuration state management
│   ├── model/                       # Model state management (parameters, constraints, submodels)
│   ├── result/                      # Result display
│   └── menu/                        # Menu navigation
├── layouts/                         # Layout components
│   ├── TopPanel.tsx                # Header area
│   ├── MainArea.tsx                # Main content area with PICT runner
│   └── BottomPanel.tsx             # Footer area
├── shared/                          # Shared utilities and components
│   ├── components/                  # Reusable UI components
│   ├── helpers/                     # Utility functions
│   │   ├── pict-runner-helper.ts   # PICT execution and data transformation
│   │   ├── constraints-helper.ts   # Constraint validation and processing
│   │   └── util.ts                 # General utilities (UUID generation, etc.)
│   └── hooks/
│       └── usePictRunner.ts        # Hook for running PICT with error handling
└── pict-constraints-parser/         # PICT constraint parsing
```

## Core Data Types

All types are defined in [`src/types.ts`](src/types.ts):

## State Management

PictRider uses React Context API with useReducer for state management:

## Environment Variables

Configure via `.env` file (copy from `.env.example`):

| Variable                    | Description                  | Default                 |
| --------------------------- | ---------------------------- | ----------------------- |
| `VITE_APP_VERSION`          | Application version          | `development`           |
| `VITE_BASE_DOMAIN`          | Base domain for analytics    | `pictrider.example.com` |
| `VITE_NOTIFICATION_MESSAGE` | Optional notification banner | (empty)                 |

## Testing

### Unit Tests

- Framework: Vitest
- Location: `**/*.spec.ts` and `**/*.spec.tsx`
- Run: `pnpm run test:run`
- Coverage: `pnpm run test:run:coverage`

### E2E Tests

- Framework: Playwright
- Location: `e2e/`
- Run: `pnpm run test:e2e`
- Configuration: [`playwright.config.ts`](playwright.config.ts)

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration: [`eslint.config.js`](eslint.config.js)
- Prettier formatting: [`.prettierrc`](.prettierrc)
- Run `pnpm run lint` and `pnpm run fmt` before committing

### Component Patterns

- Functional components with hooks
- Context API for state management
- Tailwind CSS for styling
- Shared components in `src/shared/components/`

## Build Configuration

- **Bundler**: Vite (configured in [`vite.config.ts`](vite.config.ts))
- **PWA**: Enabled via vite-plugin-pwa for offline support
- **Tailwind**: Integrated via @tailwindcss/vite
- **License**: Third-party licenses output to `dist/license.md`
- **WASM**: @takeyaqa/pict-wasm excluded from optimization
