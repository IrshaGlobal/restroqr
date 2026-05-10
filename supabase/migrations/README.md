# Database Migrations Guide

## 📋 How to Set Up Database

### For NEW Supabase Projects (Fresh Install)

Run this **ONE file** in order:

1. **`001_initial_schema.sql`** - Creates all tables and basic structure
2. **Then run migrations in numerical order** (002, 003, 004, etc.)

Or use Supabase CLI:
```bash
supabase db reset  # Runs all migrations in order
```

### For EXISTING Projects (Updates)

Only run migrations that were added after your last update.
Check the migration dates/timestamps to see what's new.

---

## 📁 Migration Files

### Core Schema
- `001_initial_schema.sql` - Complete database setup (tables, RLS, functions)

### Feature Additions
- `002_add_customization_support.sql` - Menu item customizations/add-ons
- `003_add_delivery_support.sql` - Delivery order functionality
- `004_add_staff_management.sql` - Staff accounts and roles

### Bug Fixes & Improvements
- `005_fix_rls_policies.sql` - Security policy fixes
- `006_fix_order_types.sql` - Order type constraint fixes
- `007_add_staff_display_name.sql` - Staff display name support

### Diagnostic Scripts (NOT migrations - for debugging only)
- `diagnostic_check_policies.sql` - Check RLS policies
- `check_restaurant_count.sql` - Verify restaurant data
- `test_create_staff_user.sql` - Test staff creation
- `test_display_name.sql` - Test display name functionality

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
