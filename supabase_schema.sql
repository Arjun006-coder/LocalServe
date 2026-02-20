-- 0. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- 1. SETUP ENUMS
CREATE TYPE user_role AS ENUM ('user', 'provider');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE pricing_type AS ENUM ('fixed', 'hourly');

-- 2. CREATE PROFILES TABLE
-- This table matches your Auth sign-up metadata
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  bio TEXT,
  
  -- Occupation & Details
  occupation TEXT, -- e.g., "Plumber", "Electrician"
  occupation_type TEXT, -- "technical", "non-technical"
  
  -- Contact & Address
  phone TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  
  -- Geographical Location for Matching
  location GEOGRAPHY(POINT, 4326),
  
  -- Ratings & Stats
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  response_time TEXT,
  hourly_rate TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DISABLE ROW LEVEL SECURITY (RLS) for testing as requested
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- ... [Other Table Definitions Remain Same] ...

-- 9. AUTOMATIC PROFILE CREATION ON SIGNUP
-- Extracts full data from metadata to avoid RLS/confirmation issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    role, 
    phone, 
    city, 
    occupation, 
    bio,
    is_available,
    is_verified
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'occupation',
    new.raw_user_meta_data->>'bio',
    true,
    (CASE WHEN (new.raw_user_meta_data->>'role') = 'provider' THEN false ELSE false END) -- Defaults
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note on spatial_ref_sys Restoration:
-- If you accidentally deleted rows from spatial_ref_sys, you can restore them by:
-- 1. DROP EXTENSION postgis CASCADE; CREATE EXTENSION postgis; (Warning: Deletes all your spatial tables!)
-- 2. OR run this specific PostGIS restore command in your SQL Editor:
-- SELECT populate_geometry_columns(); 
-- If that fails, the safest way is to re-run the extension setup in a clean schema.

-- Note on spatial_ref_sys Purpose:
-- This is a PostGIS system table. It holds 1000s of records defining 
-- different coordinate systems (projections). It's required for 
-- geography/geometry calculations and is perfectly normal.

-- ... [Triggers Remain Same] ...
