# 🗄️ Database Schema Export Guide

## Quick Way to Get Complete Database Schema

### Method 1: Using Supabase CLI (Recommended) ⭐

```bash
# Step 1: Install Supabase CLI
npm install supabase --save-dev

# Step 2: Login to Supabase
npx supabase login
# This opens browser for authentication

# Step 3: Link to your project
npx supabase link --project-ref ftuihzoapphxmakufpxf

# Step 4: Export complete schema
npx supabase db dump --schema-only > supabase/master-schema.sql

# Done! You now have master-schema.sql with everything
```

**What you get:**
- ✅ All tables with columns
- ✅ All constraints (primary keys, foreign keys)
- ✅ All RLS policies
- ✅ All functions and triggers
- ✅ Everything in correct order
- ✅ Ready to run on fresh Supabase project

---

### Method 2: Manual Export from Dashboard

If you can't use CLI:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: `resto` (ftuihzoapphxmakufpxf)
3. Go to **Settings → Database**
4. Click **"Generate Types"** or use SQL Editor

In SQL Editor, run this to see all tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Then manually copy CREATE statements for each table.

---

## 🔄 After Getting master-schema.sql

### Clean Up Old Migration Files

Once you have `master-schema.sql`:

```bash
# 1. Keep only these files:
supabase/
├── master-schema.sql          # ← The ONE file you need
└── README.md                  # ← Instructions

# 2. Delete all other migration files:
rm supabase/migrations/001_*.sql
rm supabase/migrations/002_*.sql
rm supabase/migrations/*.sql   # Keep only master-schema.sql and README.md

# 3. Update README to reflect new structure
```

### New Setup Process for Users

**For NEW Supabase projects:**
```sql
-- Just run ONE file:
supabase/master-schema.sql
```

**That's it!** No need to run 20+ migration files in order.

---

## 📝 Updating the Master Schema

When you make database changes:

### Option A: Re-export (Easiest)
```bash
# Make your changes in Supabase dashboard
# Then re-export:
npx supabase db dump --schema-only > supabase/master-schema.sql

# Commit the updated file
git add supabase/master-schema.sql
git commit -m "Update database schema"
```

### Option B: Add Migration File (Better for tracking)
```bash
# Create new migration for the change
echo "-- Add new column to users" > supabase/migrations/20240510_add_user_avatar.sql

# Later, when ready to consolidate:
npx supabase db dump --schema-only > supabase/master-schema.sql
```

---

## ✅ Benefits of This Approach

| Before (Many Files) | After (One File) |
|---------------------|------------------|
| ❌ 20+ migration files | ✅ 1 master file |
| ❌ Confusing order | ✅ Just run one file |
| ❌ Hard to maintain | ✅ Easy to update |
| ❌ Risk of missing steps | ✅ Complete schema |
| ❌ Documentation needed | ✅ Self-documenting |

---

## 🚀 Next Steps

1. **Install Supabase CLI**: `npm install supabase --save-dev`
2. **Login**: `npx supabase login`
3. **Link project**: `npx supabase link --project-ref ftuihzoapphxmakufpxf`
4. **Export schema**: `npx supabase db dump --schema-only > supabase/master-schema.sql`
5. **Test it**: Create a new Supabase project and run the file
6. **Clean up**: Delete old migration files
7. **Update docs**: Point users to master-schema.sql

---

## 💡 Pro Tip

Keep both approaches during transition:
- `master-schema.sql` - For new projects (recommended)
- `migrations/` folder - For reference/history (optional)

Once you're confident in master-schema.sql, delete the migrations folder entirely!
