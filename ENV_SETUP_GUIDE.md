# Environment Variables Setup Guide

## What You Need to Do

### Step 1: Generate Encryption Key
Run this command in your terminal:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

Copy the 64-character output (example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`)

### Step 2: Create .env.local File
Create a file named `.env.local` in your project root directory with:

\`\`\`env
ENCRYPTION_KEY=your_64_character_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

Replace `your_64_character_key_here` with the key you generated in Step 1.

### Step 3: For Production (Vercel)
When deploying to Vercel:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these variables:
   - `ENCRYPTION_KEY`: Your 64-character key
   - `NEXT_PUBLIC_API_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`)
   - `NODE_ENV`: `production`

### Step 4: Test Locally
\`\`\`bash
npm run dev
\`\`\`
Visit http://localhost:3000 and go to `/tracking` page. Click "Start" button to test.

## Why These Variables?

- **ENCRYPTION_KEY**: Encrypts all tracking data for security
- **NEXT_PUBLIC_API_URL**: Tells the frontend where your API is located
- **NODE_ENV**: Tells Next.js whether you're in development or production

## Troubleshooting

If you see "generation requires environment variables":
1. Make sure `.env.local` file exists in project root
2. Restart your dev server: `npm run dev`
3. Check that ENCRYPTION_KEY is exactly 64 characters
