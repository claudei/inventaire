-- Row Level Security (RLS) configuration for the inventaire table
-- This file configures security policies to ensure data access control

-- Enable Row Level Security on the inventaire table
ALTER TABLE inventaire ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to SELECT their own data
CREATE POLICY "Users can view their own inventory items" ON inventaire
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to INSERT their own data
CREATE POLICY "Users can insert their own inventory items" ON inventaire
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to UPDATE their own data
CREATE POLICY "Users can update their own inventory items" ON inventaire
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to DELETE their own data
CREATE POLICY "Users can delete their own inventory items" ON inventaire
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Additional security: Ensure only authenticated users can access the table
-- This policy denies all access to unauthenticated users
CREATE POLICY "Deny all access to unauthenticated users" ON inventaire
    FOR ALL
    TO anon
    USING (false);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON inventaire TO authenticated;

-- Note: The 'anon' role (unauthenticated users) will have no access due to RLS policies