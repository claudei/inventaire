# Inventaire - Application de gestion d'inventaire avec synchronisation temps réel

## Fonctionnalités

Cette application de gestion d'inventaire inclut maintenant la **synchronisation en temps réel** pour l'affichage de la table 'inventaire'.

### Synchronisation temps réel

La synchronisation temps réel permet à tous les utilisateurs connectés de voir instantanément les changements suivants :

- ✅ **Ajout** d'un nouveau produit (INSERT)
- ✅ **Modification** d'un produit existant (UPDATE) 
- ✅ **Suppression** d'un produit (DELETE)

### Architecture

L'application utilise **Supabase** pour la synchronisation temps réel :

- `script.js` : Contient la logique de connexion Supabase et les gestionnaires d'événements temps réel
- `index.html` : Interface utilisateur principale avec intégration du système temps réel
- Abonnement à la table `inventaire` via `supabase.channel()`
- Écoute des événements PostgreSQL (`postgres_changes`)

### Configuration

Pour utiliser avec un vrai projet Supabase :

1. Remplacer dans `script.js` :
   ```javascript
   const supabaseUrl = 'https://your-supabase-url.supabase.co';
   const supabaseKey = 'your-anon-key';
   ```

2. Créer une table `inventaire` dans Supabase avec les colonnes :
   - `nom` (text)
   - `categorie` (text)  
   - `longueur` (numeric)
   - `poids` (numeric)
   - `prix_livre` (numeric)
   - `seuil` (numeric)

3. Activer Row Level Security et configurer les politiques appropriées

### Démonstration

L'implémentation actuelle inclut un système de simulation pour démontrer les fonctionnalités temps réel sans connexion Supabase active.

## Installation

1. Cloner le repository
2. Ouvrir `index.html` dans un navigateur web
3. L'application fonctionne entièrement côté client

## Technologies

- HTML5 / CSS3 / JavaScript (Vanilla)
- Supabase (Client JavaScript)
- Architecture événementielle pour les mises à jour temps réel