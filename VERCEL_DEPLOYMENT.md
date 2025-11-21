# Vercel Deployment Guide for miniapp-next

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier is fine)
2. **GitHub Repository**: Ensure your code is pushed to `https://github.com/nahomkasa999/firfirtera.git`
3. **Neon Database**: You should already have a Neon PostgreSQL database (same as the bot)

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `nahomkasa999/firfirtera`
4. Vercel will auto-detect it's a Next.js project

### 2. Configure Project Settings

**Root Directory**: 
- If deploying from monorepo: Set to `miniapp-next`
- If deploying the repo directly: Leave empty

**Framework Preset**: Next.js (auto-detected)

**Build Command**: `npm run build` (or `prisma generate && next build`)

**Output Directory**: `.next` (default)

**Install Command**: `npm install`

### 3. Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://neondb_owner:npg_zGBn7jKb6PIe@ep-plain-lab-a40m4d83-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL=postgresql://neondb_owner:npg_zGBn7jKb6PIe@ep-plain-lab-a40m4d83.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXT_PUBLIC_API_URL=https://firfir-tera-bot.vercel.app/api/miniapp

NEXT_PUBLIC_USE_LOCAL_DB=false
```

**Important**: 
- Use your actual Neon database credentials
- Set these for **Production**, **Preview**, and **Development** environments

### 4. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Run `prisma generate` (via postinstall script)
   - Build the Next.js app
   - Deploy to production

### 5. Run Database Migrations

After first deployment, you need to run Prisma migrations:

**Option A: Via Vercel CLI** (Recommended)
```bash
cd miniapp-next
npx vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Via Neon Console**
- Connect to your Neon database
- Run migrations manually or use Prisma Studio

**Option C: Add to Build Command** (if migrations are needed)
Update build command in Vercel to:
```
prisma migrate deploy && prisma generate && next build
```

### 6. Verify Deployment

1. Visit your deployment URL (e.g., `https://your-project.vercel.app`)
2. Check that:
   - Pages load correctly
   - API routes work
   - Database connections are successful

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Database migrations are applied
- [ ] Prisma Client is generated
- [ ] API routes are working
- [ ] Database queries succeed
- [ ] No build errors in Vercel logs

## Troubleshooting

### Build Fails with Prisma Error
- Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel
- Check that Prisma can connect to Neon database
- Verify network access from Vercel to Neon

### Database Connection Errors
- Verify Neon database is accessible
- Check connection strings are correct
- Ensure SSL mode is set correctly

### API Routes Not Working
- Check Vercel function logs
- Verify Prisma Client is generated
- Ensure database migrations are applied

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

No additional configuration needed!

