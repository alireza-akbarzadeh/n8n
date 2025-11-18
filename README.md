# 🚀 Nodebase - Workflow Automation Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Tests-80%20passing-success)](./tests)

A modern, scalable workflow automation platform built with **Clean Architecture**, **Domain-Driven Design**, and **TypeScript**.

---

## 🎯 Overview

Nodebase is a workflow automation platform that allows users to create, manage, and execute complex workflows visually. Built with enterprise-grade architecture and modern technologies.

### ✨ Key Features

- 🎨 **Visual Workflow Editor** - Drag-and-drop interface using React Flow
- 🔐 **Multi-Provider Auth** - GitHub, Google, and email authentication
- 📊 **Real-time Monitoring** - Track workflow executions in real-time
- 🎯 **Type-safe APIs** - Full type safety with tRPC
- 🧪 **Comprehensive Testing** - 80+ unit, integration, and E2E tests
- 🔄 **Background Jobs** - Reliable execution with Inngest
- 🗃️ **PostgreSQL** - Type-safe database access with Prisma

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, diagrams, and patterns
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete guide for new developers
- **[.env.example](./.env.example)** - Environment variables reference

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# 1. Install pnpm
npm install -g pnpm

# 2. Clone and install
git clone <repo-url>
cd n8n
pnpm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up database
pnpm db:generate
pnpm db:migrate

# 5. Start development (all services)
pnpm dev:all
```

Open [http://localhost:3000](http://localhost:3000)

**For detailed setup instructions, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (UI)
├── features/              # Feature modules (Clean Architecture)
│   ├── workflows/         # Workflow management
│   │   ├── domain/        # Business logic (entities, interfaces)
│   │   ├── application/   # Use cases (business operations)
│   │   ├── infrastructure/# Implementations (Prisma, APIs)
│   │   ├── api/           # tRPC routers
│   │   └── ui/            # React components
│   ├── auth/              # Authentication
│   ├── executions/        # Execution tracking
│   └── triggers/          # Trigger management
├── shared/                # Shared domain & infrastructure
├── components/            # Reusable UI components
└── trpc/                  # API configuration
```

**For detailed structure explanation, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server
pnpm dev:all          # Start all services (Next.js + DB + Inngest)
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations
pnpm db:reset         # Reset database

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm e2e              # Run E2E tests

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
```

**For complete scripts documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#-useful-scripts--utils)**

---

## 🏛️ Architecture

This project follows **Clean Architecture** with **Domain-Driven Design**:

```
┌─────────────────────────────────────┐
│  Presentation (React, Next.js)      │
├─────────────────────────────────────┤
│  API (tRPC Routers)                 │
├─────────────────────────────────────┤
│  Application (Use Cases)            │
├─────────────────────────────────────┤
│  Domain (Entities, Business Logic)  │  ← No dependencies
├─────────────────────────────────────┤
│  Infrastructure (Prisma, APIs)      │
└─────────────────────────────────────┘
```

**Key Principles:**

- ✅ **Domain Independence** - Business logic has no external dependencies
- ✅ **Dependency Inversion** - Infrastructure implements domain interfaces
- ✅ **Testability** - Each layer can be tested independently
- ✅ **Scalability** - Easy to add features and swap implementations

**For detailed architecture diagrams and explanations, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🧪 Testing

We maintain high test coverage with three testing layers:

```bash
# Unit Tests (Domain & Application)
pnpm test                    # 80 tests passing

# Integration Tests (with database)
pnpm test tests/integration

# End-to-End Tests (full user flows)
pnpm e2e                     # Playwright
pnpm e2e:ui                  # Open Playwright UI
```

**Test Structure:**

```
tests/
├── unit/              # Entity & use case tests
│   ├── workflows/     # Workflow entity tests
│   ├── auth/          # User entity tests
│   └── executions/    # Execution entity tests
├── integration/       # Repository & API tests
└── e2e/               # User flow tests
```

---

## 🛠️ Tech Stack

### Core

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling

### Backend

- **tRPC** - Type-safe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Better Auth** - Authentication
- **Inngest** - Background jobs

### Frontend

- **React Flow** - Workflow visualization
- **Radix UI** - Accessible components
- **Tanstack Query** - Data fetching
- **Zod** - Validation

### Development

- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Linting
- **Prettier** - Formatting

---

## 📖 Learning Path

### For New Developers

**Week 1: Setup & Understanding**

1. Complete [Quick Start](#-quick-start)
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Explore the codebase (workflows feature)

**Week 2: First Change**

1. Follow [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
2. Make a small change (add a field)
3. Write tests for your change

**Week 3: First Feature**

1. Create a new entity
2. Add use cases
3. Create API endpoints
4. Write comprehensive tests

**Week 4: Advanced**

1. Add background jobs
2. Write E2E tests
3. Review PRs and best practices

---

# Scripts

## Generate Feature

This script generates a complete feature folder structure following Clean Architecture principles.

### Usage

```bash
pnpm run generate-feature <feature-name>
```

### Example

```bash
pnpm run generate-feature billing
```

This will create the following structure in `src/features/billing/`:

```
billing/
├── index.ts                      # Main feature export
├── api/                          # tRPC routers and API endpoints
│   └── index.ts
├── application/                  # Use cases and DTOs
│   ├── index.ts
│   ├── use-cases/
│   │   └── index.ts
│   └── dto/
│       └── index.ts
├── domain/                       # Entities, repositories, and business logic
│   ├── index.ts
│   ├── entities/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   └── services/
│       └── index.ts
├── infrastructure/               # Implementations (mappers, repositories, services)
│   ├── index.ts
│   ├── mappers/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   └── services/
│       └── index.ts
└── presentation/                 # UI components, hooks, and containers
    ├── index.ts
    ├── ui/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    └── containers/
        └── index.ts
```

### Development Workflow

After generating a feature, follow these steps:

1. **Define Domain Entities** in `domain/entities/`
   - Create entity classes with business logic
   - Follow the Result pattern for error handling

2. **Define Repository Interfaces** in `domain/repositories/`
   - Create interfaces for data access
   - Keep them in the domain layer (dependency inversion)

3. **Create Use Cases** in `application/use-cases/`
   - Implement business logic orchestration
   - Use cases should depend on repository interfaces

4. **Implement Repositories** in `infrastructure/repositories/`
   - Create Prisma repository implementations
   - Implement the interfaces from the domain layer

5. **Create Mappers** in `infrastructure/mappers/`
   - Map between domain entities and Prisma models
   - Keep domain entities pure and free from ORM dependencies

6. **Add UI Components** in `presentation/ui/`
   - Create React components
   - Use hooks for state management

7. **Create API Routes** in `api/`
   - Define tRPC routers
   - Connect use cases to API endpoints

### Rules

- Feature names must be lowercase alphanumeric with hyphens only (e.g., `billing`, `user-management`)
- The script will fail if a feature with the same name already exists
- All folders come with `index.ts` files for easier exports

### Clean Architecture Principles

The generated structure follows Clean Architecture:

- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Application Layer**: Use cases that orchestrate domain entities
- **Infrastructure Layer**: External concerns (database, APIs, file system)
- **Presentation Layer**: UI components and user interaction
- **API Layer**: HTTP/tRPC endpoints and routing

Dependencies flow inward:

```
Presentation → Application → Domain ← Infrastructure
      ↓                                      ↓
      └──────────────→ API ←─────────────────┘
```

## 🤝 Contributing

1. **Read the guides**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system
   - [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development workflow

2. **Follow conventions**

   ```bash
   git commit -m "feat: add workflow templates"
   git commit -m "fix: resolve execution timeout"
   git commit -m "docs: update API documentation"
   ```

3. **Write tests**
   - Unit tests for domain logic
   - Integration tests for repositories
   - E2E tests for critical flows

4. **Code quality**
   ```bash
   pnpm lint          # Check linting
   pnpm format        # Format code
   pnpm test          # Run tests
   npx tsc --noEmit   # Check types
   ```

---

## 🔐 Environment Variables

**Required:**

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generate-with-openssl>
ENCRYPTION_KEY=<generate-with-openssl>
BETTER_AUTH_URL=http://localhost:3000
```

**Optional:**

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
INNGEST_EVENT_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
SENTRY_DSN=...
```

**See [.env.example](./.env.example) for complete list**

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
lsof -ti:3000 | xargs kill -9
```

**Prisma Client out of sync:**

```bash
pnpm db:generate
```

**Module not found:**

```bash
rm -rf .next && pnpm dev
```

**Database connection failed:**

```bash
# Check PostgreSQL is running
brew services list  # macOS
systemctl status postgresql  # Linux
```

**For more troubleshooting, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#-debugging-tips)**

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [React Flow](https://reactflow.dev/)
- [Radix UI](https://www.radix-ui.com/)

Inspired by Clean Architecture principles from Uncle Bob Martin.

---

**Happy Coding! 🚀**

For questions or support, check:

- 📖 [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- 🏛️ [ARCHITECTURE.md](./ARCHITECTURE.md)
- 💬 Team Slack: #nodebase-dev
