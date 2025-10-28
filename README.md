# SurveillanceOps - Production-Ready Surveillance Monitoring Platform

A fully-fledged, enterprise-grade surveillance monitoring system with real-time object detection, personnel tracking, encrypted data transmission, and comprehensive analytics.

## 🚀 Quick Start (5 Minutes)

\`\`\`bash
# 1. Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Create .env.local with the key
echo "ENCRYPTION_KEY=your_64_char_key_here" > .env.local

# 3. Install and run
npm install
npm run dev

# 4. Open http://localhost:3000
\`\`\`

## ✨ Features

### Real-Time Monitoring
- Live dashboards with real-time sensor data (PIR, LDR, DHT11)
- Energy metrics (solar charging, battery levels)
- Device status monitoring
- Interactive charts and visualizations

### Object Detection & Tracking
- Real-time object and personnel movement tracking
- Encrypted data transmission (AES-256-GCM)
- Multi-object tracking with confidence scores
- Realistic edge device simulator for testing

### Interactive Map
- Geographic visualization of surveillance units
- Color-coded device status (online/offline/warning)
- Quick action buttons for device management
- Search and filter capabilities

### Historical Analytics
- Energy generation trends
- Motion detection patterns
- Environmental data analysis
- Device uptime tracking
- Alert distribution visualization

### Remote Device Control
- Power management
- Camera settings adjustment
- Recording management
- Bulk operations for multiple devices
- System diagnostics

### Security & Compliance
- AES-256-GCM encryption for all data
- Row-Level Security (RLS) policies
- API key authentication
- Comprehensive audit logging
- GDPR/CCPA compliant

## 📋 What You MUST Do Before Deployment

### 1. Generate Encryption Key (REQUIRED)
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`
Copy the 64-character output.

### 2. Create .env.local (REQUIRED)
\`\`\`env
ENCRYPTION_KEY=your_64_character_hex_string_here
NODE_ENV=development
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Test Locally
\`\`\`bash
npm run dev
# Visit http://localhost:3000
# Test /tracking page - click Start button
\`\`\`

### 5. Deploy to Vercel
1. Push code to GitHub
2. Import repository in Vercel
3. Add `ENCRYPTION_KEY` environment variable
4. Deploy

**See `SETUP_INSTRUCTIONS.md` for detailed steps**

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React 19, TypeScript |
| UI Components | shadcn/ui, Tailwind CSS v4 |
| Charts | Recharts |
| Security | AES-256-GCM Encryption |
| Database | In-memory (demo) / Supabase/Neon (prod) |
| Deployment | Vercel (free tier) |
| Monitoring | Vercel Analytics |

## 📱 Pages & Features

| Page | Features |
|------|----------|
| `/` | Dashboard overview, key metrics |
| `/dashboard` | Live sensor data, real-time charts |
| `/cameras` | Camera feeds, surveillance units |
| `/energy` | Solar charging, battery monitoring |
| `/alerts` | Alert management, notifications |
| `/map` | Interactive facility map |
| `/control` | Remote device management |
| `/analytics` | Historical data analysis |
| `/tracking` | Real-time object detection |
| `/tracking/analytics` | Tracking trends & patterns |
| `/tracking/audit` | Security audit logs |

## 🔌 API Endpoints

\`\`\`
POST   /api/tracking/update          - Submit tracking data
GET    /api/tracking/events          - Retrieve tracking events
POST   /api/devices/register         - Register device
GET    /api/devices/status           - Get device status
POST   /api/simulator/start          - Start simulator
POST   /api/simulator/stop           - Stop simulator
GET    /api/audit/logs               - Retrieve audit logs
GET    /api/health                   - System health check
\`\`\`

**See `API_DOCUMENTATION.md` for complete reference**

## 🔐 Security Features

- **Encryption**: AES-256-GCM for all tracking data
- **Authentication**: API key-based with SHA-256 hashing
- **Privacy**: No facial recognition data stored
- **Audit Trail**: Complete logging of all actions
- **Access Control**: Row-Level Security (RLS) policies
- **Compliance**: GDPR/CCPA ready

## 📊 Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $0 |
| Supabase | 500MB storage | $0 |
| Neon | 3GB storage | $0 |
| Upstash Redis | 10K commands | $0 |
| **Total** | | **$0** |

## 🚀 Deployment

### Local Development
\`\`\`bash
npm run dev
\`\`\`

### Production (Vercel)
1. Push to GitHub
2. Import in Vercel
3. Set `ENCRYPTION_KEY` environment variable
4. Deploy

**See `SETUP_INSTRUCTIONS.md` for step-by-step guide**

## 🆘 Troubleshooting

### Graphs not visible
- Ensure `ENCRYPTION_KEY` is set in `.env.local`
- Restart dev server: `npm run dev`

### Simulator won't start
- Check browser console (F12) for errors
- Verify `.env.local` has encryption key
- Refresh page

### Deployment fails
- Check Vercel build logs
- Verify environment variables are set
- Ensure `ENCRYPTION_KEY` is 64 characters

**See `SETUP_INSTRUCTIONS.md` for more troubleshooting**

## 📚 Documentation

- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `API_DOCUMENTATION.md` - API reference
- `MANUAL_SETUP_CHECKLIST.md` - Step-by-step checklist
- `DEPLOYMENT_GUIDE.md` - Deployment guide

## 🔄 Next Steps

1. ✅ Generate encryption key
2. ✅ Create `.env.local` file
3. ✅ Run `npm install && npm run dev`
4. ✅ Test all features locally
5. ✅ Push to GitHub
6. ✅ Deploy to Vercel
7. ✅ Set environment variables in Vercel
8. ✅ Test production deployment

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console (F12)
4. Verify environment variables

## 📄 License

MIT

## 👨‍💻 Version

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: 2025-10-28

---

**Ready to deploy? Start with `SETUP_INSTRUCTIONS.md`**
