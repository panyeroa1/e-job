# Deployment Guide

## Environment Variables

Before deploying to Vercel, you need to set these environment variables:

### Required Variables
- `GEMINI_API_KEY` - Your Google Gemini API key
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Vercel Deployment Steps

1. **Push to GitHub** (done automatically)

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select this GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the three variables listed above

4. **Deploy**
   - Vercel will automatically build and deploy

## Supabase Setup

Before the app works, you must run this SQL in your Supabase SQL Editor:

```sql
-- Make user_id nullable so anonymous applicants can submit
ALTER TABLE public.applicants 
ALTER COLUMN user_id DROP NOT NULL;

-- Allow anonymous inserts (REQUIRED)
CREATE POLICY "Allow anonymous inserts"
ON public.applicants
FOR INSERT
WITH CHECK (true);

-- Allow anonymous selects (REQUIRED for /applicant-resume page)
CREATE POLICY "Allow anonymous selects"
ON public.applicants
FOR SELECT
USING (true);

-- OR disable RLS on the table
```

## Local Development

```bash
npm install
npm run dev
```

Make sure `.env.local` has all required environment variables.
