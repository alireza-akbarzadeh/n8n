# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The Nodebase team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

- **Security Email**: [Your security email - e.g., security@nodebase.io]

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

1. **Description** - A clear description of the vulnerability
2. **Impact** - What kind of vulnerability is it? Who is impacted?
3. **Steps to Reproduce** - Detailed steps to reproduce the issue
4. **Proof of Concept** - If possible, include a proof of concept
5. **Suggested Fix** - If you have ideas on how to fix it
6. **Your Contact Information** - So we can follow up with you

### Example Report

```
Subject: [SECURITY] SQL Injection in Workflow API

Description:
The workflow API endpoint is vulnerable to SQL injection attacks through
the 'name' parameter.

Impact:
Attackers can execute arbitrary SQL queries, potentially accessing or
modifying sensitive data in the database.

Steps to Reproduce:
1. Create a POST request to /api/trpc/workflows.create
2. Set the name parameter to: ' OR '1'='1'; DROP TABLE users; --
3. Observe that the query is executed without proper sanitization

Proof of Concept:
[Include code or screenshots]

Suggested Fix:
Use parameterized queries or Prisma's built-in query builder instead
of raw SQL.

Contact:
John Doe - john@example.com
```

## Security Best Practices

When contributing to this project, please follow these security best practices:

### Environment Variables

- **Never commit** `.env` files
- **Use `.env.example`** for documentation
- **Rotate secrets** regularly in production
- **Use strong secrets** (minimum 32 characters)

```bash
# Generate strong secrets
openssl rand -base64 32
```

### Authentication

- **Use Better Auth** for authentication
- **Implement session management** properly
- **Validate all user inputs**
- **Use HTTPS** in production
- **Implement rate limiting**

### Database

- **Use Prisma** for database queries (prevents SQL injection)
- **Validate all inputs** before database operations
- **Use transactions** for critical operations
- **Encrypt sensitive data** at rest (use ENCRYPTION_KEY)

### API Security

- **Validate all tRPC inputs** with Zod schemas
- **Implement proper authorization** checks
- **Use middleware** for authentication
- **Rate limit** API endpoints
- **Sanitize user inputs**

```typescript
// ✅ Good - Validated input
export const createWorkflow = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Proper authorization check
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    // Safe to use input
    return await workflowRepo.create(input);
  });
```

### Dependencies

- **Keep dependencies updated** - Use `pnpm update`
- **Audit dependencies** - Run `pnpm audit`
- **Review security advisories** - Check GitHub Dependabot alerts
- **Use exact versions** - Lock versions in package.json

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

### Secrets Management

- **Never hardcode secrets** in code
- **Use environment variables** for all secrets
- **Rotate secrets** regularly
- **Use different secrets** for each environment
- **Encrypt sensitive data** before storing

```typescript
// ✅ Good - Use environment variables
const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;

// ❌ Bad - Hardcoded secret
const apiKey = 'AIzaSyC1234567890';
```

### Error Handling

- **Don't expose sensitive info** in error messages
- **Log errors securely** with Pino
- **Use Sentry** for error tracking in production
- **Sanitize error responses** to clients

```typescript
// ✅ Good - Safe error message
catch (error) {
  logger.error({ error }, 'Failed to create workflow');
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Failed to create workflow',
  });
}

// ❌ Bad - Exposes internals
catch (error) {
  throw new Error(`Database error: ${error.message}`);
}
```

## Known Security Considerations

### Current Security Measures

- ✅ **Authentication** - Better Auth with session management
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **XSS Prevention** - React's automatic escaping
- ✅ **CSRF Protection** - Same-origin policy + tokens
- ✅ **Rate Limiting** - Upstash Redis
- ✅ **Input Validation** - Zod schemas
- ✅ **Encryption** - AES-256 for sensitive data
- ✅ **HTTPS** - Required in production
- ✅ **Security Headers** - Next.js security headers

### Areas for Improvement

We're continuously improving security. Current focus areas:

- 🔄 Enhanced rate limiting strategies
- 🔄 Additional API security hardening
- 🔄 Comprehensive security audit
- 🔄 Penetration testing

## Disclosure Policy

When the security team receives a security bug report, they will:

1. **Confirm the problem** and determine affected versions
2. **Audit code** to find similar problems
3. **Prepare fixes** for supported versions
4. **Release patches** as soon as possible

We aim to:

- Respond to security reports within **48 hours**
- Provide a fix within **7 days** for critical issues
- Provide a fix within **30 days** for moderate issues
- Publicly disclose after **90 days** or when fixed (whichever comes first)

## Security Updates

Security updates will be announced via:

- GitHub Security Advisories
- Release notes in CHANGELOG.md
- Email to registered users (if applicable)

## Acknowledgments

We appreciate security researchers who report vulnerabilities responsibly.

### Hall of Fame

_No security vulnerabilities reported yet._

## Questions?

If you have questions about this security policy, please open a GitHub discussion or contact the maintainers.

---

**Thank you for helping keep Nodebase secure! 🔒**
