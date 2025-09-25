# Inventaire - Application de Gestion d'Inventaire

Une application web de gestion d'inventaire avec authentification sécurisée via Supabase.

## 🔒 Sécurité Implémentée

Cette application utilise **Row Level Security (RLS)** de Supabase pour garantir que :
- ✅ Les utilisateurs authentifiés peuvent uniquement accéder à leurs propres données
- ✅ Les utilisateurs non authentifiés n'ont aucun accès aux données
- ✅ Les opérations CRUD sont strictement limitées par utilisateur

## 📁 Structure du Projet

```
inventaire/
├── index.html              # Interface principale de l'application
├── inventaire.html          # Vue d'inventaire triable
├── script.js               # Configuration Supabase et fonctions d'authentification
├── auth-test.html          # Page de test de sécurité
├── database/               # Scripts SQL de configuration
│   ├── 01_schema.sql       # Schéma des tables
│   ├── 02_rls_policies.sql # Politiques de sécurité RLS
│   └── 03_additional_tables.sql # Tables supplémentaires
├── SECURITY_SETUP.md       # Documentation détaillée de la sécurité
└── README.md              # Ce fichier
```

## 🚀 Installation et Configuration

### Prérequis
- Un projet Supabase configuré
- Serveur web pour servir les fichiers HTML (pas de file://)

### Étapes de Configuration

1. **Configuration Supabase**
   ```bash
   # Connectez-vous à votre tableau de bord Supabase
   # Allez dans SQL Editor et exécutez dans l'ordre :
   
   # 1. Créer le schéma
   database/01_schema.sql
   
   # 2. Configurer la sécurité RLS
   database/02_rls_policies.sql
   
   # 3. Tables supplémentaires (optionnel)
   database/03_additional_tables.sql
   ```

2. **Configuration Frontend**
   
   Modifiez `script.js` avec vos vraies valeurs Supabase :
   ```javascript
   const supabaseUrl = 'https://votre-project-id.supabase.co';
   const supabaseKey = 'votre-anon-key-publique';
   ```

3. **Test de la Configuration**
   
   Ouvrez `auth-test.html` dans votre navigateur pour tester la sécurité.

## 🧪 Tests de Sécurité

### Tests Automatiques
Utilisez `auth-test.html` pour :
- ✅ Vérifier que l'accès non authentifié est refusé
- ✅ Tester l'authentification et l'accès aux données
- ✅ Valider l'isolation des données entre utilisateurs

### Tests Manuels

#### Test 1 : Accès Non Authentifié
```javascript
// Dans la console du navigateur (sans être connecté)
const { data, error } = await supabase.from('inventaire').select('*');
// Résultat attendu : error avec message d'accès refusé
```

#### Test 2 : Accès Authentifié
```javascript
// Après authentification
const { data, error } = await database.getInventaire();
// Résultat attendu : data contient uniquement les données de l'utilisateur connecté
```

## 🔧 Utilisation de l'Application

### Authentification
L'application nécessite une authentification pour accéder aux données. Implémentez l'interface d'authentification dans vos pages HTML :

```javascript
import { auth } from './script.js';

// Connexion
const { user, error } = await auth.signIn('email', 'password');

// Inscription
const { user, error } = await auth.signUp('email', 'password');

// Déconnexion
await auth.signOut();
```

### Gestion des Données

```javascript
import { database } from './script.js';

// Récupérer l'inventaire
const { data, error } = await database.getInventaire();

// Ajouter un élément
const nouvelElement = {
    categorie: 'Aluminium',
    nom_produit: 'Tube 2"',
    longueur: 12.0,
    poids: 1.5,
    prix_livre: 2.50,
    inventaire_restant: 10,
    seuil_min: 5
};
await database.addInventaire(nouvelElement);
```

## 🛡️ Politiques de Sécurité

### Politiques RLS Implémentées

1. **SELECT** : `auth.uid() = user_id`  
   Les utilisateurs ne voient que leurs propres données

2. **INSERT** : `auth.uid() = user_id`  
   Les utilisateurs ne peuvent créer que des données liées à leur compte

3. **UPDATE** : `auth.uid() = user_id`  
   Les utilisateurs ne peuvent modifier que leurs propres données

4. **DELETE** : `auth.uid() = user_id`  
   Les utilisateurs ne peuvent supprimer que leurs propres données

5. **DENY ALL** pour les utilisateurs non authentifiés

## 📊 Structure de la Base de Données

### Table `inventaire`
- `id` : UUID (Primary Key)
- `user_id` : UUID (Foreign Key vers auth.users)
- `categorie` : TEXT
- `nom_produit` : TEXT
- `longueur` : DECIMAL(10,2)
- `largeur` : DECIMAL(10,2)
- `hauteur` : DECIMAL(10,2)
- `epaisseur` : DECIMAL(10,2)
- `poids` : DECIMAL(10,3)
- `prix_livre` : DECIMAL(10,2)
- `inventaire_restant` : DECIMAL(10,2)
- `seuil_min` : DECIMAL(10,2)
- `created_at` : TIMESTAMP WITH TIME ZONE
- `updated_at` : TIMESTAMP WITH TIME ZONE

## 🚨 Résolution de Problèmes

### Erreur : "Row Level Security policy violation"
- Vérifiez que l'utilisateur est bien authentifié
- Contrôlez que les politiques RLS sont correctement configurées

### Erreur : "relation does not exist"
- Exécutez les scripts SQL de création des tables
- Vérifiez que vous êtes connecté à la bonne base de données

### Tests de sécurité échouent
- Vérifiez la configuration des URL et clés Supabase
- Assurez-vous que RLS est activé sur toutes les tables
- Consultez les logs Supabase pour plus de détails

## 📝 Documentation Complète

Pour une documentation détaillée de la configuration de sécurité, consultez [SECURITY_SETUP.md](SECURITY_SETUP.md).

## 🆘 Support

En cas de problème :
1. Vérifiez la configuration Supabase
2. Consultez les logs de votre projet Supabase
3. Testez avec `auth-test.html`
4. Reportez-vous à la documentation Supabase officielle

---

**Sécurité** : Cette application implémente les meilleures pratiques de sécurité avec RLS. Toutes les données sont isolées par utilisateur et l'accès non authentifié est strictement interdit.