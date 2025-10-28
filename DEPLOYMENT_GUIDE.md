# SurveillanceOps - Complete Deployment Guide

## Project Overview
A fully-fledged, production-ready surveillance monitoring platform with real-time object detection, personnel tracking, encrypted data transmission, and comprehensive analytics.

## Technology Stack
- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Charts**: Recharts
- **Security**: AES-256-GCM encryption, API key authentication
- **Database**: In-memory (demo) / Supabase/Neon (production)
- **Deployment**: Vercel (free tier)

## Pre-Deployment Checklist

### 1. Environment Variables (REQUIRED)
Create a `.env.local` file in the root directory with:

\`\`\`env
# Encryption Key (REQUIRED - Generate a 64-character hex string)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_64_character_hex_string_here

# Optional: Database Configuration (for production)
# DATABASE_URL=postgresql://user:password@host:port/database
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 2. Generate Encryption Key
Run this command to generate a secure encryption key:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`
Copy the output and paste it as the `ENCRYPTION_KEY` value in `.env.local`

### 3. Local Development Setup

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

### 4. Testing the System

#### Start the Tracking Simulator
1. Navigate to `/tracking` page
2. Click "Start" button to begin collecting encrypted tracking data
3. View real-time object detection in the dashboard
4. Check `/tracking/analytics` for trends and patterns
5. Review `/tracking/audit` for security logs

#### Test All Pages
- `/` - Dashboard overview
- `/dashboard` - Live sensor data and real-time metrics
- `/cameras` - Camera feeds and surveillance units
- `/energy` - Solar charging and battery monitoring
- `/alerts` - Alert management and notifications
- `/map` - Interactive facility map with device locations
- `/control` - Remote device management and bulk operations
- `/analytics` - Historical data analysis and trends
- `/tracking` - Real-time object detection and tracking
- `/tracking/analytics` - Tracking analytics and patterns
- `/tracking/audit` - Security audit logs

## Production Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial surveillance platform commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/surveillance-platform.git
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add `ENCRYPTION_KEY` with your generated key
   - Add any database URLs if using Supabase/Neon
5. Click "Deploy"

### Step 3: Set Environment Variables in Vercel
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env.local` file
4. Redeploy the project

## Database Setup (Optional - For Production)

### Using Supabase (Free Tier)
1. Go to https://supabase.com
2. Create a new project
3. Run the SQL migration from `scripts/01-init-database.sql`
4. Get your credentials from Project Settings
5. Add to `.env.local`:
   \`\`\`env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

### Using Neon (Free Tier)
1. Go to https://neon.tech
2. Create a new project
3. Get your connection string
4. Add to `.env.local`:
   \`\`\`env
   DATABASE_URL=postgresql://user:password@host:port/database
   \`\`\`

## API Endpoints Reference

### Tracking APIs
- `POST /api/tracking/update` - Submit encrypted tracking data from edge devices
- `GET /api/tracking/events` - Retrieve tracking events for a facility

### Device APIs
- `POST /api/devices/register` - Register a new surveillance device
- `GET /api/devices/status` - Get device status and health

### Simulator APIs
- `POST /api/simulator/start` - Start the edge device simulator
- `POST /api/simulator/stop` - Stop the edge device simulator

### Audit APIs
- `GET /api/audit/logs` - Retrieve audit logs for compliance

### Health Check
- `GET /api/health` - System health status

## Security Features

### Encryption
- All tracking data encrypted with AES-256-GCM
- Encryption key stored in environment variables
- Automatic key derivation for compatibility

### Authentication
- API key-based authentication for edge devices
- API keys hashed with SHA-256 before storage
- Support for Supabase Auth (optional)

### Data Privacy
- No facial recognition data stored
- Only bounding boxes and metadata retained
- Automatic data purging (configurable)
- Row-Level Security (RLS) policies in database

### Audit Logging
- All API calls logged with timestamps
- IP address tracking for security
- Success/failure status recording
- Compliance-ready audit trail

## Troubleshooting

### Issue: Graphs not visible
**Solution**: Ensure `ENCRYPTION_KEY` is set in environment variables

### Issue: Simulator not starting
**Solution**: 
1. Check browser console for errors
2. Verify API routes are accessible
3. Ensure encryption key is properly configured

### Issue: Data not persisting
**Solution**: 
1. For demo: Data is stored in-memory (resets on server restart)
2. For production: Configure Supabase or Neon database

### Issue: API key errors
**Solution**: 
1. Regenerate API key by restarting simulator
2. Check that API key is being sent in `x-api-key` header

## Performance Optimization

### Frontend
- Server-side rendering for initial load
- Client-side caching with SWR
- Lazy loading for charts and analytics
- Optimized image loading

### Backend
- In-memory caching for frequently accessed data
- Efficient database queries with indexing
- Compression for API responses
- Rate limiting ready (implement as needed)

## Scaling Considerations

### For Production
1. **Database**: Migrate from in-memory to Supabase/Neon
2. **Real-time**: Implement WebSocket for live updates
3. **Edge Processing**: Deploy YOLOv8 on Raspberry Pi/Jetson Nano
4. **Caching**: Add Redis (Upstash) for session management
5. **Monitoring**: Integrate Grafana/Prometheus for metrics

### Cost Breakdown (Monthly)
| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $0 |
| Supabase | 500MB storage | $0 |
| Neon | 3GB storage | $0 |
| Upstash Redis | 10K commands | $0 |
| **Total** | | **$0** |

## Support & Documentation

### API Documentation
All API routes include JSDoc comments with:
- Request/response schemas
- Error handling
- Authentication requirements
- Example usage

### Component Documentation
All React components include:
- PropTypes/TypeScript interfaces
- Usage examples
- Accessibility features
- Performance notes

### Database Schema
See `scripts/01-init-database.sql` for:
- Table definitions
- Indexes
- RLS policies
- Constraints

## Next Steps

1. **Generate encryption key** and add to `.env.local`
2. **Test locally** with `npm run dev`
3. **Push to GitHub** and deploy to Vercel
4. **Configure environment variables** in Vercel dashboard
5. **Test all features** in production
6. **Monitor performance** with Vercel Analytics

## Contact & Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation in route files
3. Check browser console for error messages
4. Verify all environment variables are set correctly

---

**Last Updated**: 2025-10-28
**Version**: 1.0.0
**Status**: Production Ready
