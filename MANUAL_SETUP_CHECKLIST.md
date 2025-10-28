# Manual Setup Checklist - What You MUST Do

## ✅ REQUIRED STEPS (Must Complete Before Deployment)

### 1. Generate Encryption Key
- [ ] Open terminal
- [ ] Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Copy the 64-character output
- [ ] Save it somewhere safe

### 2. Create .env.local File
- [ ] Create file named `.env.local` in project root
- [ ] Add: `ENCRYPTION_KEY=your_64_char_key`
- [ ] Add: `NODE_ENV=development`
- [ ] Save file
- [ ] Verify it's in `.gitignore` (should be by default)

### 3. Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] No errors should appear

### 4. Test Locally
- [ ] Run: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test `/tracking` page
- [ ] Click "Start" button
- [ ] Wait 3-5 seconds
- [ ] Verify data appears
- [ ] Click "Stop" button

### 5. Test All Pages
- [ ] `/` - Home page loads
- [ ] `/dashboard` - Charts visible
- [ ] `/cameras` - Camera cards visible
- [ ] `/energy` - Energy charts visible
- [ ] `/alerts` - Alerts page loads
- [ ] `/map` - Map displays
- [ ] `/control` - Control panel loads
- [ ] `/analytics` - Analytics charts visible
- [ ] `/tracking` - Tracking page works
- [ ] `/tracking/analytics` - Tracking analytics visible
- [ ] `/tracking/audit` - Audit logs visible

---

## ✅ FOR VERCEL DEPLOYMENT

### 1. Push to GitHub
- [ ] Create GitHub account (if needed)
- [ ] Create new repository
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Run: `git branch -M main`
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/repo.git`
- [ ] Run: `git push -u origin main`

### 2. Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up/login with GitHub
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"
- [ ] Wait for build to complete

### 3. Add Environment Variables in Vercel
- [ ] In Vercel dashboard, go to your project
- [ ] Click "Settings"
- [ ] Click "Environment Variables"
- [ ] Add variable: `ENCRYPTION_KEY` = your_64_char_key
- [ ] Add variable: `NODE_ENV` = `production`
- [ ] Click "Save"
- [ ] Go to "Deployments"
- [ ] Click "Redeploy" on latest deployment
- [ ] Wait for deployment to complete

### 4. Test Production
- [ ] Click deployment URL
- [ ] Test `/tracking` page
- [ ] Verify simulator works
- [ ] Test all pages load
- [ ] Check browser console for errors

---

## ✅ OPTIONAL - DATABASE SETUP

### For Supabase
- [ ] Go to https://supabase.com
- [ ] Create new project
- [ ] Wait for initialization
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Paste contents of `scripts/01-init-database.sql`
- [ ] Execute query
- [ ] Go to Project Settings → API
- [ ] Copy `Project URL` → Add as `SUPABASE_URL` to `.env.local`
- [ ] Copy `anon public` → Add as `SUPABASE_ANON_KEY` to `.env.local`
- [ ] Copy `service_role secret` → Add as `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- [ ] Restart dev server: `npm run dev`

### For Neon
- [ ] Go to https://neon.tech
- [ ] Create new project
- [ ] Copy connection string
- [ ] Add as `DATABASE_URL` to `.env.local`
- [ ] Restart dev server: `npm run dev`

---

## ✅ VERIFICATION CHECKLIST

### Before Deployment
- [ ] `.env.local` file exists with `ENCRYPTION_KEY`
- [ ] `npm run dev` works without errors
- [ ] All pages load correctly
- [ ] Tracking simulator works
- [ ] No console errors in browser
- [ ] `.env.local` is in `.gitignore`

### After Vercel Deployment
- [ ] Deployment completed successfully
- [ ] Environment variables are set in Vercel
- [ ] Website loads from Vercel URL
- [ ] All pages work correctly
- [ ] Tracking simulator works
- [ ] No console errors

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ Don't
- Don't commit `.env.local` to GitHub
- Don't share your encryption key
- Don't use the same key for dev and prod
- Don't forget to set environment variables in Vercel
- Don't skip the encryption key generation
- Don't deploy without testing locally first

### ✅ Do
- Do generate a strong encryption key
- Do keep `.env.local` in `.gitignore`
- Do test all features before deploying
- Do set environment variables in Vercel dashboard
- Do use HTTPS in production (Vercel does this)
- Do monitor the application after deployment

---

## 🆘 TROUBLESHOOTING

### "ENCRYPTION_KEY is not defined"
1. Check `.env.local` exists
2. Verify `ENCRYPTION_KEY=` line is there
3. Restart dev server: `npm run dev`

### Simulator won't start
1. Check browser console (F12)
2. Verify `.env.local` has encryption key
3. Refresh page
4. Try again

### Deployment fails
1. Check Vercel build logs
2. Verify environment variables are set
3. Ensure `ENCRYPTION_KEY` is exactly 64 characters
4. Try redeploying

### Pages not loading
1. Check browser console for errors
2. Verify all dependencies installed: `npm install`
3. Restart dev server
4. Clear browser cache

---

## 📋 FINAL CHECKLIST

Before considering the setup complete:

- [ ] Encryption key generated and saved
- [ ] `.env.local` created with encryption key
- [ ] `npm install` completed
- [ ] `npm run dev` works
- [ ] All pages tested locally
- [ ] Tracking simulator tested
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Production deployment tested
- [ ] All features working in production

---

**Once all items are checked, your surveillance platform is ready for production use!**
