# Industry Day 2025 - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Industry Day 2025 application to Vercel with Aiven MySQL database.

## Prerequisites

- ✅ Aiven MySQL database set up and running
- ✅ Database populated with data
- ✅ GitHub repository with the code
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ All local `.env` files configured

## Architecture Overview

Your application consists of:
- **Frontend (Next.js)**: `/apps/web`
- **Backend API (NestJS)**: `/apps/api`
- **Database**: Aiven MySQL

## Deployment Order

**Deploy in this order:**
1. Backend API first
2. Frontend second (it needs the API URL)

---

## Part 1: Deploy Backend API (NestJS)

### Step 1: Prepare Backend for Deployment

1.1. Navigate to the API directory:
```bash
cd apps/api
```

1.2. Check if `vercel.json` exists in `/apps/api`. If not, create it:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

1.3. Update `package.json` to add a build script if missing:
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

### Step 2: Deploy Backend to Vercel

2.1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2.2. Login to Vercel:
```bash
vercel login
```

2.3. From the `/apps/api` directory, run:
```bash
vercel
```

2.4. Answer the prompts:
- "Set up and deploy?"  → **Yes**
- "Which scope?"  → **Select your account**
- "Link to existing project?"  → **No**
- "What's your project's name?"  → **industry-day-api** (or your preferred name)
- "In which directory is your code located?"  → **./apps/api** (or press Enter if already in that directory)

2.5. Vercel will deploy and provide a URL like: `https://industry-day-api.vercel.app`

### Step 3: Configure Backend Environment Variables

3.1. Go to Vercel Dashboard: https://vercel.com/dashboard

3.2. Select your **industry-day-api** project

3.3. Click **Settings** → **Environment Variables**

3.4. Add these environment variables from your `/apps/api/.env`:

**Required Variables:**
```
DATABASE_HOST=<your-aiven-mysql-host>
DATABASE_PORT=<your-aiven-mysql-port>
DATABASE_USER=<your-aiven-mysql-user>
DATABASE_PASSWORD=<your-aiven-mysql-password>
DATABASE_NAME=<your-database-name>
DATABASE_SSL=true

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d

NODE_ENV=production
PORT=3000

FRONTEND_URL=https://industry-day-2025.vercel.app
```

**Important Notes:**
- For Aiven MySQL, `DATABASE_SSL` should be `true`
- `FRONTEND_URL` will be your frontend URL (we'll update this after frontend deployment)
- Use the **exact same** values from your working local `.env`

3.5. Click **Save** for each variable

3.6. After adding all variables, go to **Deployments** tab

3.7. Click the **three dots (...)** on the latest deployment → **Redeploy**

3.8. Wait for redeployment to complete

### Step 4: Test Backend API

4.1. Open your API URL in browser: `https://industry-day-api.vercel.app`

4.2. Test a health endpoint (if you have one) or any public endpoint

4.3. If you get errors, check:
- Vercel deployment logs (in the dashboard)
- Environment variables are set correctly
- Database connection details are correct

---

## Part 2: Deploy Frontend (Next.js)

### Step 5: Prepare Frontend for Deployment

5.1. Navigate to the web directory:
```bash
cd apps/web
```

5.2. Update `next.config.js` (or `next.config.mjs`) to add the API URL:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }
}

module.exports = nextConfig
```

5.3. Update your API configuration file (`/apps/web/src/lib/axios.ts` or similar):
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

### Step 6: Deploy Frontend to Vercel

6.1. From the `/apps/web` directory, run:
```bash
vercel
```

6.2. Answer the prompts:
- "Set up and deploy?"  → **Yes**
- "Which scope?"  → **Select your account**
- "Link to existing project?"  → **No**
- "What's your project's name?"  → **industry-day-2025** (or your preferred name)
- "In which directory is your code located?"  → **./apps/web** (or press Enter)

6.3. Vercel will provide a URL like: `https://industry-day-2025.vercel.app`

### Step 7: Configure Frontend Environment Variables

7.1. Go to Vercel Dashboard: https://vercel.com/dashboard

7.2. Select your **industry-day-2025** project

7.3. Click **Settings** → **Environment Variables**

7.4. Add these environment variables:

```
NEXT_PUBLIC_API_URL=https://industry-day-api.vercel.app

# Add any other frontend environment variables from your /apps/web/.env
# For example:
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=<if-you-have-one>
```

7.5. Click **Save**

7.6. Go to **Deployments** tab → **Redeploy**

### Step 8: Update Backend CORS and Frontend URL

8.1. Go back to your **API project** in Vercel Dashboard

8.2. Update the `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://industry-day-2025.vercel.app
```

8.3. Redeploy the API

8.4. Verify your backend code has CORS configured correctly. Check `/apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

---

## Part 3: Final Testing

### Step 9: Test the Deployed Application

9.1. Open your frontend URL: `https://industry-day-2025.vercel.app`

9.2. Test key features:
- [ ] User login/authentication
- [ ] Student dashboard
- [ ] Company dashboard
- [ ] Admin dashboard
- [ ] Interview queue functionality
- [ ] CV uploads (if using Google Drive)
- [ ] Live queues page
- [ ] Reports generation

9.3. Check browser console for any errors

9.4. Test on mobile devices

### Step 10: Troubleshooting Common Issues

**Problem: "CORS Error"**
- Solution: Verify `FRONTEND_URL` in API environment variables
- Check CORS configuration in `main.ts`

**Problem: "Database connection failed"**
- Solution: Verify all database credentials in API environment variables
- Ensure `DATABASE_SSL=true` for Aiven
- Check Aiven firewall settings (should allow all IPs for cloud deployments)

**Problem: "API calls failing with 404"**
- Solution: Verify `NEXT_PUBLIC_API_URL` in frontend environment variables
- Check API deployment logs in Vercel

**Problem: "Environment variables not working"**
- Solution: After adding/changing env vars, always **redeploy**
- Check variable names match exactly (case-sensitive)

**Problem: "Build failed"**
- Solution: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try building locally first: `npm run build`

---

## Part 4: Production Optimization

### Step 11: Configure Custom Domain (Optional)

11.1. In Vercel Dashboard, go to **Settings** → **Domains**

11.2. Add your custom domain for frontend (e.g., `industryday2025.yourdomain.com`)

11.3. Add custom domain for API (e.g., `api.industryday2025.yourdomain.com`)

11.4. Update DNS records as instructed by Vercel

11.5. Update environment variables with new domains

### Step 12: Set Up Monitoring

12.1. Enable Vercel Analytics (in project settings)

12.2. Set up error tracking (consider Sentry)

12.3. Monitor database performance in Aiven dashboard

### Step 13: Security Checklist

- [ ] All sensitive data in environment variables (not in code)
- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] CORS is configured correctly
- [ ] API rate limiting is enabled (if implemented)
- [ ] SQL injection protection (use parameterized queries)
- [ ] Input validation on all forms

---

## Quick Reference

### URLs to Save
- **Frontend Production**: `https://industry-day-2025.vercel.app`
- **Backend API Production**: `https://industry-day-api.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Aiven Console**: `https://console.aiven.io`

### Useful Commands
```bash
# Deploy to production
vercel --prod

# Check deployment logs
vercel logs <deployment-url>

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-name>
```

### Environment Variables Quick Check
```bash
# Frontend should have:
NEXT_PUBLIC_API_URL=https://industry-day-api.vercel.app

# Backend should have:
DATABASE_HOST=<aiven-host>
DATABASE_PORT=<aiven-port>
DATABASE_USER=<aiven-user>
DATABASE_PASSWORD=<aiven-password>
DATABASE_NAME=<database-name>
DATABASE_SSL=true
JWT_SECRET=<secret>
FRONTEND_URL=https://industry-day-2025.vercel.app
NODE_ENV=production
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly using Postman or curl
5. Check Aiven database connectivity

---

## Success Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Backend API responding to requests
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] Frontend can communicate with backend
- [ ] Database connection working
- [ ] Authentication working
- [ ] All major features tested
- [ ] CORS configured correctly
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring set up

---

**Congratulations! Your Industry Day 2025 application is now live! 🎉**
