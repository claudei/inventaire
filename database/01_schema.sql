-- Schema for the inventaire table
-- This file defines the structure of the inventory table based on the application requirements

CREATE TABLE IF NOT EXISTS inventaire (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    categorie TEXT NOT NULL,
    nom_produit TEXT NOT NULL,
    longueur DECIMAL(10,2) NOT NULL, -- en pieds
    largeur DECIMAL(10,2),
    hauteur DECIMAL(10,2),
    epaisseur DECIMAL(10,2),
    poids DECIMAL(10,3) NOT NULL, -- lb/pied
    prix_livre DECIMAL(10,2) NOT NULL, -- prix par livre
    inventaire_restant DECIMAL(10,2) NOT NULL DEFAULT 0, -- en barres
    seuil_min DECIMAL(10,2) NOT NULL DEFAULT 0, -- seuil minimum en barres
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_inventaire_user_id ON inventaire(user_id);
CREATE INDEX IF NOT EXISTS idx_inventaire_categorie ON inventaire(categorie);
CREATE INDEX IF NOT EXISTS idx_inventaire_nom_produit ON inventaire(nom_produit);

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventaire_updated_at 
    BEFORE UPDATE ON inventaire 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();