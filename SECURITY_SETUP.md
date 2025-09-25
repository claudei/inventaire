# Configuration de la Sécurité Supabase - Table Inventaire

## Résumé des Modifications

Ce document décrit la configuration de la sécurité Row Level Security (RLS) pour la base de données Supabase de l'application inventaire.

### Fichiers Créés/Modifiés :

1. **`database/01_schema.sql`** - Schéma de la table inventaire principale
2. **`database/02_rls_policies.sql`** - Configuration RLS et politiques de sécurité
3. **`database/03_additional_tables.sql`** - Tables supplémentaires (catégories, projets, mouvements)
4. **`script.js`** - Fonctions d'authentification et d'accès à la base de données
5. **`SECURITY_SETUP.md`** - Documentation de configuration

## Configuration de Sécurité Implementée

### 1. Row Level Security (RLS) Activé

```sql
ALTER TABLE inventaire ENABLE ROW LEVEL SECURITY;
```

### 2. Politiques de Sécurité

#### Pour les utilisateurs authentifiés :
- **SELECT** : Les utilisateurs peuvent lire leurs propres données uniquement
- **INSERT** : Les utilisateurs peuvent créer de nouveaux éléments liés à leur compte
- **UPDATE** : Les utilisateurs peuvent modifier leurs propres données uniquement
- **DELETE** : Les utilisateurs peuvent supprimer leurs propres données uniquement

#### Pour les utilisateurs non authentifiés :
- **Aucun accès** : Toutes les opérations sont interdites via la politique explicite de refus

### 3. Structure de la Base de Données

#### Table `inventaire` :
- `id` : Identifiant unique (UUID)
- `user_id` : Référence à l'utilisateur authentifié
- `categorie` : Catégorie du produit
- `nom_produit` : Nom du produit
- `longueur`, `largeur`, `hauteur`, `epaisseur` : Dimensions
- `poids` : Poids par pied (lb/pied)
- `prix_livre` : Prix par livre
- `inventaire_restant` : Quantité restante
- `seuil_min` : Seuil minimum d'alerte

## Instructions d'Installation

### Étape 1 : Configuration Supabase

1. Connectez-vous à votre tableau de bord Supabase
2. Accédez à l'éditeur SQL
3. Exécutez les scripts SQL dans l'ordre :
   ```bash
   # 1. Créer le schéma
   database/01_schema.sql
   
   # 2. Configurer RLS
   database/02_rls_policies.sql
   
   # 3. Tables supplémentaires (optionnel)
   database/03_additional_tables.sql
   ```

### Étape 2 : Configuration Frontend

1. Mettez à jour les URLs et clés dans `script.js` :
   ```javascript
   const supabaseUrl = 'https://votre-project-url.supabase.co';
   const supabaseKey = 'votre-anon-key';
   ```

2. Implémentez l'interface d'authentification dans vos pages HTML

## Tests de Sécurité

### Tests Côté Frontend

#### Test 1 : Accès Non Authentifié
```javascript
// Sans authentification, cette requête doit échouer
const { data, error } = await supabase
  .from('inventaire')
  .select('*');

// Résultat attendu : error avec message d'accès refusé
console.log('Erreur attendue:', error);
```

#### Test 2 : Authentification et Accès
```javascript
// 1. S'authentifier
const { user, error: authError } = await auth.signIn('test@example.com', 'password');

// 2. Accéder aux données (doit fonctionner)
const { data, error } = await database.getInventaire();
console.log('Données accessibles:', data);
```

#### Test 3 : Isolation des Données Utilisateur
```javascript
// Créer un élément avec un utilisateur
const { data: item1 } = await database.addInventaire({
  categorie: 'Test',
  nom_produit: 'Produit 1',
  longueur: 10,
  poids: 1.5,
  prix_livre: 2.0,
  inventaire_restant: 5,
  seuil_min: 2
});

// Se connecter avec un autre utilisateur
await auth.signOut();
await auth.signIn('autre@example.com', 'password');

// Vérifier que l'autre utilisateur ne voit pas les données du premier
const { data } = await database.getInventaire();
// data ne doit pas contenir item1
```

### Tests Depuis la Console Supabase

1. **Vérifier RLS activé** :
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'inventaire';
   ```

2. **Lister les politiques** :
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'inventaire';
   ```

3. **Tester l'accès direct** :
   ```sql
   -- Cette requête doit échouer car pas d'utilisateur authentifié
   SELECT * FROM inventaire;
   ```

### Résultats Attendus

#### ✅ Succès :
- Utilisateurs authentifiés peuvent CRUD leurs propres données
- Données isolées par utilisateur (un user ne voit pas les données d'un autre)
- Performance optimisée avec les index appropriés

#### ❌ Échecs Attendus :
- Accès non authentifié à toute donnée
- Tentative d'accès aux données d'un autre utilisateur
- Tentative de modification des données d'un autre utilisateur

## Surveillance et Maintenance

### Logs à Surveiller
- Tentatives d'accès non autorisé
- Échecs d'authentification répétés
- Opérations sur des données d'autres utilisateurs

### Recommandations
1. Mettre en place une rotation régulière des clés d'API
2. Surveiller les logs d'accès Supabase
3. Implémenter une politique de mots de passe forts
4. Considérer l'authentification à deux facteurs pour les utilisateurs sensibles

## Support

En cas de problème avec la configuration de sécurité :
1. Vérifiez que RLS est bien activé
2. Contrôlez que les politiques sont correctement créées
3. Assurez-vous que l'utilisateur est bien authentifié avant les opérations
4. Consultez les logs Supabase pour identifier les erreurs spécifiques