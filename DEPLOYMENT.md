# Deployment Guide - Task Tracker

## Quick Deploy (Recommended)

### Frontend - Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Complete Phase 2: Full implementation"
git push origin main
```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Select GitHub repository
   - Click "Deploy"
   - Set environment variable: `VITE_API_URL=<backend-url>`

### Backend - Railway

1. **Deploy on Railway:**
   - Go to https://railway.app
   - Create new project
   - Select "Deploy from GitHub"
   - Choose repository
   - Click "Deploy"

2. **Configure Environment:**
   - In Railway dashboard → Variables
   - Add all `.env.example` variables:
     - DATABASE_URL (PostgreSQL URI)
     - JWT_SECRET
     - JWT_EXPIRY
     - JWT_REFRESH_EXPIRY
     - NODE_ENV=production
     - CORS_ORIGIN=<frontend-url>

3. **Database Setup:**
   - Railway auto-creates PostgresSQL database
   - Copy DATABASE_URL to environment
   - Run migrations automatically via postdeploy script

---

## Alternative Deployment Options

### Backend Deployment

#### Option 1: Railway (Easiest)
- ✅ Auto PostgreSQL
- ✅ Auto deploys on git push
- ✅ Good free tier
```bash
npm run build
# Upload via Railway CLI or GitHub integration
```

#### Option 2: Render
- Sign up at https://render.com
- Create Web Service
- Connect GitHub
- Under Environment → Add variables from `.env.example`

#### Option 3: Heroku (with dynos)
```bash
heroku create task-tracker-api
heroku config:set JWT_SECRET=xxx
git push heroku main
heroku run npx prisma migrate deploy
```

#### Option 4: Docker + Any Host
```bash
# Build & push to Docker registry
docker build -t task-tracker-api .
docker tag task-tracker-api your-registry/task-tracker-api:latest
docker push your-registry/task-tracker-api:latest

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://..." \
  -e JWT_SECRET="..." \
  your-registry/task-tracker-api:latest
```

### Frontend Deployment

#### Option 1: Vercel (Easiest)
- Auto deploys on git push
- Edge caching
- Best performance
- Free tier generous

#### Option 2: Netlify
1. Sign up at https://netlify.com
2. Connect GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment: Set `VITE_API_URL`

#### Option 3: AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket/
aws cloudfront create-invalidation --distribution-id xxx --paths "/*"
```

#### Option 4: GitHub Pages
```bash
# Only works if backend is public/CORS enabled
npm run build
# Follow GitHub Pages setup
```

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# JWT
JWT_SECRET="min-32-char-secret-key-for-signing"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Server
NODE_ENV=production
API_PORT=3000
API_HOST=0.0.0.0

# Security
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=5
CORS_ORIGIN="https://yourfrontend.com"
```

### Frontend (.env.local)
```env
VITE_API_URL=https://your-backend-api.com
```

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend API is accessible
- [ ] Login/Register works
- [ ] Task CRUD operations work
- [ ] Tokens refresh correctly
- [ ] Rate limiting is active
- [ ] CSRF protection is working
- [ ] Security headers present
- [ ] Environment variables secure
- [ ] Database backups configured

---

## Monitoring

### Backend
```bash
# View logs
curl https://your-api.com/health

# Monitor rate limiting
# Check console for throttled requests

# Monitor CSRF errors
# Should see "CSRF token" errors in logs if disabled
```

### Frontend
```bash
# DevTools > Network: Check response headers
# Should see: X-CSRF-Token, CSP, security headers

# DevTools > Console: Check for errors
# Should be clean on login/register
```

---

## SSL/HTTPS

**Important:** Both frontend and backend must use HTTPS in production.

- Vercel: Auto SSL ✅
- Railway: Auto SSL ✅
- Render: Auto SSL ✅
- Custom: Use Let's Encrypt (free)

**Update CORS_ORIGIN to https** in backend `.env`

---

## Scaling Considerations

For production deployment with high traffic:

1. **Database:**
   - Enable connection pooling (Railway does this)
   - Add Redis cache layer
   - Set up read replicas

2. **Backend:**
   - Use load balancer (multiple instances)
   - Enable clustering
   - Upgrade rate limiting to distributed

3. **Frontend:**
   - Use CDN caching
   - Enable gzip compression
   - Code split with lazy loading

4. **Monitoring:**
   - Set up APM (Application Performance Monitoring)
   - Error tracking (Sentry)
   - Log aggregation (LogRocket)

---

## Rollback Strategy

### If deployment breaks:

**Backend:**
```bash
# Railway: Automatic - just re-deploy previous commit
git revert <broken-commit>
git push

# Heroku
heroku releases
heroku releases:rollback v10
```

**Frontend:**
```bash
# Vercel: Automatic - select previous deployment
# Netlify: Select previous deploy in dashboard
```

---

## Contact & Support

For deployment issues:
- Check logs in Railway/Vercel dashboard
- Review `.env` variables are set correctly
- Verify database connectivity
- Test API endpoints with Postman
