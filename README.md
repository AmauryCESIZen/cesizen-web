# CESIZen Back-Office

Interface d'administration de CESIZen, réservée aux administrateurs. Permet de gérer les contenus d'information, les comptes utilisateurs, les catégories et les presets de respiration.

## Stack

- **React 19**
- **Vite 8**
- **React Router 7** (createBrowserRouter)
- **Axios** (client HTTP)
- **JavaScript (JSX)**

## Prérequis

- Node.js 18+
- npm
- [cesizen-api](https://github.com/AmauryCESIZen/cesizen-api) démarrée (Docker Compose)

## Installation

```bash
git clone https://github.com/AmauryCESIZen/cesizen-web.git
cd cesizen-web
npm install
```

## Configuration

La baseURL de l'API est définie dans `src/services/apiClient.js` :

```js
const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
});
```

Si l'API tourne via Docker (port 3546), modifier cette URL en `http://localhost:3546/api`.

## Lancement

```bash
npm run dev
```

Accessible sur `http://localhost:5173`. Se connecter avec le compte admin de seed : `admin@cesizen.fr`.

## Build

```bash
npm run build
npm run preview
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Authentification administrateur |
| `/admin` | DashboardPage | Tableau de bord (stats utilisateurs, contenus, presets) |
| `/admin/users` | UsersPage | Liste des utilisateurs, désactivation, suppression |
| `/admin/contents` | ContentsPage | Liste des contenus, création, modification, publication |
| `/admin/categories` | CategoriesPage | CRUD des catégories |
| `/admin/presets` | PresetsPage | CRUD des presets de respiration |

Toutes les routes `/admin/*` sont protégées par le composant `ProtectedRoute` (vérification du token JWT stocké côté client).

## Structure

```
src/
├── app/
│   └── router.jsx           # Définition des routes (createBrowserRouter)
├── components/
│   ├── Header.jsx            # Barre supérieure
│   ├── Sidebar.jsx           # Menu latéral
│   ├── ProtectedRoute.jsx    # Garde d'authentification
│   └── StatusBadge.jsx       # Badge de statut (ACTIF, PUBLIE, etc.)
├── layouts/
│   └── AdminLayout.jsx       # Layout avec sidebar + header
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── UsersPage.jsx
│   ├── ContentsPage.jsx
│   ├── CategoriesPage.jsx
│   └── PresetsPage.jsx
├── services/
│   ├── apiClient.js          # Instance Axios + intercepteur JWT
│   ├── authService.js        # Login, getMe
│   ├── userService.js        # getAllUsers, disableUser, deleteUser
│   ├── contentService.js     # CRUD contenus (routes admin)
│   ├── categoryService.js    # CRUD catégories
│   ├── presetService.js      # CRUD presets
│   └── dashboardService.js   # Agrégation des stats pour le dashboard
├── utils/
│   └── authStorage.js        # Stockage du token JWT
├── index.css
└── main.jsx
```

## Fonctionnement

Le back-office consomme l'API CESIZen via Axios. Un intercepteur dans `apiClient.js` injecte automatiquement le token JWT (Bearer) dans chaque requête. Le token est récupéré depuis `authStorage`.

Le `DashboardPage` agrège les données de tous les services en parallèle (`Promise.all`) pour afficher les stats : nombre d'utilisateurs actifs, contenus publiés, catégories et presets actifs.
