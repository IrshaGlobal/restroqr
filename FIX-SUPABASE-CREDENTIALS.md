# 🚨 IMMEDIATE ACTION REQUIRED - Fix Supabase Connection

## Quick Summary
Your Supabase secret key was exposed in test files and has been **revoked by Supabase**. Your app is currently broken.

---

## ✅ What's Already Done
- [x] Exposed test files removed from repository
- [x] `.gitignore` updated to prevent future exposure
- [x] Security incident report created
- [x] Changes pushed to both GitHub repos

---

## 🔧 What You Need to Do NOW

### Step 1: Get New Supabase Credentials (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click on your project: **resto** (ftuihzoapphxmakufpxf)
3. Go to **Settings → API** (left sidebar)
4. Find **Project API keys** section
5. Copy the **`anon` `public`** key (NOT the service_role key!)
   - It should start with `eyJhbGciOi...`
   - This is SAFE to use in frontend code

### Step 2: Update Local .env File (1 minute)

Open `.env` file in your project root and update:

```env
VITE_SUPABASE_URL=https://ftuihzoapphxmakufpxf.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-new-anon-key-here
```

**IMPORTANT:** Use the **anon/public** key, NOT the service_role key!

### Step 3: Update Vercel Environment Variables (2 minutes)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project (connected to `IrshaGlobal/restroqr`)
3. Go to **Settings → Environment Variables**
4. Update or add these variables:
   ```
   VITE_SUPABASE_URL = https://ftuihzoapphxmakufpxf.supabase.co
   VITE_SUPABASE_ANON_KEY = <your-new-anon-key>
   ```
5. Click **Save**

### Step 4: Redeploy to Vercel (3 minutes)

1. In Vercel dashboard, go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
   OR
3. Push a small change to trigger auto-deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy with new credentials"
   git push origin main
   git push restroqr main
   ```

### Step 5: Test Everything (2 minutes)

After deployment completes (~2 minutes):

1. Visit your Vercel URL
2. Try accessing:
   - ✅ `/login` - Should load without 404
   - ✅ `/food` - Should show food landing page
   - ✅ `/menu?table=1&restaurant=demo` - Should show menu
3. Try logging in as admin/staff
4. Verify database connection works

---

## 🎯 Why This Happened

**Short version:** Test files with hardcoded credentials were committed to git, then repo was made public.

**Details:** See `SECURITY-INCIDENT-REPORT.md` for full analysis.

---

## 🔐 Going Forward - Best Practices

### DO ✅
- Use environment variables for ALL credentials
- Only use `anon` (public) key in frontend code
- Add test files to `.gitignore`
- Keep service_role keys SECRET (backend only)
- Enable GitHub secret scanning

### DON'T ❌
- Never hardcode credentials in code
- Never commit `.env` files
- Never use service_role key in browser
- Never commit test/debug files with credentials
- Never make repo public without checking history

---

## 📋 Checklist Summary

- [ ] Get new anon key from Supabase dashboard
- [ ] Update local `.env` file
- [ ] Update Vercel environment variables
- [ ] Trigger Vercel redeployment
- [ ] Wait for deployment to complete (~2 min)
- [ ] Test all routes work
- [ ] Test login functionality
- [ ] Test database queries work
- [ ] Review SECURITY-INCIDENT-REPORT.md

---

## 🆘 If Something Doesn't Work

### App still can't connect to Supabase?
- Double-check you're using the **anon** key, not service_role
- Verify the URL is correct: `https://ftuihzoapphxmakufpxf.supabase.co`
- Check Vercel environment variables are set correctly
- Look at browser console for error messages

### Routes still showing 404?
- The SPA routing fix is already deployed
- Clear browser cache (Ctrl+Shift+R)
- Check Vercel deployment completed successfully
- Verify `vercel.json` has the rewrite rules

### Login not working?
- Check Supabase auth is enabled in dashboard
- Verify RLS policies are set up correctly
- Check browser console for auth errors

---

## 📞 Need Help?

1. Check browser console (F12) for error messages
2. Check Vercel deployment logs
3. Check Supabase logs (Dashboard → Logs)
4. Review the full security report: `SECURITY-INCIDENT-REPORT.md`

---

**Estimated Time to Fix:** 10 minutes  
**Priority:** CRITICAL - App is currently broken  
**Status:** Ready to fix - follow steps above
