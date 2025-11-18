# Industry Day 2025 - Simple Vercel Deployment (Free Domains)

This guide shows you how to deploy using **free Vercel domains only** - no custom domain needed!

## What You'll Get

After deployment, you'll have:
- **Backend API**: `https://your-api-name.vercel.app` (free)
- **Frontend**: `https://your-app-name.vercel.app` (free)

Both are completely free and work perfectly!

---

## Step-by-Step Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser - log in with GitHub, GitLab, or email.

---

## Part 1: Deploy Backend API First

### Step 3: Navigate to API Directory

```bash
cd apps/api
```

### Step 4: Deploy Backend

```bash
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Y**
- Which scope? → **Select your account**
- Link to existing project? → **N**
- What's your project's name? → **industry-day-api** (or any name you want)
- In which directory is your code located? → **Press Enter** (current directory)

**Save the URL you get!** It will look like:
```
https://industry-day-api.vercel.app
```

### Step 5: Add Backend Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on your **industry-day-api** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (copy from your local `apps/api/.env`):

```
DATABASE_HOST=<your-aiven-host>.aivencloud.com
DATABASE_PORT=<your-aiven-port>
DATABASE_USER=avnadmin
DATABASE_PASSWORD=<your-aiven-password>
DATABASE_NAME=<your-database-name>
DATABASE_SSL=true

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d

NODE_ENV=production
PORT=3000

FRONTEND_URL=https://industry-day-2025.vercel.app
```

**Note:** For now, use a placeholder for `FRONTEND_URL` - we'll update it after deploying the frontend.

5. Click **Save** after adding each variable

### Step 6: Redeploy Backend

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for it to finish

### Step 7: Test Backend

Open in browser: `https://industry-day-api.vercel.app`

You should see something (not an error page). If you get an error, check the deployment logs.

---

## Part 2: Deploy Frontend

### Step 8: Navigate to Web Directory

```bash
cd ../web
# Or from project root: cd apps/web
```

### Step 9: Update API Configuration

Open `apps/web/src/lib/axios.ts` and make sure it uses environment variables:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Step 10: Deploy Frontend

```bash
vercel
```

**Answer the prompts:**
- Set up and deploy? → **Y**
- Which scope? → **Select your account**
- Link to existing project? → **N**
- What's your project's name? → **industry-day-2025** (or any name you want)
- In which directory is your code located? → **Press Enter**

**Save this URL!** It will look like:
```
https://industry-day-2025.vercel.app
```

### Step 11: Add Frontend Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on your **industry-day-2025** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
NEXT_PUBLIC_API_URL=https://industry-day-api.vercel.app
```

**Important:** Replace with YOUR actual backend URL from Step 4!

5. Click **Save**

### Step 12: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **⋯** on the latest deployment
3. Click **Redeploy**
4. Wait for it to finish

---

## Part 3: Update Backend with Frontend URL

### Step 13: Update Backend Environment Variable

Now that you have your frontend URL, update the backend:

1. Go to https://vercel.com/dashboard
2. Click on your **industry-day-api** project
3. Go to **Settings** → **Environment Variables**
4. Find `FRONTEND_URL` and click **Edit**
5. Change it to your actual frontend URL:
   ```
   FRONTEND_URL=https://industry-day-2025.vercel.app
   ```
6. Click **Save**

### Step 14: Redeploy Backend Again

1. Go to **Deployments** tab
2. Click **⋯** on the latest deployment
3. Click **Redeploy**

---

## Step 15: Test Everything!

### Open your frontend:
```
https://industry-day-2025.vercel.app
```

### Test these features:
- [ ] Login page loads
- [ ] Can log in as student/company/admin
- [ ] Dashboard loads correctly
- [ ] Can navigate between pages
- [ ] Interview queue works (for companies)
- [ ] Reports load (for admin)

---

## Your Free Vercel URLs

Write these down:

**Frontend (Users visit this):**
```
https://industry-day-2025.vercel.app
```

**Backend API (Frontend calls this):**
```
https://industry-day-api.vercel.app
```

**Vercel Dashboard:**
```
https://vercel.com/dashboard
```

---

## Troubleshooting

### Problem: "CORS Error" in browser console

**Solution:**
1. Go to your **API project** in Vercel
2. Check `FRONTEND_URL` environment variable
3. Make sure it matches your frontend URL exactly (no trailing slash)
4. Redeploy backend

### Problem: "Network Error" or API calls failing

**Solution:**
1. Open browser DevTools (F12) → Network tab
2. See what URL the frontend is calling
3. Go to your **Frontend project** in Vercel
4. Check `NEXT_PUBLIC_API_URL` environment variable
5. Make sure it matches your backend URL exactly
6. Redeploy frontend

### Problem: "Database connection failed"

**Solution:**
1. Go to Aiven console: https://console.aiven.io
2. Check your MySQL service is running (green)
3. Go to **API project** in Vercel
4. Verify all database environment variables:
   - `DATABASE_HOST`
   - `DATABASE_PORT`
   - `DATABASE_USER`
   - `DATABASE_PASSWORD`
   - `DATABASE_NAME`
   - `DATABASE_SSL=true` ← Must be true!
5. Redeploy backend

### Problem: Page loads but no data showing

**Solution:**
1. Open browser DevTools → Console
2. Look for error messages
3. Check Network tab for failed requests
4. Most likely cause: API URL is wrong
5. Verify `NEXT_PUBLIC_API_URL` in frontend

### Problem: After changing environment variables, nothing changes

**Solution:**
- Environment variables only apply to NEW deployments
- You MUST click **Redeploy** after changing any environment variable
- Wait for deployment to complete (green checkmark)

---

## Important Notes

### About Free Vercel Domains

✅ **Pros:**
- Completely free forever
- Automatic HTTPS/SSL
- Fast CDN globally
- No setup needed

ℹ️ **What they look like:**
- `https://project-name.vercel.app`
- `https://project-name-git-main-username.vercel.app` (preview)
- `https://project-name-abc123.vercel.app` (preview)

⚠️ **Important:**
- Only use the MAIN URL (without `-git-` or random suffix)
- This is your production URL
- It won't change unless you rename the project

### Environment Variables Checklist

**Backend needs:**
```
✓ DATABASE_HOST
✓ DATABASE_PORT
✓ DATABASE_USER
✓ DATABASE_PASSWORD
✓ DATABASE_NAME
✓ DATABASE_SSL=true
✓ JWT_SECRET
✓ JWT_EXPIRES_IN
✓ NODE_ENV=production
✓ FRONTEND_URL=<your-frontend-vercel-url>
```

**Frontend needs:**
```
✓ NEXT_PUBLIC_API_URL=<your-backend-vercel-url>
```

### Deployment Checklist

Before you start:
- [ ] Aiven MySQL database is running
- [ ] Database has data
- [ ] You have Vercel account
- [ ] Vercel CLI is installed (`vercel --version`)

Backend deployment:
- [ ] Backend deployed to Vercel
- [ ] All backend environment variables added
- [ ] Backend redeployed after adding env vars
- [ ] Backend URL saved

Frontend deployment:
- [ ] Frontend deployed to Vercel
- [ ] `NEXT_PUBLIC_API_URL` added
- [ ] Frontend redeployed
- [ ] Frontend URL saved

Final steps:
- [ ] Backend `FRONTEND_URL` updated with actual frontend URL
- [ ] Backend redeployed with correct `FRONTEND_URL`
- [ ] Tested login
- [ ] Tested main features
- [ ] Checked for console errors

---

## Quick Commands Reference

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check logs
vercel logs <your-project-url>

# List all deployments
vercel ls

# See project info
vercel inspect <your-project-url>
```

---

## What If I Want Better URLs Later?

You can always add a custom domain later (like `industryday.com`) without changing anything in your code!

Just go to:
1. Project in Vercel → Settings → Domains
2. Add your domain
3. Vercel will redirect your `.vercel.app` URL to your custom domain automatically

But for now, the free Vercel domains work perfectly! 🎉

---

## Success! 🎉

If you can:
- ✅ Open your frontend URL
- ✅ Log in successfully
- ✅ See data loading
- ✅ Navigate between pages

**Your deployment is complete!**

Share your frontend URL with users:
```
https://industry-day-2025.vercel.app
```

They can access it from anywhere in the world! 🌍
