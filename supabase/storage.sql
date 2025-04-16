
-- Create a storage bucket for company logos if it doesn't exist
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  SELECT 'company-logos', 'company-logos', true
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'company-logos'
  );

  -- Set up policy to allow public access to logos
  INSERT INTO storage.policies (name, definition, bucket_id)
  SELECT 'Public Read Access', 'true', 'company-logos'
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access' AND bucket_id = 'company-logos'
  );
END;
