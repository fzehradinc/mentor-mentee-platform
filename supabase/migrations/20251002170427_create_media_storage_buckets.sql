/*
  # Create Media Storage Buckets

  1. New Storage Buckets
    - `mentor-avatars`: Store mentor profile photos
    - `mentor-covers`: Store mentor cover photos

  2. Security Policies
    - Public read access for all
    - Authenticated users can upload/update/delete their own files
*/

-- Create mentor-avatars bucket
INSERT INTO storage.buckets (id, name)
VALUES ('mentor-avatars', 'mentor-avatars')
ON CONFLICT (id) DO NOTHING;

-- Create mentor-covers bucket
INSERT INTO storage.buckets (id, name)
VALUES ('mentor-covers', 'mentor-covers')
ON CONFLICT (id) DO NOTHING;

-- Avatar bucket policies
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mentor-avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mentor-avatars');

CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'mentor-avatars');

CREATE POLICY "Users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mentor-avatars');

-- Cover bucket policies
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'mentor-covers');

CREATE POLICY "Authenticated users can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mentor-covers');

CREATE POLICY "Users can update covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'mentor-covers');

CREATE POLICY "Users can delete covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mentor-covers');
