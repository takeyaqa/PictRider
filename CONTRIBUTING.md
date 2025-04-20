# Contribution Guide

First off, thank you for considering contributing to PictRider! It's people like you that make PictRider such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by the [PictRider Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

- Reporting Bugs
- Suggesting Enhancements
- Pull Requests

## Development Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [pnpm](https://pnpm.io/) (v10 or higher)

### Setup Steps

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/PictRider.git
   cd PictRider
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your feature or bugfix:
   ```bash
   git switch -c feature/your-feature-name
   ```

### Environment Variables

PictRider uses environment variables for configuration. Copy the `.env.example` file to `.env` and adjust the values as needed:

```bash
cp .env.example .env
```

Available environment variables:

| Variable         | Description | Default               |
| ---------------- | ----------- | --------------------- |
| VITE_BASE_DOMAIN | Base domain | pictrider.example.com |

## Build and Test Commands

PictRider uses Vite, TypeScript, and Vitest for development. Here are the key commands you'll need:

### Development

Start the development server:

```bash
pnpm run dev
```

This will start a local development server at http://localhost:5173 (or another port if 5173 is in use).

### Type Checking

Run TypeScript type checking:

```bash
pnpm run typecheck
```

### Linting and Formatting

Check code style with ESLint:

```bash
pnpm run lint
```

Check formatting with Prettier:

```bash
pnpm run format
```

### Testing

Run unit tests with Vitest:

```bash
pnpm run test
```

Run end-to-end tests with Playwright:

```bash
pnpm run e2e
```

### Building for Production

Build the application for production:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```
