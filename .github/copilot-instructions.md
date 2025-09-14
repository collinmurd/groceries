# Copilot Instructions for Groceries Repository

## Repository Overview

This repository contains a grocery list management application with a full-stack TypeScript architecture. It's a monorepo containing three workspaces organized as separate packages:

- **App**: Next.js 15 React frontend using Mantine UI components and Jest for testing
- **Server**: Express.js backend API with MongoDB and Mongoose ODM
- **Shared**: TypeScript types and interfaces shared between frontend and backend

**Repository Size**: ~280 source files (excluding node_modules)  
**Languages**: TypeScript, JavaScript, React JSX  
**Runtime**: Node.js 22 (CI), supports Node.js 20+  
**Database**: MongoDB 7  
**Deployment**: Docker containers via GitHub Container Registry

## Build & Development Requirements

### Prerequisites
- **Node.js**: Version 20+ (CI uses Node.js 22)
- **npm**: Latest version (uses workspaces feature)
- **Docker**: Required for local development and deployment
- **MongoDB**: Required for server functionality

### Environment Setup

**ALWAYS run these commands in this exact order:**

1. **Install dependencies** (required before any other operations):
   ```bash
   npm install
   ```

2. **Build the project** (builds all workspaces via TypeScript project references):
   ```bash
   npm run build
   ```

### Individual Workspace Commands

**App workspace (Next.js frontend)**:
```bash
# Development server (requires build first)
npm run dev --workspace=app

# Production build (takes ~30-60 seconds)
npm run build --workspace=app

# Run tests (works reliably)
npm run test --workspace=app

# Start production server
npm run start --workspace=app
```

**Server workspace (Express.js API)**:
```bash
# Development with hot reload
npm run dev --workspace=server

# Production build 
npm run build --workspace=server

# Start production server (requires MongoDB)
npm run start --workspace=server

# Test command (placeholder - no actual tests)
npm run test --workspace=server
```

**Shared workspace (TypeScript types)**:
```bash
# Build types
npm run build --workspace=shared
```

### Docker Development

**Local development environment**:
```bash
# Start all services (app, server, MongoDB)
docker compose -f docker-compose-dev.yaml up

# Services available at:
# - App: http://localhost:3000
# - Server API: http://localhost:8000
# - MongoDB: localhost:27017
```

## Testing Strategy

- **App tests**: Use Jest with React Testing Library, run via `npm run test --workspace=app`
- **Server tests**: Currently placeholder only (`echo "write some damn tests"`)
- **Integration**: No automated integration tests currently implemented
- **Manual testing**: Use Docker Compose for full-stack testing

## CI/CD Pipeline

**GitHub Actions Workflows**:

1. **build-component.yaml**: Builds individual components
   - Runs on `ubuntu-24.04-arm` 
   - Node.js 22, caches node_modules
   - Runs unit tests for specified workspace
   - Builds Docker images and pushes to GitHub Container Registry

2. **build-deploy.yaml**: Orchestrates full deployment
   - Builds both app and server components
   - Deploys to production server (149.130.209.48)
   - Uses SSH key authentication

**Container Images**: Published to `ghcr.io/collinmurd/groceries-{app|server}`

## Project Architecture

### Directory Structure
```
/
├── .github/workflows/     # CI/CD pipeline definitions
├── .devcontainer/         # VS Code dev container config
├── .vscode/               # VS Code workspace settings
├── app/                   # Next.js frontend workspace
│   ├── src/app/           # Next.js App Router pages & components
│   ├── src/components/    # Reusable React components
│   ├── src/context/       # React context providers
│   ├── src/services/      # API client code
│   ├── jest.config.ts     # Jest testing configuration
│   ├── .eslintrc.json     # ESLint configuration
│   └── Dockerfile         # App container definition
├── server/                # Express.js backend workspace  
│   ├── src/               # Server source code
│   ├── src/models/        # Mongoose model definitions
│   └── Dockerfile         # Server container definition
├── shared/                # Shared TypeScript definitions
│   └── index.ts           # Exports IItem and IFeature interfaces
├── package.json           # Root workspace configuration
├── tsconfig.json          # TypeScript project references
├── docker-compose-dev.yaml     # Local development setup
└── docker-compose-prod.yaml    # Production deployment
```

### Key Configuration Files

- **`package.json`**: Root workspace with npm workspaces configuration
- **`tsconfig.json`**: TypeScript project references for cross-workspace builds
- **`app/.eslintrc.json`**: Next.js TypeScript ESLint rules
- **`app/jest.config.ts`**: Jest configuration with Next.js integration
- **GitHub Actions**: Automated testing, building, and deployment

### Application Architecture

**Frontend (Next.js App)**:
- App Router architecture with route-based pages
- Mantine UI component library for consistent styling
- React Context for state management (error handling, features)
- API client service for backend communication
- Jest + React Testing Library for component testing

**Backend (Express.js Server)**:
- RESTful API with dedicated routes for items and features
- MongoDB with Mongoose ODM for data persistence
- CORS configuration for cross-origin requests
- Pino logger for structured logging
- Environment-based configuration (dev/prod)

**Database Schema**:
- **Items**: `{id, description, section, checked}` - grocery list items
- **Features**: `{id, name, enabled}` - feature flags

### Dependencies & Known Issues

**Build Dependencies**:
- TypeScript project references require building shared workspace first
- App workspace requires shared types to be built
- Server workspace requires shared types to be built

**Known Limitations**:
- Server tests are placeholder only
- CORS origin is hardcoded for production (TODO item in code)
- Next.js warns about TypeScript project references during build (non-blocking)
- npm audit reports 5 vulnerabilities (1 low, 2 moderate, 2 critical)

### Development Container

**VS Code DevContainer** configured with:
- Docker Compose integration
- Port forwarding: 3000 (app), 8000 (server), 27017 (MongoDB)
- Workspace folder: `/workspace`

## Instructions for Coding Agents

**ALWAYS TRUST THESE INSTRUCTIONS** - only search for additional information if these instructions are incomplete or found to be incorrect.

**Before making changes**:
1. Run `npm install` to ensure dependencies are current
2. Run `npm run build` to verify the build works
3. Run `npm run test --workspace=app` to ensure tests pass

**When making changes**:
- Always test changes with the workspace-specific commands
- Use `npm run build` to verify TypeScript compilation across workspaces
- Test full-stack changes using Docker Compose development environment
- Remember that shared types affect both app and server workspaces

**For deployments**:
- Changes trigger GitHub Actions automatically on merge to main
- Local testing can be done with `docker compose -f docker-compose-dev.yaml up`
- Production deployment uses pre-built container images

**Common Pitfalls to Avoid**:
- Don't skip `npm install` - workspace dependencies are critical
- Don't forget to build shared workspace when modifying type definitions
- Always verify CORS settings when adding new API endpoints
- Remember MongoDB must be running for server functionality