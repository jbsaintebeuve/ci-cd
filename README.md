# ci-cd-jbsaintebeuve

[![CI/CD](https://github.com/jbsaintebeuve/ci-cd/actions/workflows/build_test_deploy_react.yml/badge.svg)](https://github.com/jbsaintebeuve/ci-cd/actions)

Application React d'inscription avec validation de formulaire, persistance locale et pipeline CI/CD complet.

## Fonctionnalités

- Formulaire d'inscription avec validation en temps réel (nom, prénom, email, date de naissance, ville, code postal)
- Sélecteur de date avec `react-day-picker`
- Validation côté client (nom, email, code postal, majorité 18+)
- Liste des inscrits mise à jour automatiquement (stockage localStorage + événements cross-onglets)
- Notifications toast avec `sonner`
- Interface responsive avec Tailwind CSS v4 et shadcn/ui

## Stack technique

| Technologie | Version |
|-------------|---------|
| React | 19 |
| TypeScript | ~6.0 |
| Vite | 8 |
| Tailwind CSS | 4 |
| shadcn/ui | — |
| Vitest | 3 |
| JSDoc | 4 |

## Prérequis

- Node.js 20+

## Installation

```bash
npm install
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile TypeScript + build production |
| `npm run preview` | Prévisualise le build de production |
| `npm test` | Exécute les tests avec couverture |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run jsdoc` | Génère la documentation JSDoc dans `public/docs/` |

## Structure du projet

```
src/
├── main.tsx                       # Point d'entrée
├── App.tsx                        # Composant racine
├── index.css                      # Styles Tailwind
├── components/
│   ├── RegistrationForm.tsx       # Formulaire d'inscription
│   ├── UserList.tsx               # Liste des inscrits
│   └── ui/                        # Primitives shadcn/ui
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── popover.tsx
├── lib/
│   └── utils.ts                   # Utilitaire de classes Tailwind (cn)
├── services/
│   └── storageService.ts          # Persistance localStorage
└── utils/
    └── validation.ts              # Fonctions de validation
```

## CI/CD

Sur chaque push ou Pull Request vers `main`, le pipeline GitHub Actions :

1. Installe les dépendances
2. Génère la documentation JSDoc
3. Compile le projet
4. Exécute les tests avec couverture (istanbul)
5. Publie sur npm (version taguée)
6. Déploie sur GitHub Pages

## Documentation

La documentation JSDoc est accessible à l'adresse :

[https://jbsaintebeuve.github.io/ci-cd/docs/](https://jbsaintebeuve.github.io/ci-cd/docs/)

Génération locale :

```bash
npm run jsdoc
```

## Licence

ISC
