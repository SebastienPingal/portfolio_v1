-- Convert Project title and description from String to JSON for i18n support

-- Step 1: Add new JSON columns
ALTER TABLE "Project" 
ADD COLUMN "title_new" JSONB,
ADD COLUMN "description_new" JSONB;

-- Step 2: Copy existing data to new JSON format
-- This preserves all your existing data by duplicating it for both languages
UPDATE "Project" 
SET 
  "title_new" = json_build_object('en', "title", 'fr', "title"),
  "description_new" = json_build_object('en', "description", 'fr', "description");

-- Step 3: Drop old string columns
ALTER TABLE "Project" 
DROP COLUMN "title",
DROP COLUMN "description";

-- Step 4: Rename new columns to original names
ALTER TABLE "Project" 
RENAME COLUMN "title_new" TO "title";

ALTER TABLE "Project" 
RENAME COLUMN "description_new" TO "description";

-- Step 5: Set NOT NULL constraints
ALTER TABLE "Project" 
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL; 