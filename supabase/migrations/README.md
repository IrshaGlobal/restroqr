# Database Setup Guide

## 🚀 Quick Start - ONE FILE SETUP

**For NEW Supabase projects, just run ONE file:**

```
supabase/master-schema.sql
```

That's it! This single file contains:
- ✅ All database tables
- ✅ All Row Level Security (RLS) policies  
- ✅ All functions and triggers
- ✅ Storage bucket configuration
- ✅ Everything in correct order

### How to Run:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Copy entire contents of `supabase/master-schema.sql`
5. Paste and click **Run**
6. Done! 🎉

---

## 📁 File Structure

```
supabase/
├── master-schema.sql          # ← THE ONLY FILE YOU NEED
├── migrations/                # ← Historical reference (optional)
│   ├── 001_initial_schema.sql
│   ├── 002_add_delivery_support.sql
│   └── ... (other migration files)
└── README.md                  # ← This file
```

**For new projects:** Just use `master-schema.sql`  
**The migrations folder** is kept for historical reference only.

---

## 🔄 Updating the Database Schema

When you make changes to your database:

### Option 1: Manual Update (Simple)
1. Make changes in Supabase Dashboard
2. Update `master-schema.sql` manually
3. Commit and push to git

### Option 2: Export from Supabase (Advanced)
If you have Docker installed:
```bash
npm install supabase --save-dev
npx supabase login
npx supabase link --project-ref ftuihzoapphxmakufpxf
npx supabase db dump --linked -f supabase/master-schema.sql
```

---

## ⚠️ Important Notes

1. **ALWAYS run migrations in order** (001 → 002 → 003...)
2. **NEVER skip migrations** - each builds on the previous
3. **Diagnostic scripts** are for troubleshooting, not setup
4. **Test files** (test_*.sql) are for development only

---

## 🔄 Using Supabase CLI (Recommended)

Instead of manually running SQL files:

```bash
# Install Supabase CLI
npm install supabase --save-dev

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ftuihzoapphxmakufpxf

# Reset database (runs all migrations in order)
supabase db reset

# Push new migrations to production
supabase db push
```

This automatically tracks which migrations have been run!

---

## 🆘 Troubleshooting

### "Migration already applied" error?
You've already run this migration. Skip it or use `supabase db reset` to start fresh.

### "Table already exists" error?
You're running migrations out of order or twice. Use Supabase CLI to track state.

### Need to fix something urgently?
Create a new migration file with next number (e.g., `008_fix_issue.sql`) rather than editing old ones.

---

## 📝 Migration Naming Convention

Format: `NNN_description.sql`
- NNN = Sequential number (001, 002, 003...)
- description = What this migration does

Examples:
- `001_initial_schema.sql`
- `002_add_categories.sql`
- `003_fix_rls_policies.sql`
