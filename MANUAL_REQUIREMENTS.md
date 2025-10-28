# ⚠️ MANUAL REQUIREMENTS - What You MUST Do

## This document explicitly lists EVERYTHING you need to do manually before deployment

---

## 🔴 CRITICAL - MUST DO THESE

### 1. Generate Encryption Key
**What**: Create a secure encryption key for data protection
**How**: Open terminal and run this command:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`
**Result**: You'll get a 64-character string like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`
**Action**: Copy this string and save it somewhere safe

### 2. Create .env.local File
**What**: Create a configuration file with your encryption key
**How**: 
1. In the project root directory, create a new file named `.env.local`
2. Add this line: `ENCRYPTION_KEY=` followed by your 64-character key
3. Add this line: `NODE_ENV=development`
4. Save the file

**Example .env.local**:
\`\`\`env
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
NODE_ENV=development
\`\`\`

**Important**: 
- This file should NOT be committed to GitHub (it's in .gitignore)
- Keep this file secret
- Never share your encryption key

### 3. Install Dependencies
**What**: Download all required packages
**How**: Open terminal in project root and run:
\`\`\`bash
npm install
\`\`\`
**Result**: All packages will be installed in `node_modules` folder
**Time**: 2-5 minutes

### 4. Test Locally
**What**: Verify everything works on your computer
**How**: 
1. Run: `npm run dev`
2. Open http://localhost:3000 in browser
3. Go to `/tracking` page
4. Click "Start" button
5. Wait 3-5 seconds
6. Verify data appears
7. Click "Stop" button

**Expected Result**: 
- Page loads without errors
- Simulator starts and collects data
- Statistics update in real-time
- No console errors (F12 to check)

---

## 🟡 FOR VERCEL DEPLOYMENT

### 5. Push Code to GitHub
**What**: Upload your code to GitHub
**How**: 
\`\`\`bash
git init
git add .
git commit -m "Initial surveillance platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/surveillance-platform.git
git push -u origin main
\`\`\`

**Prerequisites**:
- GitHub account (create at https://github.com)
- Git installed on your computer
- Repository created on GitHub

**Result**: Your code is now on GitHub

### 6. Deploy to Vercel
**What**: Deploy your application to Vercel's servers
**How**:
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"
6. Wait for deployment to complete (2-3 minutes)

**Result**: Your app is deployed and has a public URL

### 7. Add Environment Variables in Vercel
**What**: Tell Vercel your encryption key
**How**:
1. In Vercel dashboard, go to your project
2. Click "Settings"
3. Click "Environment Variables"
4. Click "Add New"
5. **Name**: `ENCRYPTION_KEY`
6. **Value**: Your 64-character key
7. **Environments**: Select all (Production, Preview, Development)
8. Click "Save"
9. Go to "Deployments"
10. Click "Redeploy" on the latest deployment
11. Wait for redeployment to complete

**Result**: Your production app now has the encryption key

### 8. Test Production
**What**: Verify your deployed app works
**How**:
1. Click the deployment URL in Vercel
2. Go to `/tracking` page
3. Click "Start" button
4. Wait 3-5 seconds
5. Verify data appears
6. Test other pages

**Expected Result**: Everything works like it did locally

---

## 🟢 OPTIONAL - DATABASE SETUP

### 9. Setup Supabase (Optional)
**What**: Add persistent database for production
**When**: Only if you want data to persist after server restart
**How**:
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for initialization
5. Go to "SQL Editor"
6. Create new query
7. Paste contents of `scripts/01-init-database.sql`
8. Execute query
9. Go to "Project Settings" → "API"
10. Copy `Project URL` and add to `.env.local` as `SUPABASE_URL`
11. Copy `anon public` and add as `SUPABASE_ANON_KEY`
12. Copy `service_role secret` and add as `SUPABASE_SERVICE_ROLE_KEY`
13. Restart dev server: `npm run dev`

**Result**: Your data now persists in Supabase

---

## ✅ VERIFICATION CHECKLIST

Before considering setup complete, verify:

### Local Development
- [ ] `.env.local` file exists in project root
- [ ] `ENCRYPTION_KEY` is set in `.env.local`
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts successfully
- [ ] http://localhost:3000 loads
- [ ] `/tracking` page works
- [ ] Simulator starts and collects data
- [ ] All pages load without errors
- [ ] Browser console has no errors (F12)

### Vercel Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] `ENCRYPTION_KEY` added to Vercel environment variables
- [ ] Deployment completed successfully
- [ ] Production URL loads
- [ ] `/tracking` page works in production
- [ ] All pages accessible
- [ ] No console errors

---

## 🚨 COMMON MISTAKES

### ❌ Mistake 1: Forgetting to create .env.local
**Problem**: App won't start, error about ENCRYPTION_KEY
**Solution**: Create `.env.local` with your encryption key

### ❌ Mistake 2: Wrong encryption key format
**Problem**: Encryption errors when simulator runs
**Solution**: Ensure key is exactly 64 characters (hex string)

### ❌ Mistake 3: Committing .env.local to GitHub
**Problem**: Your encryption key is exposed publicly
**Solution**: Add to `.gitignore` (already done by default)

### ❌ Mistake 4: Forgetting to set environment variables in Vercel
**Problem**: Production app crashes with ENCRYPTION_KEY error
**Solution**: Add `ENCRYPTION_KEY` to Vercel environment variables

### ❌ Mistake 5: Not redeploying after adding environment variables
**Problem**: Production app still doesn't have the key
**Solution**: Click "Redeploy" in Vercel after adding variables

---

## 📝 STEP-BY-STEP SUMMARY

### Day 1: Setup (30 minutes)
1. Generate encryption key (5 min)
2. Create `.env.local` file (2 min)
3. Run `npm install` (5 min)
4. Test locally with `npm run dev` (10 min)
5. Verify all pages work (8 min)

### Day 2: Deploy (20 minutes)
1. Push to GitHub (5 min)
2. Deploy to Vercel (10 min)
3. Add environment variables (3 min)
4. Test production (2 min)

### Total Time: ~50 minutes

---

## 🎯 FINAL CHECKLIST

Before you're done:

- [ ] Encryption key generated
- [ ] `.env.local` created
- [ ] Dependencies installed
- [ ] Local testing complete
- [ ] Code on GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Production testing complete

**Once all items are checked, you're done! 🎉**

---

## 📞 IF SOMETHING GOES WRONG

### Check These First
1. Browser console (F12) for error messages
2. `.env.local` file exists and has correct key
3. `ENCRYPTION_KEY` is exactly 64 characters
4. Vercel environment variables are set
5. Vercel deployment completed successfully

### Common Error Messages

**"ENCRYPTION_KEY is not defined"**
- Solution: Add `ENCRYPTION_KEY` to `.env.local`

**"Cannot find module 'crypto'"**
- Solution: Ensure Node.js 18+ is installed

**"Failed to start simulator"**
- Solution: Check browser console, verify encryption key

**"Deployment failed"**
- Solution: Check Vercel build logs, verify environment variables

---

**That's it! You now know exactly what to do. Start with Step 1 above.**
