# SurveillanceOps - Complete Setup & Deployment Instructions

## Quick Start (5 Minutes)

### 1. Generate Encryption Key
Open your terminal and run:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`
Copy the output (64-character hex string).

### 2. Create Environment File
Create `.env.local` in the project root:
\`\`\`env
ENCRYPTION_KEY=paste_your_64_character_key_here
NODE_ENV=development
\`\`\`

### 3. Install & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

---

## Complete Setup Guide

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- npm or yarn
- Git (for deployment)
- GitHub account (for Vercel deployment)

### Step 1: Clone/Setup Project
\`\`\`bash
# If starting fresh
git clone <your-repo-url>
cd surveillance-platform

# Install dependencies
npm install
\`\`\`

### Step 2: Configure Environment Variables

**CRITICAL: This step is required for the system to work**

Create `.env.local` file in the root directory:

\`\`\`env
# ============================================
# REQUIRED - Encryption Key
# ============================================
# Generate a secure key with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_64_character_hex_string_here

# ============================================
# OPTIONAL - Database Configuration
# ============================================
# For production, use Supabase or Neon
# DATABASE_URL=postgresql://user:password@host:port/database
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ============================================
# OPTIONAL - API Configuration
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Step 3: Run Locally
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

### Step 4: Test All Features

#### Test Tracking System
1. Go to `/tracking`
2. Click "Start" button
3. Wait 3-5 seconds for data to appear
4. View real-time object detection
5. Click "Stop" to end simulation

#### Test All Pages
- `/` - Overview dashboard
- `/dashboard` - Live metrics
- `/cameras` - Camera feeds
- `/energy` - Energy monitoring
- `/alerts` - Alert management
- `/map` - Interactive map
- `/control` - Device control
- `/analytics` - Historical analysis
- `/tracking` - Real-time tracking
- `/tracking/analytics` - Tracking trends
- `/tracking/audit` - Security logs

---

## Production Deployment to Vercel

### Step 1: Push to GitHub

\`\`\`bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial surveillance platform deployment"

# Create main branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/surveillance-platform.git

# Push to GitHub
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

### Step 3: Add Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Variable | Value | Required |
|----------|-------|----------|
| `ENCRYPTION_KEY` | Your 64-char hex key | ✅ YES |
| `NODE_ENV` | `production` | ✅ YES |
| `NEXT_PUBLIC_API_URL` | Your Vercel URL | ❌ No |

4. Click "Save"
5. Go to "Deployments" and click "Redeploy" on the latest deployment

### Step 4: Verify Deployment

1. Wait for deployment to complete (usually 2-3 minutes)
2. Click the deployment URL
3. Test all features work correctly
4. Check `/tracking` page - simulator should work

---

## Database Setup (Optional - For Production Data Persistence)

### Option A: Supabase (Recommended)

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize
5. Go to "SQL Editor"
6. Create a new query and paste the contents of `scripts/01-init-database.sql`
7. Execute the query
8. Go to "Project Settings" → "API"
9. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

10. Add to `.env.local`:
\`\`\`env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Option B: Neon

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to `.env.local`:
\`\`\`env
DATABASE_URL=postgresql://user:password@host:port/database
\`\`\`

---

## API Endpoints Reference

### Tracking System
\`\`\`
POST /api/tracking/update
- Submit encrypted tracking data from edge devices
- Headers: x-api-key: <device_api_key>
- Body: { device_id, facility_id, timestamp, encrypted_data }

GET /api/tracking/events?facility_id=<id>&limit=100
- Retrieve tracking events
- Returns: { success, count, events }
\`\`\`

### Device Management
\`\`\`
POST /api/devices/register
- Register a new surveillance device
- Body: { facility_id, device_name, location, device_type }
- Returns: { success, device_id, api_key }

GET /api/devices/status?facility_id=<id>
- Get device status
- Returns: { success, devices }
\`\`\`

### Simulator
\`\`\`
POST /api/simulator/start
- Start edge device simulator
- Body: { device_id, facility_id, api_key, interval_ms }
- Returns: { success, message }

POST /api/simulator/stop
- Stop edge device simulator
- Body: { device_id }
- Returns: { success, message }
\`\`\`

### Audit & Health
\`\`\`
GET /api/audit/logs?user_id=<id>&limit=100
- Retrieve audit logs
- Returns: { success, logs }

GET /api/health
- System health check
- Returns: { status, timestamp, version }
\`\`\`

---

## Troubleshooting

### Issue: "ENCRYPTION_KEY is not defined"
**Solution**: 
1. Generate key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Add to `.env.local`: `ENCRYPTION_KEY=your_key`
3. Restart dev server: `npm run dev`

### Issue: Simulator won't start
**Solution**:
1. Check browser console (F12) for errors
2. Verify `.env.local` has `ENCRYPTION_KEY`
3. Check that `/api/tracking/update` is accessible
4. Try refreshing the page

### Issue: "Failed to fetch tracking data"
**Solution**:
1. Ensure simulator is running (green indicator)
2. Wait 3-5 seconds after clicking Start
3. Check network tab in DevTools for API errors
4. Verify facility_id is correct

### Issue: Graphs not showing on `/analytics`
**Solution**:
1. Ensure `ENCRYPTION_KEY` is set
2. Run simulator on `/tracking` page first
3. Wait for data to be collected
4. Refresh `/analytics` page

### Issue: Deployment fails on Vercel
**Solution**:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure `ENCRYPTION_KEY` is exactly 64 characters
4. Try redeploying

### Issue: "Cannot find module 'crypto'"
**Solution**:
1. This is a Node.js built-in module
2. Ensure Node.js 18+ is installed
3. Run `npm install` again
4. Restart dev server

---

## Security Best Practices

### For Development
- Keep `.env.local` in `.gitignore` (already configured)
- Never commit encryption keys
- Use different keys for dev/prod

### For Production
- Use strong, randomly generated encryption keys
- Enable HTTPS (Vercel does this automatically)
- Implement rate limiting on API endpoints
- Use Row-Level Security (RLS) in database
- Enable audit logging
- Regularly rotate API keys

### Data Privacy
- No facial recognition data is stored
- Only bounding boxes and metadata retained
- Automatic data purging (configurable)
- GDPR/CCPA compliant

---

## Performance Optimization

### Frontend
- Server-side rendering enabled
- Automatic code splitting
- Image optimization
- CSS minification

### Backend
- In-memory caching for demo
- Efficient database queries
- API response compression
- Rate limiting ready

### Monitoring
- Vercel Analytics enabled
- Error tracking available
- Performance metrics tracked

---

## Scaling to Production

### Phase 1: Current Setup (Free)
- Vercel hosting
- In-memory database
- Simulator for testing
- ~0/month cost

### Phase 2: Add Database (Free)
- Supabase or Neon
- Persistent data storage
- Row-level security
- ~0/month cost

### Phase 3: Real Edge Devices
- Deploy on Raspberry Pi/Jetson Nano
- Real YOLOv8 object detection
- Live camera feeds
- ~$50-200 one-time hardware cost

### Phase 4: Scale Infrastructure
- Redis caching (Upstash)
- WebSocket for real-time updates
- Advanced monitoring
- ~$0-50/month cost

---

## File Structure

\`\`\`
surveillance-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── tracking/          # Tracking endpoints
│   │   ├── devices/           # Device management
│   │   ├── simulator/         # Simulator control
│   │   ├── audit/             # Audit logs
│   │   └── health/            # Health check
│   ├── tracking/              # Tracking pages
│   ├── cameras/               # Camera management
│   ├── energy/                # Energy monitoring
│   ├── alerts/                # Alert management
│   ├── map/                   # Interactive map
│   ├── control/               # Device control
│   ├── analytics/             # Analytics dashboard
│   ├── dashboard/             # Live dashboard
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── navigation.tsx         # Navigation sidebar
│   ├── header.tsx             # Header component
│   └── tracking-canvas.tsx    # Tracking visualization
├── lib/
│   ├── encryption.ts          # AES-256-GCM encryption
│   ├── db.ts                  # Database layer
│   ├── auth.ts                # Authentication
│   ├── edge-device-simulator.ts # Simulator
│   └── utils.ts               # Utilities
├── scripts/
│   └── 01-init-database.sql   # Database schema
├── public/                    # Static assets
├── .env.example               # Environment template
├── .env.local                 # Local environment (git ignored)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.mjs            # Next.js config
└── README.md                  # Documentation
\`\`\`

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

### Deployment
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Neon: https://neon.tech/docs

### Troubleshooting
1. Check browser console (F12)
2. Check Vercel logs (if deployed)
3. Review API route error messages
4. Check `.env.local` configuration

---

## Next Steps

1. ✅ Generate encryption key
2. ✅ Create `.env.local` file
3. ✅ Run `npm install && npm run dev`
4. ✅ Test all pages and features
5. ✅ Push to GitHub
6. ✅ Deploy to Vercel
7. ✅ Add environment variables in Vercel
8. ✅ Test production deployment
9. ✅ (Optional) Setup database
10. ✅ (Optional) Deploy edge devices

---

## Version Information

- **Platform**: SurveillanceOps v1.0.0
- **Status**: Production Ready
- **Last Updated**: 2025-10-28
- **License**: MIT

---

**Questions?** Check the troubleshooting section or review the API documentation in the route files.
