-- create_tables.sql
-- SQL (PostgreSQL) schema for tattty CSV imports
-- Purpose: Create schema and tables matching the provided CSVs:
--  - aspect_ratio_display - Sheet1.csv (header: aspect_ratio_id,aspect_ratio)
--  - color_display - Sheet1.csv (header: color_id,color_name,color_description)
--  - style_display - Sheet1.csv (header: styke_id,style_name,description,image_url)
--
-- Notes:
-- 1) The style CSV header contains a typo "styke_id". This file creates a column named
--    styke_id to match the CSV header so psql \copy with CSV HEADER will map correctly.
--    If you prefer "style_id", run the provided ALTER TABLE RENAME COLUMN after import.
-- 2) The CSVs appear to have blank values in the leading id columns (leading commas).
--    The schema uses text columns for the original CSV ids to preserve whatever values exist.
-- 3) This file contains DDL only. The psql client-side \copy commands are included below
--    as commented examples. You cannot run server-side COPY on Neon to read local files,
--    so use psql's \copy from the client machine that holds the CSV files.

-- Use the public schema for these tables (as requested).
-- Tables will be created in public schema and seeded data will use rsl = 'public'.
SET search_path = public;

-- ====================================================
-- aspect_ratio_display table
-- CSV header: aspect_ratio_id,aspect_ratio
-- ====================================================
CREATE TABLE IF NOT EXISTS public.aspect_ratio_display (
  id bigserial PRIMARY KEY,
  aspect_ratio_id text,              -- original CSV id (may be blank)
  aspect_ratio text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS aspect_ratio_display_aspect_ratio_idx
  ON public.aspect_ratio_display (aspect_ratio);

-- Insert initial aspect ratios
INSERT INTO public.aspect_ratio_display (aspect_ratio_id, aspect_ratio) VALUES
  ('AR1','1:1'),
  ('AR2','4:3'),
  ('AR3','3:2'),
  ('AR4','16:9'),
  ('AR5','9:16'),
  ('AR6','21:9'),
  ('AR7','5:4'),
  ('AR8','16:10')
ON CONFLICT DO NOTHING;

-- ====================================================
-- color_display table
-- CSV header: color_id,color_name,color_description
-- ====================================================
CREATE TABLE IF NOT EXISTS public.color_display (
  id bigserial PRIMARY KEY,
  color_id text,                      -- original CSV id (may be blank)
  color_name text NOT NULL,
  color_description text,
  rsl text,                           -- requested field, e.g. 'public'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- NOTE: Removed automatic unique constraint on color_name to allow multiple rows
--       each with its own unique color_id as requested by the user.
--       If you want to re-enable uniqueness on color_name later, uncomment the
--       ALTER TABLE statement below.
-- ALTER TABLE IF EXISTS tattty.color_display
--   ADD CONSTRAINT IF NOT EXISTS color_display_color_name_key UNIQUE (color_name);

-- Insert initial colors from provided CSV (each row given a unique color_id).
-- Uses VALUES -> SELECT pattern and checks color_id to avoid inserting the same seed twice.
INSERT INTO public.color_display (color_id, color_name, color_description, rsl)
SELECT v.color_id, v.color_name, v.color_description, v.rsl
FROM (VALUES
  ('C01','Monochrome (Purple)','Single-color purple designs with varying shades','public'),
  ('C02','black','Solid black ink tattoos','public'),
  ('C03','Neon / High-Vibrancy','Extremely bright, fluorescent colors','public'),
  ('C04','Jewel Tones','Rich, saturated colors resembling gemstones','public'),
  ('C05','Black & Grey Only','Tattoos using only black and grey ink','public'),
  ('C06','Duotone','Two-color designs with specific color combinations','public'),
  ('C07','High-Saturation','Intensely saturated, vibrant colors','public'),
  ('C08','Pastel','Soft, muted colors with low saturation','public'),
  ('C09','Full Color','Tattoos utilizing a full spectrum of colors','public'),
  ('C10','blue','Various shades of blue ink','public'),
  ('C11','Black & Grey','Traditional black and grey tattoo style','public'),
  ('C12','green','Various shades of green ink','public'),
  ('C13','white','White ink tattoos, often used for highlights','public'),
  ('C14','yellow','Various shades of yellow ink','public'),
  ('C15','Sepia','Brown-toned colors resembling antique photographs','public'),
  ('C16','Monochrome (Blue)','Single-color blue designs with varying shades','public'),
  ('C17','red','Various shades of red ink','public'),
  ('C18','Monochrome (Red)','Single-color red designs with varying shades','public'),
  ('C19','Muted / Earth Tones','Subdued, natural colors inspired by earth elements','public'),
  ('C20','Monochrome (Green)','Single-color green designs with varying shades','public'),
  ('C21','White-Ink Accents','White ink used for highlights and accents','public')
) AS v(color_id, color_name, color_description, rsl)
WHERE NOT EXISTS (
  SELECT 1 FROM public.color_display d WHERE d.color_id = v.color_id
);

-- ====================================================
-- style_display table
-- CSV header: styke_id,style_name,description,image_url
-- Note: header typo 'styke_id' preserved to match CSV header.
-- ====================================================
CREATE TABLE IF NOT EXISTS public.style_display (
  id bigserial PRIMARY KEY,
  style_id text,                       -- renamed from CSV header 'styke_id' -> use 'style_id'
  style_name text NOT NULL,
  description text,
  image_url text,
  rsl text,                            -- requested field, e.g. 'public'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- NOTE: Removed automatic unique constraint on style_name to allow multiple rows
--       each with its own unique styke_id as requested by the user.
--       If you want to re-enable uniqueness on style_name later, uncomment the
--       ALTER TABLE statement below.
-- ALTER TABLE IF EXISTS tattty.style_display
--   ADD CONSTRAINT IF NOT EXISTS style_display_style_name_key UNIQUE (style_name);

-- Insert initial styles from provided CSV (each row given a unique style_id).
INSERT INTO public.style_display (style_id, style_name, description, image_url, rsl)
SELECT v.style_id, v.style_name, v.description, v.image_url, v.rsl
FROM (VALUES
  ('S001','Neo-Traditional','Modern take on traditional tattoo styles with more dimension and detail', NULL, 'public'),
  ('S002','Neo-Traditional','Modern take on traditional tattoo styles with more dimension and detail', NULL, 'public'),
  ('S003','Minimal','Simple, clean designs with minimal detail and shading', NULL, 'public'),
  ('S004','Abstract','Non-representational designs focusing on shapes, colors, and forms', NULL, 'public'),
  ('S005','Dotwork / Pointillism','Tattoos created entirely or primarily using dots', NULL, 'public'),
  ('S006','Surreal','Dreamlike, fantastical designs inspired by surrealism art movement', NULL, 'public'),
  ('S007','New School','Cartoonish, exaggerated designs with bold outlines and vibrant colors', NULL, 'public'),
  ('S008','3D / Anaglyph','Tattoos that create optical illusions of depth and dimension', NULL, 'public'),
  ('S009','Mandala','Circular, geometric designs originating from spiritual traditions', NULL, 'public'),
  ('S010','Sketch / Etching / Engraving','Tattoos that mimic hand-drawn sketches or engraved artwork', NULL, 'public'),
  ('S011','Glitch / Vaporwave','Digital-inspired designs with glitch effects and retro-futuristic aesthetics', NULL, 'public'),
  ('S012','UV / Blacklight','Tattoos that are visible primarily under ultraviolet light', NULL, 'public'),
  ('S013','Japanese / Irezumi','Traditional Japanese tattoo art with specific motifs and techniques', NULL, 'public'),
  ('S014','Ornamental','Decorative patterns and designs inspired by various cultural traditions', NULL, 'public'),
  ('S015','Blackwork','Tattoos using solid black ink, often with geometric or pattern-based designs', NULL, 'public'),
  ('S016','Script / Calligraphy / Gothic','Text-based tattoos featuring various writing styles and fonts', NULL, 'public'),
  ('S017','Trash Polka','Combination of realistic images and typographic elements with red/black color scheme', NULL, 'public'),
  ('S018','Watercolor','Tattoos that mimic the appearance of watercolor paintings', NULL, 'public'),
  ('S019','Pixel / 8-bit','Tattoos inspired by retro video game graphics and pixel art', NULL, 'public'),
  ('S020','American Traditional (Old School)','Classic tattoo style with bold outlines and limited color palette', NULL, 'public'),
  ('S021','Negative Space','Designs that use the absence of ink to create shapes and patterns', NULL, 'public'),
  ('S022','Bio-organic','Organic, biological-looking designs often with surreal or sci-fi elements', NULL, 'public'),
  ('S023','Anime / Manga','Tattoos inspired by Japanese animation and comic art styles', NULL, 'public'),
  ('S024','Celtic / Nordic','Tattoos featuring traditional Celtic knots and Norse mythology motifs', NULL, 'public'),
  ('S025','Biomechanical','Combination of biological and mechanical elements, often with a sci-fi aesthetic', NULL, 'public'),
  ('S026','Tribal (Polynesian / Māori / Samoan / Marquesan)','Traditional patterns and designs from various indigenous cultures', NULL, 'public'),
  ('S027','Sticker / Patch','Tattoos designed to look like stickers or fabric patches', NULL, 'public'),
  ('S028','Black & Grey','Tattoos using only black and grey ink, often with realistic shading', NULL, 'public'),
  ('S029','Micro-Realism','Extremely detailed, small-scale realistic tattoos', NULL, 'public'),
  ('S030','Realism','Photorealistic tattoos that accurately depict subjects', NULL, 'public'),
  ('S031','Geometric','Tattoos based on geometric shapes, patterns, and symmetry', NULL, 'public'),
  ('S032','Cyberpunk / Futuristic','Tattoos inspired by futuristic, high-tech, and dystopian themes', NULL, 'public'),
  ('S033','Comic / Cartoon','Tattoos inspired by comic book art and cartoon styles', NULL, 'public'),
  ('S034','Linework','Tattoos focusing on clean lines and minimal shading', NULL, 'public'),
  ('S035','Illustrative','Tattoos that resemble detailed illustrations or drawings', NULL, 'public'),
  ('S036','Fine Line / Single Needle','Delicate tattoos created with very fine lines using single needles', NULL, 'public'),
  ('S037','Chicano / Lettering','Tattoo style originating from Chicano culture, often featuring elaborate lettering', NULL, 'public')
) AS v(style_id, style_name, description, image_url, rsl)
WHERE NOT EXISTS (
  SELECT 1 FROM public.style_display d WHERE d.style_id = v.style_id
);

-- ====================================================
-- Optional: Case-insensitive uniqueness examples
-- If you prefer color_name or style_name to be unique ignoring case,
-- create an index on lower(column) instead of the simple unique constraint above.
-- Example (uncomment to use):
-- CREATE UNIQUE INDEX IF NOT EXISTS color_display_color_name_lower_idx
--   ON tattty.color_display (lower(color_name));
--
-- CREATE UNIQUE INDEX IF NOT EXISTS style_display_style_name_lower_idx
--   ON tattty.style_display (lower(style_name));
-- ====================================================

-- ====================================================
-- Example client-side import commands (psql \copy)
-- Run these from the directory that contains the CSV files.
-- Replace the $DATABASE_URL below with your Neon connection string,
-- or run `psql "<DATABASE_URL>"` then run the \copy commands inside psql.
-- ====================================================

-- Example: set search_path first
-- psql "$DATABASE_URL" -c "SET search_path = public;"

-- aspect_ratio import (header: aspect_ratio_id,aspect_ratio)
-- \copy public.aspect_ratio_display(aspect_ratio_id,aspect_ratio) FROM 'aspect_ratio_display - Sheet1.csv' CSV HEADER;

-- color import (header: color_id,color_name,color_description)
-- \copy public.color_display(color_id,color_name,color_description,rsl) FROM 'color_display - Sheet1.csv' CSV HEADER;

-- style import (header: style_id,style_name,description,image_url)
-- \copy public.style_display(style_id,style_name,description,image_url,rsl) FROM 'style_display - Sheet1.csv' CSV HEADER;

-- ====================================================
-- Import notes and troubleshooting
-- - If import fails due to unique constraint violations:
--     * Clean duplicates in CSV, or
--     * Import into staging tables without unique constraints, then deduplicate:
--         CREATE TABLE tattty.color_display_staging (LIKE tattty.color_display INCLUDING DEFAULTS);
--         \copy tattty.color_display_staging(color_id,color_name,color_description) FROM 'color_display - Sheet1.csv' CSV HEADER;
--         INSERT INTO tattty.color_display (color_id,color_name,color_description)
--           SELECT DISTINCT color_id,color_name,color_description FROM tattty.color_display_staging
--           ON CONFLICT (color_name) DO NOTHING;
-- - If you need to normalize casing before uniqueness, use lower() in insert/select or use
--   a generated normalized column with a unique index on lower(normalized_name).
-- - After import, you may want to add foreign keys or relationships to other tables in your DB.
-- ====================================================

-- ====================================================
-- Optional tidy-up note (no action required): we already renamed styke_id -> style_id
-- in the table definition above. If you previously imported CSVs using the old header
-- 'styke_id' you can either:
--  * import into a staging table and map columns, or
--  * use ALTER TABLE public.style_display RENAME COLUMN styke_id TO style_id;
-- (The current SQL uses style_id in public.style_display.)
-- ====================================================
