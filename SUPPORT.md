# Support

## Getting Help

Having trouble with Nodebase? Here's how to get help:

## 📚 Documentation

Before opening an issue, please check our documentation:

- [README.md](./README.md) - Overview and quick start
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Project structure
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute

## 💬 Community Support

### GitHub Discussions

For questions, ideas, and discussions:

- [Ask Questions](https://github.com/alireza-akbarzadeh/n8n/discussions/categories/q-a)
- [Share Ideas](https://github.com/alireza-akbarzadeh/n8n/discussions/categories/ideas)
- [Show and Tell](https://github.com/alireza-akbarzadeh/n8n/discussions/categories/show-and-tell)

### GitHub Issues

For bugs and feature requests:

- [Report a Bug](https://github.com/alireza-akbarzadeh/n8n/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/alireza-akbarzadeh/n8n/issues/new?template=feature_request.md)

## 🔍 Common Issues

### Installation Problems

**Issue**: `pnpm install` fails

```bash
# Solution: Clear pnpm cache
pnpm store prune
pnpm install
```

**Issue**: Database connection errors

```bash
# Solution: Check PostgreSQL is running
brew services list  # macOS
systemctl status postgresql  # Linux

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

### Development Issues

**Issue**: Port 3000 already in use

```bash
# Solution: Kill the process
lsof -ti:3000 | xargs kill -9
```

**Issue**: Prisma Client out of sync

```bash
# Solution: Regenerate Prisma Client
pnpm db:generate
```

**Issue**: TypeScript errors after pulling changes

```bash
# Solution: Clean and reinstall
rm -rf node_modules .next
pnpm install
pnpm db:generate
```

### Testing Issues

**Issue**: Tests fail locally but pass in CI

```bash
# Solution: Use the same environment
NODE_ENV=test pnpm test
```

**Issue**: E2E tests fail

```bash
# Solution: Install Playwright browsers
pnpm exec playwright install
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Clear description** - What went wrong?
2. **Steps to reproduce** - How can we reproduce it?
3. **Expected vs actual** - What should happen vs what happened?
4. **Environment** - OS, Node version, browser
5. **Error messages** - Full error logs
6. **Screenshots** - If applicable

Use our [bug report template](https://github.com/alireza-akbarzadeh/n8n/issues/new?template=bug_report.md).

## 💡 Feature Requests

When requesting features, include:

1. **Use case** - Why do you need this?
2. **Proposed solution** - How should it work?
3. **Alternatives** - What other approaches did you consider?
4. **Benefits** - Who would benefit from this?

Use our [feature request template](https://github.com/alireza-akbarzadeh/n8n/issues/new?template=feature_request.md).

## 🔒 Security Issues

**Do not** report security vulnerabilities through public GitHub issues.

Instead, please report them to our security team. See [SECURITY.md](./SECURITY.md) for details.

## ⏱️ Response Times

We aim to respond to:

- **Critical bugs**: Within 24 hours
- **Regular bugs**: Within 3-5 days
- **Feature requests**: Within 1 week
- **Questions**: Within 2-3 days

Response times may vary based on maintainer availability.

## 👥 Community Guidelines

Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) in all interactions.

- Be respectful and inclusive
- Provide constructive feedback
- Help others when you can
- Stay on topic

## 🌟 Ways to Help

You don't need to be a developer to help:

- Answer questions in discussions
- Improve documentation
- Report bugs
- Test new features
- Share the project
- Write tutorials
- Translate documentation

## 📧 Contact

For other inquiries:

- **General questions**: [GitHub Discussions](https://github.com/alireza-akbarzadeh/n8n/discussions)
- **Security issues**: See [SECURITY.md](./SECURITY.md)
- **Business inquiries**: [Your email here]

---

## 🙏 Thank You

Thank you for using Nodebase! We appreciate your support and contributions to making this project better for everyone.
