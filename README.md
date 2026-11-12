# E-Commerce Informatique - Application Angular

## Description

Une plateforme e-commerce complète pour la vente de produits informatiques, développée en Angular 16. L'application permet la gestion des produits, des catégories, des commandes et des utilisateurs (Admin et Client).

## Fonctionnalités

### 🔐 Authentification
- **Page de Connexion** : Authentification sécurisée avec email et mot de passe
- **Deux rôles d'utilisateurs** : Admin et Client
- **Protection des routes** : Guard pour protéger l'accès selon le rôle

### 👨‍💼 Tableau de Bord Admin
- **Gestion des Commandes** : Visualiser et confirmer les commandes des clients
- **Gestion des Produits** : Ajouter, consulter et supprimer des produits
- **Gestion des Catégories** : Ajouter et supprimer des catégories de produits

### 👤 Tableau de Bord Client
- **Catalog de Produits** : Parcourir tous les produits informatiques disponibles
- **Filtrage par Catégorie** : Filtrer les produits par catégorie
- **Panier d'Achat** : Ajouter des articles au panier et gérer les quantités
- **Passage de Commande** : Confirmer et soumettre les commandes
- **Historique de Commandes** : Consulter l'état de ses commandes

## Installation et Démarrage

### Prérequis
- Node.js (v18+)
- npm (v9+)

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer le serveur JSON (pour les données)**
   ```bash
   npm run json-server
   ```
   Le serveur sera disponible sur `http://localhost:3000`

3. **Démarrer l'application Angular (dans un autre terminal)**
   ```bash
   npm start
   ```
   L'application sera disponible sur `http://localhost:4200`

## Comptes de démonstration

### Administrateur
- **Email** : `admin@test.com`
- **Mot de passe** : `password123`

### Client
- **Email** : `client@test.com`
- **Mot de passe** : `password123`

## Utilisation

### Pour un Client
1. Se connecter avec les identifiants client
2. Parcourir le catalogue de produits
3. Utiliser le filtre pour chercher par catégorie
4. Ajouter des produits au panier
5. Vérifier le panier et modifier les quantités
6. Passer la commande
7. Consulter l'historique des commandes

### Pour un Admin
1. Se connecter avec les identifiants admin
2. **Onglet Commandes** : Voir toutes les commandes des clients et les confirmer
3. **Onglet Produits** : 
   - Voir la liste des produits
   - Ajouter de nouveaux produits
   - Supprimer des produits
4. **Onglet Catégories** :
   - Voir la liste des catégories
   - Ajouter de nouvelles catégories
   - Supprimer des catégories

## Technologies utilisées

- **Framework** : Angular 16
- **Langage** : TypeScript 5.1
- **Styling** : CSS3
- **HTTP Client** : Angular HttpClientModule
- **Forms** : Reactive Forms et Template-driven Forms
- **Routage** : Angular Router
- **UI Component** : Angular Material

## Commandes npm disponibles

- `npm start` : Démarre le serveur de développement
- `npm build` : Compile l'application pour la production
- `npm test` : Lance les tests unitaires
- `npm run json-server` : Démarrage du serveur JSON pour les données
- `npm run watch` : Compilation en mode watch

## Notes importantes

1. **Authentification** : Les données d'authentification sont stockées en localStorage
2. **Panier** : Le panier est stocké en localStorage et persiste entre les sessions
3. **API** : L'application utilise JSON Server pour simuler une API REST
4. **Sécurité** : Cette application est une démonstration. En production, utilisez une authentification sécurisée

## Structure du projet

L'application est organisée avec des:
- Composants pour l'interface utilisateur
- Services pour la logique métier
- Guards pour la protection des routes
- Modèles pour la typage des données

