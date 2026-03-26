# README Back-Office Web — CESIZen

## Présentation

Le back-office web de CESIZen est l’interface d’administration de l’application.
Il permet aux administrateurs de gérer les contenus d’information publiés dans l’application, ainsi que les comptes utilisateurs.

Le périmètre couvert est cohérent avec les modules retenus pour le prototype :

- comptes utilisateurs
- informations
- exercices de respiration (gestion indirecte côté administration si besoin)

## Objectifs du back-office

Le back-office doit permettre à un administrateur de :

- se connecter à l’espace d’administration
- consulter les contenus existants
- créer un contenu
- modifier un contenu
- publier, dépublier ou désactiver un contenu
- consulter la liste des utilisateurs
- créer un compte administrateur ou utilisateur
- activer, désactiver ou supprimer un compte

## Stack technique

- React
- Vite
- JavaScript
- React Router (si utilisé dans le projet)
- API REST CESIZen

## Prérequis

- Node.js LTS
- npm
- API CESIZen lancée localement

## Installation

```bash
cd web
npm install
```

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3546/api
```

## Lancement en développement

```bash
npm run dev
```

Le projet est ensuite accessible depuis l’URL indiquée par Vite, généralement :

```txt
http://localhost:5173
```

## Build de production

```bash
npm run build
npm run preview
```

## Fonctionnement attendu

Le back-office communique avec l’API CESIZen pour réaliser les opérations d’administration.

Exemples d’actions attendues :

- authentification administrateur
- récupération de la liste des contenus
- création / modification de contenu
- changement de statut d’un contenu
- récupération de la liste des utilisateurs
- activation / désactivation / suppression d’un utilisateur

## Arborescence type conseillée

```txt
src/
  components/
  pages/
    Login.jsx
    Dashboard.jsx
    ContentsList.jsx
    ContentForm.jsx
    UsersList.jsx
  services/
    api.js
    authService.js
    contentService.js
    userService.js
  hooks/
  utils/
  App.jsx
  main.jsx
```

## Pages recommandées

### Connexion administrateur

Permet à un administrateur de s’authentifier pour accéder au back-office.

### Tableau de bord

Permet d’avoir une vue d’ensemble rapide des contenus et des comptes.

### Gestion des contenus

Permet de :

- afficher la liste des contenus
- créer un contenu
- modifier un contenu
- changer le statut d’un contenu

### Gestion des utilisateurs

Permet de :

- afficher la liste des utilisateurs
- créer un compte
- modifier un statut
- désactiver ou supprimer un compte

## Sécurité et bonnes pratiques

- protéger les routes d’administration côté front
- stocker le jeton d’authentification de manière cohérente avec le projet
- vérifier systématiquement les droits côté API
- ne jamais considérer la protection front comme suffisante
- afficher des messages d’erreur clairs en cas d’échec d’appel API
- centraliser les appels HTTP dans un service dédié

## Vérifications rapides

Avant démonstration ou recette, vérifier que :

- l’API CESIZen est démarrée
- `VITE_API_URL` pointe vers la bonne URL
- un compte administrateur existe en base
- la connexion administrateur fonctionne
- la création et la modification de contenu fonctionnent
- la gestion des utilisateurs fonctionne

