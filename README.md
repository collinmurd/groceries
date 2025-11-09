# Groceries

A full-stack grocery list management application with AI-powered ingredient parsing capabilities.

## Overview

Groceries is a modern web application that helps you manage your shopping lists efficiently. Built with a monorepo architecture, it features a Next.js frontend, Express.js backend, and integrates AI capabilities to automatically parse recipe ingredients from text or URLs.

### Key Features

- ✅ **Interactive Grocery List**: Add, check off, and organize items by section
- 🤖 **AI Ingredient Parser**: Paste recipe text or URLs to automatically extract and categorize ingredients
- 🔐 **Authentication**: Secure user authentication with JWT tokens
- 🎛️ **Feature Flags**: Toggle features on/off without code changes
- 📱 **Responsive Design**: Built with Mantine UI components for a modern, accessible interface
- 🐳 **Docker Support**: Easy deployment with Docker and Docker Compose

## Architecture

This is a TypeScript monorepo containing three workspaces:

```
groceries/
├── app/           # Next.js 15 frontend application
├── server/        # Express.js backend API
└── shared/        # Shared TypeScript types and interfaces
```

### Technology Stack

**Frontend (App)**
- Next.js 15 (React 18)
- Mantine UI components
- TypeScript
- Jest & React Testing Library

**Backend (Server)**
- Express.js
- MongoDB (Mongoose ODM)
- TypeScript
- Oracle Cloud Infrastructure (OCI) AI Integration
- Pino logging

**Shared**
- TypeScript interfaces for type safety across the stack

## Prerequisites

- **Node.js**: Version 20 or higher (CI uses Node.js 22)
- **npm**: Latest version (uses workspaces feature)
- **MongoDB**: Version 7 or compatible
- **Docker** (optional): For containerized deployment

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/collinmurd/groceries.git
   cd groceries
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build all workspaces:**
   ```bash
   npm run build
   ```

## Development

### Local Development Setup

#### Option 1: Using Docker Compose (Recommended)

Start all services (app, server, and MongoDB) with a single command:

```bash
docker compose -f docker-compose-dev.yaml up
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

#### Option 2: Manual Setup

1. **Start MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 mongo:7
   
   # Or use a local MongoDB installation
   ```

2. **Start the backend server (in development mode):**
   ```bash
   npm run dev --workspace=server
   ```

3. **Start the frontend app (in a separate terminal):**
   ```bash
   npm run dev --workspace=app
   ```

### Available Scripts

**Root workspace:**
```bash
npm run build          # Build all workspaces using TypeScript project references
npm run app            # Start the app in production mode
npm run server         # Start the server in production mode
```

**App workspace:**
```bash
npm run dev --workspace=app      # Start development server
npm run build --workspace=app    # Build for production
npm run start --workspace=app    # Start production server
npm run test --workspace=app     # Run Jest tests
```

**Server workspace:**
```bash
npm run dev --workspace=server     # Start with hot reload (nodemon)
npm run build --workspace=server   # Compile TypeScript
npm run start --workspace=server   # Start production server
npm run test --workspace=server    # Run tests (placeholder)
```

**Shared workspace:**
```bash
npm run build --workspace=shared   # Build shared types
```

## Testing

The application uses Jest for unit and component testing:

```bash
# Run all app tests
npm run test --workspace=app

# Run tests in watch mode
npm run test --workspace=app -- --watch
```

**Test Coverage:**
- Component tests for React components (Item, Section, List)
- Integration tests for main page functionality
- Test utilities and custom render functions included

## Project Structure

```
groceries/
├── .devcontainer/           # VS Code dev container configuration
├── .github/
│   ├── workflows/           # CI/CD pipeline definitions
│   └── copilot-instructions.md
├── .vscode/                 # VS Code workspace settings
├── app/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages & components
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context providers
│   │   └── services/       # API client code
│   ├── Dockerfile
│   ├── jest.config.ts
│   └── package.json
├── server/
│   ├── src/
│   │   ├── models/         # Mongoose model definitions
│   │   ├── oci/            # Oracle Cloud Infrastructure integration
│   │   ├── ai.ts           # AI ingredient parsing logic
│   │   ├── auth.ts         # Authentication logic
│   │   └── index.ts        # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── shared/
│   ├── constants.ts
│   ├── index.ts           # Exported interfaces (IItem, IFeature, etc.)
│   └── package.json
├── docker-compose-dev.yaml   # Local development setup
├── docker-compose-prod.yaml  # Production deployment
├── package.json              # Root workspace configuration
└── tsconfig.json             # TypeScript project references
```

## Data Models

### Item (Grocery List Item)
```typescript
interface IItem {
  id: string | null;
  description: string;
  section: string;      // e.g., "Produce", "Dairy", "Meat"
  checked: boolean;
}
```

### Feature (Feature Flag)
```typescript
interface IFeature {
  id: string | null;
  name: string;
  enabled: boolean;
}
```

## API Endpoints

### Items
- `GET /items` - Get all grocery items
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Features
- `GET /features` - Get all feature flags
- `POST /features` - Create a feature flag
- `PUT /features/:id` - Update a feature flag
- `DELETE /features/:id` - Delete a feature flag

### AI
- `POST /ai/parse-ingredients` - Parse ingredients from recipe text or URL
  - Body: `{ recipeText: string }` OR `{ recipeUrl: string }`

### Authentication
- `POST /login` - Authenticate user and get JWT token

## Deployment

### CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

**Workflows:**
1. **`build-component.yaml`**: Builds individual components
   - Runs unit tests
   - Builds Docker images
   - Pushes images to GitHub Container Registry

2. **`build-deploy.yaml`**: Orchestrates full deployment
   - Builds both app and server
   - Deploys to production server
   - Uses SSH for remote deployment

**Container Registry**: Images are published to `ghcr.io/collinmurd/groceries-{app|server}`

### Manual Deployment

#### Using Docker Compose (Production)

```bash
docker compose -f docker-compose-prod.yaml up -d
```

This will:
- Pull the latest images from GitHub Container Registry
- Start the app, server, and MongoDB
- Set up persistent data volumes

#### Environment Variables

**Server:**
- `MONGO_HOST`: MongoDB connection host (default: `127.0.0.1`)
- `ENV`: Environment mode (`dev` or `prod`)
- `PORT`: Server port (default: `8000`)
- `OCI_COMPARTMENT_ID`: Oracle Cloud compartment ID (for AI features)
- `OCI_INFERENCE_MODEL_ID`: OCI AI model ID (for ingredient parsing)

## Development Container

The repository includes a VS Code devcontainer configuration for consistent development environments:

- Pre-configured with Docker Compose integration
- Automatic port forwarding (3000, 8000, 27017)
- Workspace folder mounted at `/workspace`

## Known Issues & TODO

- Server tests are currently placeholders and need implementation
- CORS origin is hardcoded for production environment
- npm audit reports some vulnerabilities in dependencies
- Authentication system could be enhanced with refresh tokens

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

Collin Murd

---

For more detailed development instructions and coding guidelines, see [.github/copilot-instructions.md](.github/copilot-instructions.md).