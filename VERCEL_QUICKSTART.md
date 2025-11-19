# ⚡ Quick Vercel Deployment - Copy & Paste

## 🔥 Step 1: Add These to Vercel NOW

Go to: https://vercel.com/alireza-akbarzadeh/automaton-flow/settings/environment-variables

**Copy each line, split at `=`, paste Key and Value separately:**

```
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_RbI2WzLlEOu7@ep-odd-base-a4712dc0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
BETTER_AUTH_SECRET=CD6H7y9CTbCXrWLrj1r5yy5IgvEhlWTs
BETTER_AUTH_URL=https://automaton-flow.vercel.app
NEXT_PUBLIC_APP_NAME=Nodebase
ENCRYPTION_KEY=ocoqGnCmus59+wEUPW56chH0fItNfOA3MHKzF6zHjjk=
POLAR_ACCESS_TOKEN=polar_oat_b3am0W6lKlunPCFuldOQUPQzd9RYa3cuG9dWn0J7pb3
POLAR_SUCCESS_URL=https://automaton-flow.vercel.app/success
POLAR_SERVER=sandbox
UPSTASH_REDIS_REST_URL=https://stunning-duck-9162.upstash.io
UPSTASH_REDIS_REST_TOKEN=ASPKAAImcDJiMDkyYjNmZDY5Y2Y0NDQxODczZDY1M2ZiNzA2M2VkYXAyOTE2Mg
RATE_LIMIT_ENABLED=true
LOG_LEVEL=info
```

**Select "Production" for each variable!**

---

## 🔐 Step 2: Create GitHub OAuth App for Production

1. **Go to**: https://github.com/settings/developers
2. **Click**: "New OAuth App"
3. **Fill in**:
   - Application name: `Nodebase Production`
   - Homepage URL: `https://automaton-flow.vercel.app`
   - Authorization callback URL: `https://automaton-flow.vercel.app/api/auth/callback/github`
4. **Click**: "Register application"
5. **Copy Client ID** and add to Vercel:
   ```
   Key: GITHUB_CLIENT_ID
   Value: (paste the client ID)
   Environment: Production
   ```
6. **Click "Generate a new client secret"**, copy it, and add to Vercel:
   ```
   Key: GITHUB_CLIENT_SECRET
   Value: (paste the secret)
   Environment: Production
   ```

---

## 🔄 Step 3: Redeploy

1. Go to: https://vercel.com/alireza-akbarzadeh/automaton-flow
2. Click **"Deployments"** tab
3. Click the **three dots (•••)** on latest deployment
4. Click **"Redeploy"**
5. **Uncheck** "Use existing Build Cache"
6. Click **"Redeploy"**

**OR** just push a new commit:

```bash
git commit --allow-empty -m "chore: trigger production deploy"
git push
```

---

## ✅ Step 4: Test

1. Visit: https://automaton-flow.vercel.app
2. Click "Sign In"
3. Try GitHub login
4. Should work! ✨

---

## 🐛 If Something Breaks

### GitHub OAuth Error?

- Check callback URL is EXACTLY: `https://automaton-flow.vercel.app/api/auth/callback/github`
- No trailing slash!
- Check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are set in Vercel

### "Invalid URL" Error?

- Check BETTER_AUTH_URL is set in Vercel
- Must be: `https://automaton-flow.vercel.app` (no trailing slash)

### Database Error?

- Check DATABASE_URL is set in Vercel
- Verify Neon database is running

### Check Logs:

- Go to Vercel dashboard → Deployments → Click latest → Runtime Logs
- Look for errors in red

---

## 🎉 That's It!

Your app should now be live at: **https://automaton-flow.vercel.app**

For detailed docs, see [DEPLOYMENT.md](./DEPLOYMENT.md)
