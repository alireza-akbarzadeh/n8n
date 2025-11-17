# NPM to PNPM Migration Guide

This project has been migrated from npm to pnpm for better performance and disk space efficiency.

## What Changed

### ✅ Completed Migration Steps

1. **Package Manager Lock**: Added `packageManager` field in `package.json`

   ```json
   "packageManager": "pnpm@8.6.12"
   ```

2. **Preinstall Hook**: Added script to enforce pnpm usage

   ```json
   "preinstall": "npx only-allow pnpm"
   ```

3. **Lock Files**:

   - ✅ Removed `package-lock.json`
   - ✅ Using `pnpm-lock.yaml`
   - ✅ Updated `.gitignore` to ignore npm/yarn lock files

4. **CI/CD**: Updated GitHub Actions workflows to use pnpm

5. **Documentation**: Updated README and testing docs

## For Developers

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
# or
npm install -g pnpm@8.6.12
```

Alternatively, use Corepack (built into Node.js 16.13+):

```bash
corepack enable
corepack prepare pnpm@8.6.12 --activate
```

### Common Commands

| npm                    | pnpm                                   |
| ---------------------- | -------------------------------------- |
| `npm install`          | `pnpm install`                         |
| `npm install <pkg>`    | `pnpm add <pkg>`                       |
| `npm install -D <pkg>` | `pnpm add -D <pkg>`                    |
| `npm uninstall <pkg>`  | `pnpm remove <pkg>`                    |
| `npm run <script>`     | `pnpm <script>` or `pnpm run <script>` |
| `npx <command>`        | `pnpm dlx <command>`                   |
| `npm update`           | `pnpm update`                          |
| `npm ci`               | `pnpm install --frozen-lockfile`       |

### First Time Setup

After pulling the repo:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test
```

### Why pnpm?

1. **Faster**: pnpm is typically 2x faster than npm
2. **Efficient**: Saves disk space through content-addressable storage
3. **Strict**: Better at catching dependency issues
4. **Compatible**: Works with the same `package.json` format

### Workspace Support

pnpm has excellent monorepo support. If this project grows into a monorepo, we can use `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Troubleshooting

#### Error: "use `pnpm install` to install"

This means you tried to use npm or yarn. The project enforces pnpm only. Install pnpm and use it instead.

#### Dependency Installation Issues

Clear the cache and reinstall:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Peer Dependency Warnings

pnpm is stricter about peer dependencies. If you see warnings:

```bash
# Auto-install peer dependencies
pnpm install --shamefully-hoist
```

However, it's better to properly declare them in `package.json`.

### IDE Integration

Most IDEs will automatically detect pnpm:

- **VS Code**: Install the "pnpm" extension for better integration
- **WebStorm**: Enable pnpm in Settings → Languages & Frameworks → Node.js and NPM

## Migration Benefits

✅ **Faster CI builds** - pnpm caches dependencies more efficiently
✅ **Reduced disk usage** - Content-addressable storage
✅ **Better security** - Strict dependency resolution
✅ **Improved reliability** - Consistent installs across environments

## References

- [pnpm Documentation](https://pnpm.io/)
- [pnpm vs npm](https://pnpm.io/feature-comparison)
- [pnpm Workspace](https://pnpm.io/workspaces)
