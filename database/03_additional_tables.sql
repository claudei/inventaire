-- Additional tables for the inventaire application
-- Based on the analysis of index.html, the app also manages projects and movements

-- Table for categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Users can manage their own categories" ON categories
    FOR ALL USING (auth.uid() = user_id);

-- Table for projects
CREATE TABLE IF NOT EXISTS projets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Users can manage their own projects" ON projets
    FOR ALL USING (auth.uid() = user_id);

-- Table for inventory movements (entries and exits)
CREATE TABLE IF NOT EXISTS mouvements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('entree', 'sortie')), -- entry or exit
    produit TEXT NOT NULL, -- product name
    projet TEXT, -- project name (optional)
    quantite DECIMAL(10,3) NOT NULL, -- quantity (barres for entries, pouces for exits)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on movements
ALTER TABLE mouvements ENABLE ROW LEVEL SECURITY;

-- RLS policies for movements
CREATE POLICY "Users can manage their own movements" ON mouvements
    FOR ALL USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON mouvements TO authenticated;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_projets_user_id ON projets(user_id);
CREATE INDEX IF NOT EXISTS idx_mouvements_user_id ON mouvements(user_id);
CREATE INDEX IF NOT EXISTS idx_mouvements_date ON mouvements(date);
CREATE INDEX IF NOT EXISTS idx_mouvements_type ON mouvements(type);