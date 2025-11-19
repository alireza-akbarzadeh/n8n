# 🚀 Production Deployment Guide - Vercel

Your app is deployed at: **https://automaton-flow.vercel.app/**

This guide walks you through setting up environment variables and configuring OAuth for production.

---

## 📋 Step 1: Set Environment Variables in Vercel

Go to your Vercel dashboard: https://vercel.com/alireza-akbarzadeh/automaton-flow/settings/environment-variables

### Required Environment Variables

Copy and paste these into Vercel (update the values):

```bash
# Node Environment
NODE_ENV=production

# Database (Your existing Neon database)
DATABASE_URL=postgresql://neondb_owner:npg_RbI2WzLlEOu7@ep-odd-base-a4712dc0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Auth - IMPORTANT: Update URL for production
BETTER_AUTH_SECRET=CD6H7y9CTbCXrWLrj1r5yy5IgvEhlWTs
BETTER_AUTH_URL=https://automaton-flow.vercel.app

# Application
NEXT_PUBLIC_APP_NAME=Nodebase

# Encryption
ENCRYPTION_KEY=ocoqGnCmus59+wEUPW56chH0fItNfOA3MHKzF6zHjjk=

# GitHub OAuth - NEED TO UPDATE (see Step 2)
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret

# Polar (Subscriptions)
POLAR_ACCESS_TOKEN=polar_oat_b3am0W6lKlunPCFuldOQUPQzd9RYa3cuG9dWn0J7pb3
POLAR_SUCCESS_URL=https://automaton-flow.vercel.app/success
POLAR_SERVER=sandbox

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://stunning-duck-9162.upstash.io
UPSTASH_REDIS_REST_TOKEN=ASPKAAImcDJiMDkyYjNmZDY5Y2Y0NDQxODczZDY1M2ZiNzA2M2VkYXAyOTE2Mg
RATE_LIMIT_ENABLED=true

# Optional but Recommended
INNGEST_EVENT_KEY=your-production-inngest-key
INNGEST_SIGNING_KEY=your-production-inngest-signing-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token
LOG_LEVEL=info
```

### How to Add in Vercel UI:

1. Go to **Settings** → **Environment Variables**
2. For each variable:
   - Enter **Key** (e.g., `DATABASE_URL`)
   - Enter **Value** (e.g., `postgresql://...`)
   - Select environment: **Production** (or all)
   - Click **Save**

---

## 🔐 Step 2: Update GitHub OAuth Application

Your current GitHub OAuth app is configured for `localhost`. You need to **create a new one** or **update it** for production.

### Option A: Create New Production OAuth App (Recommended)

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   ```
   Application name: Nodebase (Production)
   Homepage URL: https://automaton-flow.vercel.app
   Authorization callback URL: https://automaton-flow.vercel.app/api/auth/callback/github
   ```
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it
7. Add these to Vercel environment variables:
   - `GITHUB_CLIENT_ID` = your new client ID
   - `GITHUB_CLIENT_SECRET` = your new client secret

### Option B: Update Existing OAuth App

1. Go to: https://github.com/settings/developers
2. Click on your existing app
3. Update **Authorization callback URL** to:
   ```
   https://automaton-flow.vercel.app/api/auth/callback/github
   ```
4. **Note**: This will break localhost. Better to create separate apps for dev/prod.

---

## 🗄️ Step 3: Run Database Migrations

Your Vercel deployment needs the database schema. Run migrations:

```bash
# From your local machine
DATABASE_URL="postgresql://neondb_owner:npg_RbI2WzLlEOu7@ep-odd-base-a4712dc0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pnpm db:deploy
```

Or in Vercel, you can add a **postbuild** script (already in your package.json):

Vercel will automatically run `prisma generate` during build.

---

## 🔄 Step 4: Redeploy After Environment Variables

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots** (•••) on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** = OFF
5. Click **Redeploy**

Or trigger a new deployment:

```bash
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push
```

---

## 🧪 Step 5: Test Your Production Deployment

### 1. Visit Your App

Go to: https://automaton-flow.vercel.app

### 2. Test Authentication

- Click **Sign In**
- Try GitHub OAuth login
- Should redirect back after authentication

### 3. Test Core Features

- Create a workflow
- Execute a workflow
- Check executions page

### 4. Check Logs

In Vercel dashboard:

- Go to **Deployments** → Latest deployment → **Runtime Logs**
- Look for errors

---

## 🐛 Troubleshooting

### Issue: "Invalid redirect_uri" from GitHub

**Cause**: GitHub OAuth callback URL doesn't match

**Fix**:

1. Check GitHub OAuth app settings
2. Callback URL must be EXACTLY: `https://automaton-flow.vercel.app/api/auth/callback/github`
3. No trailing slash
4. Must match `BETTER_AUTH_URL` + `/api/auth/callback/github`

### Issue: "BETTER_AUTH_URL must be a valid URL"

**Cause**: Environment variable not set or wrong format

**Fix**:

1. Go to Vercel → Settings → Environment Variables
2. Set `BETTER_AUTH_URL=https://automaton-flow.vercel.app` (no trailing slash)
3. Redeploy

### Issue: Database connection errors

**Cause**: DATABASE_URL not set or wrong

**Fix**:

1. Verify DATABASE_URL in Vercel environment variables
2. Test connection from local: `pnpm db:studio`
3. Check Neon dashboard for connection issues

### Issue: OAuth works locally but not in production

**Cause**: Using same GitHub OAuth app for both

**Fix**:

1. Create separate OAuth apps for dev and production
2. Use different Client ID/Secret for each environment

### Issue: Inngest functions not triggering

**Cause**: Missing INNGEST_EVENT_KEY or wrong URL

**Fix**:

1. Set up Inngest Cloud: https://www.inngest.com/
2. Add `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to Vercel
3. Configure webhook in Inngest dashboard: `https://automaton-flow.vercel.app/api/inngest`

---

## 🔒 Security Checklist for Production

- [ ] Changed `BETTER_AUTH_SECRET` to a new random value (32+ chars)
- [ ] Changed `ENCRYPTION_KEY` to a new random value (32+ chars)
- [ ] Using separate GitHub OAuth app for production
- [ ] `BETTER_AUTH_URL` set to production URL (no localhost)
- [ ] `POLAR_SUCCESS_URL` set to production URL
- [ ] Rate limiting enabled (`RATE_LIMIT_ENABLED=true`)
- [ ] Environment variables set to "Production" only (not Preview/Development)
- [ ] No `.env` file committed to git (check `.gitignore`)
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] Sentry configured for error tracking (optional but recommended)

---

## 📊 Optional: Enhanced Production Setup

### 1. Set Up Sentry (Error Tracking)

1. Sign up at: https://sentry.io/
2. Create a new project (Next.js)
3. Copy DSN
4. Add to Vercel:
   ```
   SENTRY_DSN=https://xxx@sentry.io/xxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   SENTRY_AUTH_TOKEN=your-token
   ```

### 2. Set Up Inngest (Background Jobs)

1. Sign up at: https://www.inngest.com/
2. Create a new app
3. Add webhook: `https://automaton-flow.vercel.app/api/inngest`
4. Copy keys to Vercel:
   ```
   INNGEST_EVENT_KEY=your-key
   INNGEST_SIGNING_KEY=your-signing-key
   ```

### 3. Enable Analytics

```bash
ENABLE_ANALYTICS=true
```

### 4. Configure Custom Domain (Optional)

1. Go to Vercel → Settings → Domains
2. Add your custom domain (e.g., `app.yourdomain.com`)
3. Update DNS records as shown
4. Update environment variables:
   - `BETTER_AUTH_URL=https://app.yourdomain.com`
   - `POLAR_SUCCESS_URL=https://app.yourdomain.com/success`
5. Update GitHub OAuth callback URL
6. Redeploy

---

## 🚀 Quick Start Checklist

### Minimal Setup (Must Do):

1. ✅ Add environment variables in Vercel (copy from above)
2. ✅ Update `BETTER_AUTH_URL=https://automaton-flow.vercel.app`
3. ✅ Create new GitHub OAuth app for production
4. ✅ Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Vercel
5. ✅ Redeploy from Vercel dashboard
6. ✅ Test login at https://automaton-flow.vercel.app

### Recommended (Should Do):

7. ⭐ Enable Sentry for error tracking
8. ⭐ Set up Inngest for background jobs
9. ⭐ Enable rate limiting (`RATE_LIMIT_ENABLED=true`)
10. ⭐ Generate new secrets for production:
    ```bash
    # Generate new secrets
    openssl rand -base64 32  # For BETTER_AUTH_SECRET
    openssl rand -base64 32  # For ENCRYPTION_KEY
    ```

### Optional (Nice to Have):

11. 💎 Set up custom domain
12. 💎 Configure monitoring/uptime checks
13. 💎 Set up backup strategy for database
14. 💎 Enable preview deployments for PRs

---

## 📞 Need Help?

- **Vercel Issues**: Check deployment logs in Vercel dashboard
- **GitHub OAuth**: https://docs.github.com/en/apps/oauth-apps
- **Better Auth**: https://www.better-auth.com/docs
- **Database**: Check Neon dashboard for connection status

---

## 📝 Environment Variables Reference

Create this file locally as `.env.production.local` (DO NOT commit):

```bash
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_RbI2WzLlEOu7@ep-odd-base-a4712dc0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
BETTER_AUTH_SECRET=CD6H7y9CTbCXrWLrj1r5yy5IgvEhlWTs
BETTER_AUTH_URL=https://automaton-flow.vercel.app
NEXT_PUBLIC_APP_NAME=Nodebase
ENCRYPTION_KEY=ocoqGnCmus59+wEUPW56chH0fItNfOA3MHKzF6zHjjk=
GITHUB_CLIENT_ID=your-production-client-id
GITHUB_CLIENT_SECRET=your-production-client-secret
POLAR_ACCESS_TOKEN=polar_oat_b3am0W6lKlunPCFuldOQUPQzd9RYa3cuG9dWn0J7pb3
POLAR_SUCCESS_URL=https://automaton-flow.vercel.app/success
POLAR_SERVER=sandbox
UPSTASH_REDIS_REST_URL=https://stunning-duck-9162.upstash.io
UPSTASH_REDIS_REST_TOKEN=ASPKAAImcDJiMDkyYjNmZDY5Y2Y0NDQxODczZDY1M2ZiNzA2M2VkYXAyOTE2Mg
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

**Then manually add each variable to Vercel's dashboard.**

---

**Good luck with your production deployment! 🎉**

If you encounter issues, check the Vercel runtime logs first.
