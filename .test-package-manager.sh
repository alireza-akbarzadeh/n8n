#!/bin/bash
echo "🧪 Testing Package Manager Enforcement"
echo "======================================="
echo ""

echo "✅ Testing pnpm (should work):"
pnpm --version && echo "   ✓ pnpm is allowed" || echo "   ✗ pnpm failed"
echo ""

echo "❌ Testing npm (should be blocked):"
timeout 2 npm install --dry-run 2>&1 | grep -q "only-allow" && echo "   ✓ npm is blocked by preinstall hook" || echo "   ⚠ npm might not be blocked"
echo ""

echo "❌ Testing yarn (should be blocked):"
timeout 2 yarn install --dry-run 2>&1 | grep -q "packageManager" && echo "   ✓ yarn is blocked by Corepack" || echo "   ⚠ yarn might not be blocked"
echo ""

echo "📋 Configuration:"
echo "   packageManager: $(grep -A1 'packageManager' package.json | tail -1 | tr -d ' ,')"
echo "   preinstall: $(grep -A1 'preinstall' package.json | tail -1 | tr -d ' ,')"
