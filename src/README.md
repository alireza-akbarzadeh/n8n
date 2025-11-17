# Source Directory

This directory contains the refactored application following Clean Architecture and Domain-Driven Design principles.

## Structure

- **features/** - Domain features (vertical slices) with all layers
- **shared/** - Code shared across features
- **core/** - Core framework configuration and setup

## Architecture Layers

Each feature follows a 4-layer architecture:

1. **Domain Layer** (`domain/`) - Business logic, entities, and domain services
2. **Application Layer** (`application/`) - Use cases, DTOs, and application services
3. **Infrastructure Layer** (`infrastructure/`) - Database, external APIs, implementations
4. **Presentation Layer** (`ui/` + `/app`) - React components and Next.js pages

## Import Rules

- Domain layer should NOT import from other layers
- Application layer can import from Domain
- Infrastructure layer can import from Domain and Application
- UI layer can import from Application (use cases) and shared UI components

## Adding a New Feature

1. Create feature directory: `features/[feature-name]/`
2. Create layer subdirectories: `domain/`, `application/`, `infrastructure/`, `api/`, `ui/`
3. Start with domain entities and repositories (interfaces)
4. Implement use cases in application layer
5. Implement infrastructure (database, external services)
6. Create tRPC routers in api layer
7. Build UI components

See `ARCHITECTURE-REFACTOR.md` for detailed guidelines.
