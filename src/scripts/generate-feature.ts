#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate Feature Structure Script
 *
 * Usage: pnpm run generate-feature <feature-name>
 * Example: pnpm run generate-feature billing
 */

const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Error: Feature name is required');
  console.log('Usage: pnpm run generate-feature <feature-name>');
  console.log('Example: pnpm run generate-feature billing');
  process.exit(1);
}

// Validate feature name (lowercase, alphanumeric, hyphens only)
if (!/^[a-z0-9-]+$/.test(featureName)) {
  console.error('❌ Error: Feature name must be lowercase alphanumeric with hyphens only');
  process.exit(1);
}

const featuresDir = path.join(process.cwd(), 'src', 'features');
const featureDir = path.join(featuresDir, featureName);

// Check if feature already exists
if (fs.existsSync(featureDir)) {
  console.error(`❌ Error: Feature "${featureName}" already exists`);
  process.exit(1);
}

// Define the folder structure
interface FolderConfig {
  folders?: string[];
  files: string[];
}

const structure: Record<string, FolderConfig> = {
  api: {
    files: ['index.ts'],
  },
  application: {
    folders: ['use-cases', 'dto'],
    files: ['index.ts'],
  },
  domain: {
    folders: ['entities', 'repositories', 'services'],
    files: ['index.ts'],
  },
  infrastructure: {
    folders: ['mappers', 'repositories', 'services'],
    files: ['index.ts'],
  },
  presentation: {
    folders: ['ui', 'hooks', 'containers'],
    files: ['index.ts'],
  },
};

// Create main feature directory
console.log(`📁 Creating feature: ${featureName}`);
fs.mkdirSync(featureDir, { recursive: true });

// Create root index.ts
const rootIndexContent = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Feature Module
 *
 * This module follows Clean Architecture principles:
 * - api: tRPC routers and API endpoints
 * - application: Use cases and DTOs
 * - domain: Entities, repositories, and business logic
 * - infrastructure: Implementations (mappers, repositories, services)
 * - presentation: UI components, hooks, and containers
 */

export * from './api';
export * from './application';
export * from './domain';
export * from './infrastructure';
export * from './presentation';
`;

fs.writeFileSync(path.join(featureDir, 'index.ts'), rootIndexContent);
console.log(`  ✓ Created index.ts`);

// Create folder structure
for (const [folderName, config] of Object.entries(structure)) {
  const folderPath = path.join(featureDir, folderName);
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`  ✓ Created ${folderName}/`);

  // Create subfolders if defined
  if (config.folders) {
    for (const subfolder of config.folders) {
      const subfolderPath = path.join(folderPath, subfolder);
      fs.mkdirSync(subfolderPath, { recursive: true });

      // Create index.ts in each subfolder
      const subIndexContent = `export {};\n`;
      fs.writeFileSync(path.join(subfolderPath, 'index.ts'), subIndexContent);
      console.log(`    ✓ Created ${folderName}/${subfolder}/index.ts`);
    }
  }

  // Create files
  if (config.files) {
    for (const file of config.files) {
      const filePath = path.join(folderPath, file);
      let content = '';

      // Generate appropriate content based on the folder
      if (folderName === 'api') {
        content = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} API Routes
 *
 * Define tRPC routers and API endpoints here
 */

export {};\n`;
      } else if (folderName === 'application') {
        content = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Application Layer
 *
 * Export use cases and DTOs
 */

export * from './use-cases';
export * from './dto';
`;
      } else if (folderName === 'domain') {
        content = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Domain Layer
 *
 * Export domain entities, repositories, and services
 */

export * from './entities';
export * from './repositories';
export * from './services';
`;
      } else if (folderName === 'infrastructure') {
        content = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Infrastructure Layer
 *
 * Export mappers, repository implementations, and services
 */

export * from './mappers';
export * from './repositories';
export * from './services';
`;
      } else if (folderName === 'presentation') {
        content = `/**
 * ${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Presentation Layer
 *
 * Export UI components, hooks, and containers
 */

export * from './ui';
export * from './hooks';
export * from './containers';
`;
      }

      fs.writeFileSync(filePath, content);
      console.log(`    ✓ Created ${folderName}/${file}`);
    }
  }
}

console.log(`\n✅ Feature "${featureName}" created successfully!`);
console.log(`\n📂 Location: src/features/${featureName}`);
console.log('\n📋 Next steps:');
console.log(`  1. Add domain entities in domain/entities/`);
console.log(`  2. Define repository interfaces in domain/repositories/`);
console.log(`  3. Create use cases in application/use-cases/`);
console.log(`  4. Implement repositories in infrastructure/repositories/`);
console.log(`  5. Add UI components in presentation/ui/`);
console.log(`  6. Create API routes in api/\n`);
